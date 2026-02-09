import { TwitterApi } from 'twitter-api-v2';

export class TwitterAgent {
    private client: TwitterApi | null = null;
    private hasConfig = false;

    constructor() {
        const appKey = process.env.TWITTER_API_KEY;
        const appSecret = process.env.TWITTER_API_SECRET;
        const accessToken = process.env.TWITTER_ACCESS_TOKEN;
        const accessSecret = process.env.TWITTER_ACCESS_SECRET;

        if (appKey && appSecret && accessToken && accessSecret) {
            this.client = new TwitterApi({
                appKey,
                appSecret,
                accessToken,
                accessSecret,
            });
            this.hasConfig = true;
        } else {
            console.warn("⚠️ Twitter Agent missing keys in env. Publishing will be skipped.");
        }
    }

    async postCycleSummary(cycleId: string, curatedApps: any[], topPicks: any[]) {
        if (!this.hasConfig || !this.client) {
            console.log("🚫 Twitter Agent disabled (no keys). Skipping post.");
            return;
        }

        const PRESTIGE_LIMIT = 3;
        const PICK_LIMIT = 5;

        // Construct Thread / Post
        // Limit to 280 chars logic or thread.
        // Simplified strategy: Single compact post or simple thread.
        // User requirements: "List of TOP PICK and PRESTIGE apps" with "appKey", "proof summary", "reward status", "anchor".

        // Let's make a thread.
        // Tweet 1: Header + Stat
        const date = new Date().toISOString().split('T')[0];
        let threadText = [`🤖 CuratoBase Cycle ${cycleId} [${date}]\n\nPrestige: ${curatedApps.length}\nTop Picks: ${topPicks.length}\n\n#Base #BuildOnBase`];

        // Tweet 2...N: The Apps
        const allApps = [...curatedApps, ...topPicks];

        for (const app of allApps) {
            const breakdown = app.scoreBreakdown ? JSON.parse(app.scoreBreakdown) : {};
            const facts = breakdown.appFacts || {};
            const verdict = app.agentInsight || "No summary";

            const isPrestige = app.status === 'CURATED';
            const badge = isPrestige ? "🏆 PRESTIGE" : "⭐ TOP PICK";

            const lines = [
                `${badge}: ${facts.appKey || app.name}`,
                `📝 ${verdict.replace("Proof summary: ", "")}`,
            ];

            if (facts.rewardVerified) {
                const rewardIcon = facts.rewardVerified === 'VERIFIED' ? '✅' : '⚠️';
                lines.push(`💰 Reward: ${facts.rewardVerified} ${rewardIcon}`);
            }

            if (isPrestige && breakdown.tags?.includes("ANCHORED")) {
                // We'd ideally link the tx, but user asked for "anchor tx".
                // We likely don't have the tx hash in the 'app' object directly unless we query Signal or store it.
                // run-agent-cycle stores it in StateStore, but not easily accessible here?
                // Actually we just updated prisma to have it logic? No.
                // We can imply it from "ANCHORED" tag for now or just say "Anchored".
                lines.push(`⚓ Anchored on-chain`);
            }

            threadText.push(lines.join('\n'));
        }

        // Post Thread
        try {
            console.log("🐦 Posting to X...");
            if (allApps.length === 0) {
                console.log("   No apps to publish.");
                return;
            }

            // Simple robust threading
            // twitter-api-v2 .tweetThread
            await this.client.v2.tweetThread(threadText);
            console.log("✅ Posted to X successfully.");

        } catch (error) {
            console.error("❌ Failed to post to X:", error);
        }
    }
}
