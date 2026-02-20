import { PrismaClient } from '@prisma/client';
import { NeynarAPIClient, FeedType, FilterType } from '@neynar/nodejs-sdk';
import { CastNormalizer } from '../src/lib/domain/normalize';
import { CandidateClassifier, CandidateType } from '../src/lib/domain/candidates';
import { ScoringEngine } from '../src/lib/domain/scoring';
import { VerdictEngine } from '../src/lib/domain/verdict';
import { PromotionEngine, PromotionContext } from '../src/lib/domain/promotion';
import { StateStore } from '../src/lib/store/state';
import { CurationStatus } from '../src/lib/types';
import { BaseAppDetector, DemoDetector, RepoDetector } from '../src/lib/domain/detectors';
import { RewardVerifier } from '../src/lib/domain/rewards';
import { AgentPublisher } from '../src/lib/agent/publisher';
import { TwitterAgent } from '../src/lib/agent/twitter';

const prisma = new PrismaClient();
const neynarKey = process.env.NEYNAR_API_KEY || "NEYNAR_API_DOCS";
const neynarClient = new NeynarAPIClient(neynarKey);

// Config
const FETCH_LIMIT = 200;

async function main() {
    console.log("🟢 Starting CuratoBase v7 Agent Cycle...");
    const cycleId = new Date().toISOString().split('T')[0];

    // 1. INGEST
    let casts: any[] = [];
    if (process.env.APPFACTS_FIXTURE === '1') {
        console.log("⚠️ USING FIXTURE DATA");
        casts = [{
            hash: "0xfixture" + Date.now(),
            text: "Testing a new BaseApp! Check it out at https://base.app/app/launcher-demo. I sent 50 USDC reward to the first user! Tx: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            author: { username: "demo-builder", fid: 999 },
            timestamp: new Date().toISOString(),
            replies: { count: 5 },
            reactions: { count: 10 },
            embeds: []
        }];
    } else if (process.env.NEYNAR_API_KEY) {
        console.log("📡 Fetching from Neynar...");
        try {
            const channels = ['base', 'ethereum', 'founders', 'launch'];
            console.log(`📡 Fetching from Neynar Sources: ${channels.join(', ')}`);

            const SAFE_LIMIT = 100;
            const SEVEN_DAYS_AGO = Date.now() - 7 * 24 * 60 * 60 * 1000;

            const fetchChannel = async (channelId: string) => {
                let channelCasts: any[] = [];
                let cursor: string | undefined;

                // Fetch up to 5 pages (500 items) or until time window
                for (let i = 0; i < 5; i++) {
                    try {
                        const feed = await neynarClient.fetchFeed(FeedType.Filter, {
                            filterType: FilterType.ChannelId,
                            channelId: channelId,
                            limit: SAFE_LIMIT,
                            cursor: cursor
                        });

                        const newCasts = feed.casts || [];
                        channelCasts = [...channelCasts, ...newCasts];

                        // Check time window
                        const oldest = newCasts[newCasts.length - 1];
                        if (oldest && new Date(oldest.timestamp).getTime() < SEVEN_DAYS_AGO) break;

                        cursor = feed.next?.cursor || undefined;
                        if (!cursor) break;

                    } catch (e) {
                        console.log(`   ❌ Page error ${channelId}: ${(e as any).message}`);
                        break;
                    }
                }
                console.log(`   ✅ Fetched ${channelCasts.length} from ${channelId}`);
                return channelCasts;
            };

            const promises = channels.map(c => fetchChannel(c));

            // Add Global Trending (Viral discovery)
            const globalTrending = neynarClient.fetchFeed(FeedType.Filter, {
                filterType: FilterType.GlobalTrending,
                limit: 100
            }).then(r => {
                console.log(`   🔥 Global Trending: Found ${r.casts.length}`);
                return r.casts;
            }).catch(e => {
                console.log(`   ⚠️ Trending failed: ${e.message}`);
                return [];
            });

            const results = await Promise.all([...promises, globalTrending]);
            let allCasts = results.flat();

            // Fetch from Twitter
            try {
                const twitterAgent = new TwitterAgent();
                const twitterSignals = await twitterAgent.fetchEcosystemSignals();
                allCasts = [...allCasts, ...twitterSignals];
            } catch (tErr) {
                console.log("⚠️ Twitter fetch failed.", tErr);
            }

            // Dedup by hash
            const seen = new Set();
            casts = allCasts.filter((c: any) => {
                if (seen.has(c.hash)) return false;
                seen.add(c.hash);
                return true;
            });
            console.log(`✅ Merged: ${casts.length} unique casts (Deep Scan + Trending).`);

        } catch (e) {
            console.log("⚠️ Feed fetch failed.", e);
            casts = [];
        }
    }

    console.log(`Pipeline: Processing ${casts.length} items...`);

    // Process Pipeline
    const candidates: any[] = []; // Store processed items

    // 2. PROCESS PIPELINE
    for (const cast of casts) {
        // A. Normalize
        const normalized = CastNormalizer.normalize(cast);
        if (!normalized) continue;

        // B. Classify
        const candidate = CandidateClassifier.classify(normalized);
        if (candidate.type === CandidateType.OTHER) continue; // Skip noise

        // v7: DETECTORS (Run early to inform Context)
        const baseAppSignal = BaseAppDetector.detect(normalized.text, normalized.embeds);
        if (baseAppSignal.isBaseApp) {
            console.log(`🔎 DETECTED BASE APP: ${baseAppSignal.appSlug} | URL: ${baseAppSignal.appUrl}`);
        }
        const hasRepo = RepoDetector.detect(normalized.text, normalized.embeds);

        // Demo is: detected demo url OR confirmed base app
        const hasDemo = DemoDetector.detect(normalized.text, normalized.embeds) || baseAppSignal.isBaseApp;

        // v7: REWARD VERIFICATION
        const rewardCheck = await RewardVerifier.verify(normalized.text);

        // E. State (Seen Count, Reputation)
        const authorName = normalized.authorUsername || "unknown";
        const builderStatsRaw = StateStore.getAuthorStats(authorName);
        const builderConfidence = builderStatsRaw.shipCount > 3 ? "HIGH" : "NORMAL";

        // C. Scoring & Verdict (Legacy but kept for DB compatibility)
        const scores = ScoringEngine.score(candidate, builderConfidence);
        const verdict = VerdictEngine.decide(candidate, scores, builderConfidence);

        // We use StateStore.updateAppStats to track seen count for this "App Key"
        // We defer determining App Key to BaseAppDetector or cast hash fallback
        const appKey = baseAppSignal.appSlug || normalized.castHash;

        // We manually manage stat update here to get the 'AppStats' object back if needed
        StateStore.updateAppStats(appKey, Date.now(), normalized.castHash);
        const appStats = StateStore.getAppStats(appKey);

        // F. PROMOTION ENGINE (v7)
        const promoCtx: PromotionContext = {
            seenCount: appStats.seenCount,
            uniqueRepliers: normalized.engagementSnapshot?.replies || 0, // FIXED property access
            hasDemo,
            hasRepo,
            rewardStatus: rewardCheck.status,
            totalCandidates: casts.length
        };

        const promotion = PromotionEngine.evaluate(candidate, promoCtx);
        verdict.status = promotion.status; // Override verdict status

        candidates.push({
            id: candidate.cast.castHash, // FIXED property access
            status: promotion.status,
            appKey,
            fullObject: { candidate, verdict, scores, promotion, baseAppSignal, rewardCheck }
        });
    }

    // 3. ENFORCE PRESTIGE QUOTA (v7)
    // Map candidates to simplified objects
    const quotaInput = candidates.map(c => ({ id: c.id, result: c.fullObject.promotion }));
    const finalStatuses = PromotionEngine.enforceQuotas(quotaInput);

    const finalPrestige: any[] = [];
    const finalTopPicks: any[] = [];

    // 4. PERSIST & COLLECT
    for (const item of candidates) {
        let finalStatus = finalStatuses.get(item.id) || CurationStatus.IGNORED;
        const { candidate, verdict, scores, promotion, baseAppSignal, rewardCheck } = item.fullObject;

        // FORCE CANDIDATE STATUS for any Base App that isn't already Curated/Top Pick/Watchlist/Silence
        if (baseAppSignal.isBaseApp && finalStatus === CurationStatus.IGNORED) {
            finalStatus = CurationStatus.CANDIDATE;
        }

        verdict.status = finalStatus; // Apply enforced status

        // Collect for Publishing
        if (finalStatus === CurationStatus.CURATED) finalPrestige.push(item.fullObject);
        if (finalStatus === CurationStatus.TOP_PICK) finalTopPicks.push(item.fullObject);

        // DB Upsert
        // We use 'castHash' as ID for this version

        // Ensure builder exists (using username as ID)
        await prisma.builder.upsert({
            where: { id: candidate.cast.authorUsername },
            update: {},
            create: {
                id: candidate.cast.authorUsername,
                handles: candidate.cast.authorUsername,
                wallets: "unknown",
                trustScore: 0,
                confidenceLevel: "NORMAL"
            }
        });

        await prisma.app.upsert({
            where: { id: candidate.cast.castHash },
            update: {
                status: finalStatus,
                curationScore: scores.relevanceScore || 0, // FIXED: map from relevanceScore
                scoreBreakdown: JSON.stringify({
                    scores,
                    promotion,
                    rewardCheck,
                    baseAppSignal
                }),
                agentInsight: verdict.text,
                updatedAt: new Date()
                // urls not needed on update usually unless we want overwrite? Let's leave out for now or update.
            },
            create: {
                id: candidate.cast.castHash,
                // appKey removed as it is not in schema
                name: baseAppSignal.appSlug || `App ${candidate.cast.castHash.substring(0, 6)}`,
                description: candidate.cast.text,
                status: finalStatus,
                curationScore: scores.relevanceScore || 0, // FIXED
                scoreBreakdown: JSON.stringify({
                    scores,
                    promotion,
                    rewardCheck,
                    baseAppSignal
                }),
                agentInsight: verdict.text,
                // castHash removed
                createdAt: new Date(),
                updatedAt: new Date(),
                // builderHandle removed
                urls: JSON.stringify({ // FIXED: Provide urls
                    demo: candidate.evidence.demoUrls,
                    repo: candidate.evidence.repoUrls,
                    app: baseAppSignal.appUrl
                }),
                builder: {
                    connect: {
                        id: candidate.cast.authorUsername
                    }
                }
            } as any
        });
    }

    // 5. PUBLISH (Farcaster via Neynar)
    // TASK 4: REMOVE BOT-LIKE PUBLIC COPY
    // We do NOT publish individual posts anymore. Trust Report is the only public output.
    const publishable = [...finalPrestige, ...finalTopPicks];
    if (publishable.length > 0) {
        console.log(`✅ Cycle Processed ${publishable.length} notable items (Internal/Miniapp use only).`);
        // AgentPublisher usage removed to prevent bot-spam.
    } else {
        console.log("🔕 No notable items found in this cycle.");
    }

    console.log("✅ Cycle Complete.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
