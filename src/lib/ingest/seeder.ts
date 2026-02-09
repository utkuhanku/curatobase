import { FeedIngest } from './feeds';
import { prisma } from '../db';

const ALLOWLIST_APPS = [
    'moxie', 'aerodrome', 'base-paint', 'zora', 'manifold', 'paragraph', 'mirror',
    'sound', 'friend-tech', 'blackbird', 'bonfire', 'virtuals', 'clanker', 'tycoon',
    'corgi', 'seamless', 'moonwell', 'uniswap', 'sushi', 'aave', 'compound',
    'morpho', 'beefy', 'harvest', 'synthetix', 'gmx', 'polynomial', 'avantis',
    'pika', 'base-god', 'stand-with-crypto', 'onchain-summer', 'coinbase', 'wallet',
    'titles', 'hypersub', 'fabric', 'highlight', 'mint-fun', 'farcaster', 'warpcast'
];

export class CandidateSeeder {
    private static foundSlugs = new Set<string>();
    private static metrics = {
        baseChannel: 0,
        globalEmbeds: 0,
        allowlist: 0,
        newCasts: 0,
        skipped: 0
    };

    static async seedCandidates(limit: number = 50) {
        console.log(`🌱 Starting Candidate Seeder (Target: ${limit} apps)...`);
        this.resetMetrics();
        this.foundSlugs.clear();

        // 1. Source A: Base Channel Feed
        await this.seedFromBaseChannel(limit);

        // 2. Source B: Global Embeds (if under limit)
        if (this.foundSlugs.size < limit) {
            await this.seedFromGlobalEmbeds(limit);
        }

        // 3. Source C: Allowlist Bootstrap (Fallback if still starvation)
        const MIN_SUPPLY = 20; // Ensure at least 20 candidates daily
        if (this.foundSlugs.size < MIN_SUPPLY) {
            await this.seedFromAllowlist(limit);
        }

        console.log(`✅ Candidate Seeder Complete.`);
        console.log(`📊 Metrics:`, this.metrics);
        return this.metrics;
    }

    private static resetMetrics() {
        this.metrics = { baseChannel: 0, globalEmbeds: 0, allowlist: 0, newCasts: 0, skipped: 0 };
    }

    private static async seedFromBaseChannel(limit: number) {
        if (this.foundSlugs.size >= limit) return;
        console.log(`🔎 Scanning 'base' channel for candidates...`);

        try {
            const casts = await FeedIngest.fetchChannelFeed('base', 100);
            const count = await this.processCasts(casts, 'BASE_CHANNEL_FEED');
            this.metrics.baseChannel += count;
            console.log(`   -> Found ${count} candidates from Base Channel.`);
        } catch (e) {
            console.error("   -> Failed to scan Base Channel:", e);
        }
    }

    private static async seedFromGlobalEmbeds(limit: number) {
        if (this.foundSlugs.size >= limit) return;
        console.log(`🔎 Scanning Global Embeds for 'base.app/app'...`);

        try {
            const casts = await FeedIngest.fetchEmbedFeed('https://base.app/app', 100);
            const count = await this.processCasts(casts, 'GLOBAL_EMBED_SCAN');
            this.metrics.globalEmbeds += count;
            console.log(`   -> Found ${count} candidates from Global Embeds.`);
        } catch (e) {
            console.error("   -> Failed to scan Global Embeds:", e);
        }
    }

    private static async seedFromAllowlist(limit: number) {
        if (this.foundSlugs.size >= limit) return;
        console.log(`⚠️ using ALLOWLIST BOOTSTRAP to fill supply gap...`);

        let count = 0;
        for (const slug of ALLOWLIST_APPS) {
            if (this.foundSlugs.size >= limit) break;
            if (this.foundSlugs.has(slug)) continue;

            this.foundSlugs.add(slug);
            const success = await this.upsertCandidate(
                slug,
                `https://base.app/app/${slug}`,
                'ALLOWLIST_BOOTSTRAP',
                'sys-bootstrapper',
                'Bootstrap Fallback'
            );

            if (success) {
                count++;
                this.metrics.allowlist++;
            }
        }
        console.log(`   -> Bootstrapped ${count} candidates from Allowlist.`);
    }

    private static async processCasts(casts: any[], sourceLabel: string): Promise<number> {
        let count = 0;
        const regex = /base\.app\/app\/([\w-]+)/g;

        for (const cast of casts) {
            // Check text
            let match;
            while ((match = regex.exec(cast.text)) !== null) {
                const slug = match[1];
                if (await this.handleSlug(slug, `https://base.app/app/${slug}`, sourceLabel, cast)) count++;
            }

            // Check embeds
            if (cast.embeds) {
                for (const embed of cast.embeds) {
                    if ('url' in embed && embed.url) {
                        const embedMatch = embed.url.match(/base\.app\/app\/([\w-]+)/);
                        if (embedMatch) {
                            if (await this.handleSlug(embedMatch[1], embed.url, sourceLabel, cast)) count++;
                        }
                    }
                }
            }
        }
        return count;
    }

    private static async handleSlug(slug: string, url: string, sourceLabel: string, cast: any): Promise<boolean> {
        if (this.foundSlugs.has(slug)) return false;
        this.foundSlugs.add(slug);

        const authorHandle = cast.author.username;
        return await this.upsertCandidate(
            slug,
            url,
            sourceLabel,
            authorHandle,
            `Imported from ${sourceLabel} (via @${authorHandle})`,
            `warpcast.com/${authorHandle}/${cast.hash}`
        );
    }

    private static async upsertCandidate(
        slug: string,
        baseAppUrl: string,
        sourceValues: string,
        authorHandle: string,
        description: string,
        directorySourceUrl?: string
    ): Promise<boolean> {
        // Dedupe against DB
        const existing = await prisma.app.findFirst({
            where: {
                OR: [
                    { name: slug },
                    { urls: { contains: slug } }
                ]
            }
        });

        if (existing) {
            // We do NOT update "lastSeededAt" because we want natural activity to drive it, 
            // but if we were strictly seeding, we might. 
            // For now, simple skip to avoid DB churn.
            this.metrics.skipped++;
            return false;
        }

        // Create Builder if needed
        let builder = await prisma.builder.findFirst({
            where: { handles: { contains: authorHandle } }
        });

        if (!builder) {
            builder = await prisma.builder.create({
                data: {
                    handles: JSON.stringify({ farcaster: authorHandle }),
                    wallets: JSON.stringify([])
                }
            });
        }

        await prisma.app.create({
            data: {
                name: slug,
                description: description,
                urls: JSON.stringify({ baseApp: baseAppUrl, directorySource: directorySourceUrl || 'allowlist' }),
                status: 'CANDIDATE',
                reasons: JSON.stringify([`SOURCE:${sourceValues}`]),
                builderId: builder.id,
                curationScore: 0.1
            }
        });

        this.metrics.newCasts++;
        return true;
    }
}
