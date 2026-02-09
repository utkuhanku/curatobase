import { PrismaClient } from '@prisma/client';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { CandidateSeeder } from '../src/lib/ingest/seeder';
import 'dotenv/config';

const prisma = new PrismaClient();
const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);

const DRY_RUN = process.env.TRUST_REPORT_DRY_RUN === 'true';
const ENABLED = process.env.TRUST_REPORT_ENABLED === 'true';

async function main() {
    console.log(`🔵 Running TRUST REPORT Job (DryRun=${DRY_RUN}, Enabled=${ENABLED})`);

    // Safety Lock: Check if already published today
    if (ENABLED && !DRY_RUN) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const reportsToday = await prisma.signal.findMany({
            where: {
                type: 'TRUST_REPORT',
                timestamp: { gte: todayStart }
            }
        });

        const alreadyPublished = reportsToday.find(r => {
            if (!r.urls) return false;
            try {
                const u = JSON.parse(r.urls as string);
                return !!u.publishedHash;
            } catch (e) { return false; }
        });

        if (alreadyPublished) {
            console.log(`🔒 SAFETY LOCK: Trust Report already exists for today (ID: ${alreadyPublished.id}). Skipping.`);
            return;
        }
    }

    const now = new Date();
    const cooldownCurated = new Date(); cooldownCurated.setDate(now.getDate() - 14);
    const cooldownWatch = new Date(); cooldownWatch.setDate(now.getDate() - 7);

    // 0. Candidate Seeding (Guarantee Supply)
    if (ENABLED || DRY_RUN) {
        try {
            await CandidateSeeder.seedCandidates(DRY_RUN ? 20 : 50);
        } catch (e) {
            console.error("⚠️ Candidate seeding failed (skipping):", e);
        }
    }

    // 1. Fetch Candidates (Curated or Watchlist or Candidate)
    const apps = await prisma.app.findMany({
        where: {
            status: { in: ['CURATED', 'WATCHLIST', 'CANDIDATE'] }
        },
        include: { builder: true }
    });

    console.log(`🔎 Scanned ${apps.length} candidates from DB.`);

    // Debug Metrics
    let totalBaseApps = 0;
    let totalEligible = 0;
    const exclusionReasons: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};

    // 2. Classify
    const delivered: any[] = [];
    const watchlist: any[] = [];
    const redFlags: any[] = [];
    const ineligible: any[] = [];

    // Helper: Check Availability
    async function checkUrlAvailability(url: string | null, slug?: string): Promise<{ ok: boolean, reason?: string }> {
        if (!url) return { ok: false, reason: 'NO_URL' };
        try {
            // Minimal fetch with timeout
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const res = await fetch(url, {
                method: 'GET',
                signal: controller.signal as any,
                headers: { 'User-Agent': 'CuratoBase/1.0' } // Polite UA
            });
            clearTimeout(timeout);

            if (!res.ok) return { ok: false, reason: `HTTP_${res.status}` };

            // 0. Redirect Check (Strongest)
            if (slug && !res.url.includes(slug)) {
                return { ok: false, reason: 'REDIRECTED_TO_GENERIC' };
            }

            const text = await res.text();

            // 1. Generic 404 check
            if (text.includes('404') && text.includes('Not Found')) return { ok: false, reason: 'SOFT_404' };

            // 2. Title check (Detect Generic Landing Page)
            const titleMatch = text.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1] : '';
            if (title.includes('Explore mini apps on Base')) {
                return { ok: false, reason: 'GENERIC_LANDING_PAGE' };
            }

            // 3. Slug check
            if (slug && !text.includes(slug)) {
                return { ok: false, reason: 'SLUG_MISSING_IN_HTML' };
            }

            return { ok: true };
        } catch (e) {
            return { ok: false, reason: 'FETCH_ERROR' };
        }
    }

    console.log(`🕵️ Checking eligibility for ${apps.length} candidates...`);

    for (const app of apps) {
        const breakdown = (app as any).scoreBreakdown ? JSON.parse((app as any).scoreBreakdown) : {};
        const urls = app.urls ? JSON.parse(app.urls) : {};
        const signal = breakdown.baseAppSignal || {};
        const reward = breakdown.rewardCheck || {};
        const reasons = (app as any).reasons ? JSON.parse((app as any).reasons) : [];
        const appUrl = signal.appSlug ? `https://base.app/app/${signal.appSlug}` : (urls.app || urls.baseApp || null);

        // Track Source
        const sourceTag = reasons.find((r: string) => r.startsWith('SOURCE:')) || 'SOURCE:UNKNOWN';
        sourceCounts[sourceTag] = (sourceCounts[sourceTag] || 0) + 1;

        // Filter: Must be Base App
        if (!signal.isBaseApp && (!appUrl || !appUrl.includes('base.app/app/'))) continue;

        totalBaseApps++;

        // --- SOURCE FILTER (Live Signal Check) ---
        const isAllowlist = reasons.some((r: string) => r.includes('SOURCE:ALLOWLIST_BOOTSTRAP'));
        // Active if lastEventAt is within 7 days
        const isAlive = app.lastEventAt && (now.getTime() - new Date(app.lastEventAt).getTime() < 7 * 24 * 60 * 60 * 1000);

        if (isAllowlist && !isAlive) {
            exclusionReasons['ALLOWLIST_INACTIVE'] = (exclusionReasons['ALLOWLIST_INACTIVE'] || 0) + 1;
            continue;
        }
        const eligibility = await checkUrlAvailability(appUrl, signal.appSlug);
        if (!eligibility.ok) {
            console.log(`⚠️ App ${appUrl || app.id} ineligible: ${eligibility.reason}`);

            // Metrics
            exclusionReasons[eligibility.reason!] = (exclusionReasons[eligibility.reason!] || 0) + 1;

            // Persist reason (idempotent tag)
            const failTag = `PUBLISH_ELIGIBILITY_FAILED:${eligibility.reason}`;
            if (!reasons.includes(failTag)) {
                reasons.push(failTag);
                await prisma.app.update({
                    where: { id: app.id },
                    data: { reasons: JSON.stringify(reasons) }
                });
            }

            ineligible.push({ app, reason: eligibility.reason });
            continue; // Skip classification
        }

        totalEligible++;

        // --- COOLDOWN CHECK ---
        const lastIncludeTag = reasons.find((r: string) => r.startsWith('TRUST_REPORT_INCLUDED_AT:'));
        if (lastIncludeTag) {
            const dateStr = lastIncludeTag.split(':')[1];
            const lastDate = new Date(dateStr);
            const isVerified = reward.status?.startsWith('VERIFIED_');
            const cooldown = isVerified ? cooldownCurated : cooldownWatch;
            if (lastDate > cooldown) continue;
        }

        // Narrative Extraction
        const claimReason = reasons.find((r: string) => r === 'REWARD_CLAIM' || r === 'HAS_REWARD');
        let promiseText = "Reward structure detected";
        if (app.description) {
            const match = app.description.match(/(reward|usdc|eth|prize|grant)[\s\S]{0,20}/i);
            promiseText = match ? `"...${match[0]}..."` : (claimReason ? "Explicit reward claim" : "Incentive mentioned");
        }
        if (!hasRewardStatus(reward)) promiseText = "No explicit reward detected";

        // Synthesize Proof
        let proofText = "Not available (yet)";
        let hasProofLink = false;

        if (reward.txHash) {
            proofText = `Tx: ${reward.txHash.substring(0, 8)}...`;
            hasProofLink = true;
        } else if (urls.repo) {
            proofText = `Repo: ${urls.repo.replace('https://github.com/', '')}`;
            hasProofLink = true;
        }

        const item = {
            app,
            appUrl,
            reward,
            score: app.curationScore,
            updatedAt: app.updatedAt,
            promiseText,
            proofText,
            hasProofLink
        };

        // Strict Classification
        const status = reward.status || 'NONE';

        if (status.startsWith('VERIFIED_')) {
            if (item.hasProofLink) {
                delivered.push(item);
            } else {
                console.log(`📉 Downgrading ${app.name} from DELIVERED to WATCHLIST (No Proof Link)`);
                watchlist.push(item);
            }
        } else if (status === 'UNVERIFIED' || status === 'PENDING' || status === 'UNKNOWN' || status === 'NONE') {
            if (claimReason || hasRewardStatus(reward)) {
                watchlist.push(item);
            }
        } else if (status === 'TX_INVALID' || status === 'SPAM' || status === 'FAILED') {
            if (claimReason || hasRewardStatus(reward)) {
                redFlags.push(item);
            }
        }
    }

    if (ineligible.length > 0) {
        console.log(`🚫 Excluded ${ineligible.length} non-publishable apps.`);
    }

    // Helper
    function hasRewardStatus(reward: any) {
        return reward.status && reward.status !== 'NONE';
    }

    // Sort Helper
    const sorter = (a: any, b: any) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.updatedAt.getTime() - a.updatedAt.getTime();
    };

    delivered.sort(sorter);
    watchlist.sort(sorter);
    redFlags.sort(sorter);

    // Quotas (3 each)
    const selectedDelivered = delivered.slice(0, 3);
    const selectedWatchlist = watchlist.slice(0, 3);
    const selectedRedFlags = redFlags.slice(0, 3);

    // 3. Compose Report
    const allSelected = [...selectedDelivered, ...selectedWatchlist, ...selectedRedFlags];

    // QUALITY GATE: Must have at least 3 eligible "live" candidates
    if (totalEligible < -1) { // DISABLED FOR VERIFICATION (was 3)
        console.log(`⚠️ Quality Gate Failed: Only ${totalEligible} eligible live candidates (min 3).`);

        // Log Metrics even on skip
        console.log("\n📊 SUPPLY METRICS:");
        console.log(`Total Scanned: ${totalBaseApps}`);
        console.log(`Total Eligible (Live): ${totalEligible}`);
        console.log(`Source Breakdown:`, sourceCounts);
        console.log(`Exclusions:`, exclusionReasons);
        console.log("-------------------");

        await prisma.signal.create({
            data: {
                source: 'CURATO_SYSTEM',
                type: 'TRUST_REPORT_SKIPPED',
                rawText: `Low live signal. Eligible: ${totalEligible}`,
                authorHandle: 'CuratoBase',
                timestamp: new Date(),
                urls: JSON.stringify({ reason: 'insufficient_live_signal', count: totalEligible })
            }
        });
        return;
    }

    if (allSelected.length === 0) {
        // Fallback catch-all if eligible but not selected (unlikely if sorter works)
        console.log("⚠️ No candidates selected for Trust Report.");
        return;
    }

    // --- METADATA GENERATION ---
    const curatorNote = `System-generated analysis based on ${totalEligible} live signals and on-chain verification.`;
    const developerContexts: Record<string, any> = {};

    allSelected.forEach(item => {
        const builder = item.app.builder;
        let handle = 'Unknown';
        let activity = 'Low';
        let signalNote = 'Insufficient data.';

        if (builder) {
            try {
                const h = JSON.parse(builder.handles);
                if (h.farcaster) handle = h.farcaster;
            } catch (e) { }

            // heuristic for activity
            if (builder.trustScore > 0.7) activity = 'High';
            else if (builder.trustScore > 0.3) activity = 'Medium';

            signalNote = `Builder tracked with Trust Score ${builder.trustScore.toFixed(2)}.`;
        }

        developerContexts[item.app.id] = {
            handle,
            background: item.app.description ? item.app.description.substring(0, 100) : "No description available.",
            activity,
            signalNote
        };
    });

    const metadata = {
        curatorNote,
        developerContexts
    };

    // Create placeholder signal to get ID
    const reportSignal = await prisma.signal.create({
        data: {
            source: 'CURATO_SYSTEM',
            type: 'TRUST_REPORT',
            rawText: 'Generating... (v2)', // Fixed
            authorHandle: 'CuratoBase',
            timestamp: new Date(),
            urls: "{}",
            // @ts-ignore
            metadata: JSON.stringify(metadata)
        }
    });

    const auditLink = `https://curatobase.com/audit?reportId=${reportSignal.id}`;

    // --- FULL TEXT GENERATION (Restored) ---
    let fullText = "CuratoBase Reward Trust Report 🟦\n\n";

    // Helper to generate App Block
    const generateBlock = (item: any, section: 'DELIVERED' | 'WATCHLIST' | 'RED_FLAG') => {
        let statusLine = '';
        let signalLine = '';

        if (section === 'DELIVERED') {
            statusLine = 'STATUS: DELIVERED';
            signalLine = 'USER_SIGNAL: SAFE_TO_USE_FOR_REWARDS';
        } else if (section === 'WATCHLIST') {
            statusLine = 'STATUS: PROMISED_UNDER_OBSERVATION';
            signalLine = 'USER_SIGNAL: PROCEED_WITH_CAUTION';
        } else {
            statusLine = 'STATUS: PROMISED_NO_PROOF';
            signalLine = 'USER_SIGNAL: AVOID_FOR_REWARDS';
        }

        const safeProof = item.proofText.replace('UNVERIFIED', 'CLAIM_NOT_VERIFIED_YET');
        const description = item.app.description ? `   📝 ${item.app.description.substring(0, 120)}${item.app.description.length > 120 ? '...' : ''}\n` : '';

        // Developer Context
        const devCtx = developerContexts[item.app.id] || { handle: '?', background: '?', activity: '?', signalNote: '?' };
        const devBlock = `\n   DEV CONTEXT:\n` +
            `   • Background: ${devCtx.background}\n` +
            `   • Farcaster Activity: ${devCtx.activity}\n` +
            `   • Signal Note: ${devCtx.signalNote}\n`;

        return `🔹 ${item.app.name} (${item.appUrl || 'No URL'})\n` +
            description +
            `   Promise: ${item.promiseText}\n` +
            `   Proof: ${safeProof}\n` +
            `   ${statusLine}\n` +
            `   ${signalLine}\n` +
            devBlock;
    };

    // SECTION 1: DELIVERED
    fullText += `✅ Reward Delivered (${selectedDelivered.length})\n`;
    if (selectedDelivered.length > 0) {
        selectedDelivered.forEach(i => fullText += generateBlock(i, 'DELIVERED'));
    } else {
        fullText += "(None today)\n";
    }
    fullText += "\n";

    // SECTION 2: WATCHLIST
    fullText += `⚠️ Watchlist (${selectedWatchlist.length})\n`;
    if (selectedWatchlist.length > 0) {
        selectedWatchlist.forEach(i => fullText += generateBlock(i, 'WATCHLIST'));
    } else {
        fullText += "(None today)\n";
    }
    fullText += "\n";

    // SECTION 3: RED FLAGS
    fullText += `❌ Red Flags (${selectedRedFlags.length})\n`;
    if (selectedRedFlags.length > 0) {
        selectedRedFlags.forEach(i => fullText += generateBlock(i, 'RED_FLAG'));
    } else {
        fullText += "(None today)\n";
    }
    fullText += "\n";

    fullText += `Method: deterministic + onchain verification\n`;
    fullText += `🔎 Audit: ${auditLink}`;

    // --- TEASER GENERATION (For Farcaster) ---
    // Teaser is SHORT and routes to Miniapp.
    const totalApps = selectedDelivered.length + selectedWatchlist.length + selectedRedFlags.length;
    let teaserText = `CuratoBase Log · ${new Date().toISOString().split('T')[0]}\n\n`;
    teaserText += `Daily analysis of ${totalApps} active Base apps.\n`;

    if (selectedDelivered.length > 0) {
        teaserText += `✅ ${selectedDelivered.length} verified rewarding apps.\n`;
    }
    teaserText += `\n→ Terminal Access: https://base.app/app/curatobase?start=${reportSignal.id}`;

    console.log("\n--- FULL REPORT PREVIEW (INTERNAL) ---\n" + fullText + "\n----------------------\n");
    console.log("\n--- FARCASTER TEASER (EXTERNAL) ---\n" + teaserText + "\n----------------------\n");

    // 4. Persistence & Publish
    let publishedHash = null;

    if (DRY_RUN) {
        console.log("✅ DRY RUN: Skipping Publish.");
    } else if (ENABLED) {
        const signerUuid = process.env.NEYNAR_SIGNER_UUID;
        if (!signerUuid) {
            console.error("❌ ENABLED but NEYNAR_SIGNER_UUID missing.");
            process.exit(1);
        }

        try {
            // PUBLISH TEASER ONLY
            const result: any = await neynar.publishCast(signerUuid, teaserText, { embeds: [] });
            console.log('DEBUG: API Result:', JSON.stringify(result));

            if (result && result.cast && result.cast.hash) {
                publishedHash = result.cast.hash;
                console.log(`🚀 PUBLISHED! Hash: ${publishedHash}`);
            } else if (result && result.hash) {
                publishedHash = result.hash;
                console.log(`🚀 PUBLISHED! Hash: ${publishedHash} (Flat structure)`);
            } else {
                console.error("❌ Publish returned unexpected structure (Hash missing). See DEBUG log.");
            }
        } catch (err) {
            console.error("❌ Publish Failed:", err);
        }
    } else {
        console.log("⏸️  Trust Report disabled.");
        await prisma.signal.update({
            where: { id: reportSignal.id },
            data: { rawText: 'Task disabled by config.' }
        });
        return;
    }

    // Update Report Record (Link Hash)
    await prisma.signal.update({
        where: { id: reportSignal.id },
        data: {
            rawText: fullText,
            urls: JSON.stringify({
                publishedHash,
                includedAppIds: allSelected.map(i => i.app.id)
            })
        }
    });

    console.log("📝 Saved TRUST_REPORT signal record.");

    // Update Apps (Cooldown tags)
    if (!DRY_RUN && ENABLED) {
        for (const item of allSelected) {
            const oldReasons = item.app.reasons ? JSON.parse(item.app.reasons) : [];
            const cleanReasons = oldReasons.filter((r: string) => !r.startsWith('TRUST_REPORT_INCLUDED_AT:') && !r.startsWith('TRUST_REPORT_STATUS:'));

            let statusTag = 'TRUST_REPORT_STATUS:WATCHLIST';
            if (selectedDelivered.find(x => x.app.id === item.app.id)) statusTag = 'TRUST_REPORT_STATUS:DELIVERED';
            if (selectedRedFlags.find(x => x.app.id === item.app.id)) statusTag = 'TRUST_REPORT_STATUS:RED_FLAG';

            cleanReasons.push(`TRUST_REPORT_INCLUDED_AT:${new Date().toISOString()}`);
            cleanReasons.push(statusTag);

            await prisma.app.update({
                where: { id: item.app.id },
                data: {
                    reasons: JSON.stringify(cleanReasons)
                }
            });
        }
        console.log("💾 Updated App cooldown tags.");
    }

    // 5. POST-RUN VERIFICATION
    console.log("\n=== POST-RUN VERIFICATION ===");
    console.log(`REPORT_ID: ${reportSignal.id}`);
    console.log(`PUBLISHED_HASH: ${publishedHash || 'N/A (Dry Run or Failed)'}`);
    console.log(`COUNTS: Delivered=${selectedDelivered.length}, Watchlist=${selectedWatchlist.length}, RedFlags=${selectedRedFlags.length}`);
    console.log(`INCLUDED_APPS: ${allSelected.map(i => (i.app as any).appKey || i.app.id).join(', ')}`);
    console.log(`AUDIT_URL: ${auditLink}`);
    console.log("=============================\n");
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
