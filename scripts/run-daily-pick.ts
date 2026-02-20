import { PrismaClient } from '@prisma/client';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import 'dotenv/config';

const prisma = new PrismaClient();
const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);

const DRY_RUN = process.env.DAILY_PICK_DRY_RUN === 'true';
const ENABLED = process.env.DAILY_PICK_ENABLED === 'true';

async function main() {
    console.log(`🟢 Running DAILY PICK Job (DryRun=${DRY_RUN}, Enabled=${ENABLED})`);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // 1. Fetch Candidates (Curated or Watchlist)
    const apps = await prisma.app.findMany({
        where: {
            status: { in: ['CURATED', 'WATCHLIST'] }
        },
        include: { builder: true }
    });

    console.log(`🔎 Scanned ${apps.length} candidates from DB.`);

    // 2. Filter & Score
    const candidates = apps.map(app => {
        const breakdown = app.scoreBreakdown ? JSON.parse(app.scoreBreakdown) : {};
        const urls = app.urls ? JSON.parse(app.urls) : {};
        const signal = breakdown.baseAppSignal || {};
        const promo = breakdown.promotion || {};
        const reward = breakdown.rewardCheck || {};
        const reasons = app.reasons ? JSON.parse(app.reasons) : [];
        const source = breakdown.candidate?.cast?.source || 'FARCASTER';

        // Cooldown: If picked recently, skip
        if (reasons.includes('DAILY_PICK')) {
            const lastPicked = new Date(app.updatedAt);
            if (lastPicked > fourteenDaysAgo) return null;
        }

        // Criteria 1: Base App
        const isBaseApp = !!signal.isBaseApp || (urls.app && urls.app.includes('base.app/app/'));
        if (!isBaseApp) return null;

        // Criteria 2: Verified (Reward or Repo or explicitly marked Verified)
        const isRewardVerified = reward.status && reward.status !== 'NONE' && reward.status !== 'UNVERIFIED';
        const isRepoVerified = promo.reasons?.includes('OPEN_SOURCE') || urls.repo;
        if (!isRewardVerified && !isRepoVerified) return null;

        return {
            app,
            score: app.curationScore,
            isRewardVerified,
            isRepoVerified,
            slug: signal.appSlug || app.name,
            reason: isRewardVerified ? 'Reward Verified' : 'Open Source',
            source
        };
    }).filter(c => c !== null);

    // 3. Sort (Deterministic)
    // Score DESC, Then CreatedAt DESC, Then ID ASC
    candidates.sort((a, b) => {
        if (b!.score !== a!.score) return b!.score - a!.score;
        const timeA = new Date(a!.app.createdAt).getTime();
        const timeB = new Date(b!.app.createdAt).getTime();
        if (timeB !== timeA) return timeB - timeA;
        return a!.app.id.localeCompare(b!.app.id);
    });

    if (candidates.length === 0) {
        console.log("⚠️ No eligible candidates found for Daily Pick.");
        // We could write a DB record "no_pick" here if we had an Events table, 
        // but for now log is sufficient or we create a "Skipped" signal if needed.
        return;
    }

    const pick = candidates[0]!;
    console.log(`🎯 SELECTED: ${pick.slug} (Score: ${pick.score})`);

    // 4. Construct Post
    let builderHandle = pick.app.builderId;
    if (pick.app.builder?.handles) {
        try {
            const parsed = JSON.parse(pick.app.builder.handles);
            if (parsed.farcaster) builderHandle = parsed.farcaster;
        } catch (e) {
            // Fallback: assume it's a direct string if not valid JSON
            builderHandle = pick.app.builder.handles;
        }
    }

    const builderMention = builderHandle && builderHandle !== 'unknown' ? `@${builderHandle}` : "Unknown Builder";

    // Reasons from determinism
    const points = [];
    points.push(`✨ Score: ${pick.score.toFixed(0)}/100`);
    if (pick.isRewardVerified) points.push("💰 Reward Verified (Onchain)");
    if (pick.isRepoVerified) points.push("💻 Open Source");
    points.push("📱 Native Base App");
    if (pick.source === 'TWITTER') points.push("🐦 Discovered via X Ecosystem");

    const auditUrl = `https://curatobase.com/audit?id=${pick.app.id}`; // In production this would be real URL
    const appUrl = `https://base.app/app/${pick.slug}`;

    const text = `CuratoBase Daily Pick\n\n` +
        `📦 ${pick.app.name} (${appUrl})\n` +
        `👤 By ${builderMention}\n\n` +
        points.map(p => `- ${p}`).join('\n') +
        `\n\n🔎 Audit: ${auditUrl}`;

    console.log("\n--- POST PREVIEW ---\n" + text + "\n--------------------\n");

    // 5. Execute
    if (DRY_RUN) {
        console.log("✅ DRY RUN: Would publish above cast. Skipping network.");

        // Write 'would_publish' record logic (Simulated by updating reason locally or log)
        // User asked to "write a 'would_publish' record". 
        // We can append to reasons without saving, or save "DRY_RUN" to history if we want persistence.
        // For minimal surface area, we log it. 
        // If we strictly MUST write to DB, we could update 'agentInsight' with "Daily Pick Dry Run <Date>".
        // Let's do that to satisfy "write a record".
        await prisma.app.update({
            where: { id: pick.app.id },
            data: {
                agentInsight: `[DRY_RUN ${new Date().toISOString()}] Selected for Daily Pick.`
            }
        });
        console.log("📝 Recorded Dry Run selection in Agent Insight.");

    } else if (ENABLED) {
        const signerUuid = process.env.NEYNAR_SIGNER_UUID;
        if (!signerUuid) {
            console.error("❌ ENABLED but NEYNAR_SIGNER_UUID missing.");
            process.exit(1);
        }

        try {
            const result = await neynar.publishCast(signerUuid, text, {
                embeds: [{ url: appUrl }]
            });
            console.log(`🚀 PUBLISHED! Hash: ${(result as any).cast?.hash || (result as any).hash}`);

            // Update DB - Mark as promoted (reset cooldown via updatedAt)
            await prisma.app.update({
                where: { id: pick.app.id },
                data: {
                    status: 'CURATED',
                    updatedAt: new Date(), // Reset cooldown
                    agentInsight: `[DAILY_PICK ${new Date().toISOString()}] Published successfully.`,
                    reasons: JSON.stringify([...(pick.app.reasons ? JSON.parse(pick.app.reasons) : []), "DAILY_PICK"])
                }
            });
            console.log("💾 Database updated with promotion record.");

        } catch (err) {
            console.error("❌ Failed to publish:", err);
            process.exit(1);
        }
    } else {
        console.log("⏸️  Daily Pick disabled (Set DAILY_PICK_ENABLED=true or DAILY_PICK_DRY_RUN=true).");
    }
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
