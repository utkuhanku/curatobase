import { TwitterApi } from 'twitter-api-v2';

export class TwitterAgent {
    private client: TwitterApi | null = null;
    private hasConfig = false;

    // List of key Base ecosystem builders/pioneers to monitor
    // Hardcoded for now, could be moved to DB or config
    private PIONEERS = [
        'jessepollak', // Jesse Pollak
        'brian_armstrong' // Brian Armstrong
        // Add more key figures here
    ];

    constructor() {
        // For search/read-only, we generally just need the Bearer Token 
        // OR the AppKey/Secret for app-only auth. 
        // We will use the existing env variables.
        const appKey = process.env.TWITTER_API_KEY;
        const appSecret = process.env.TWITTER_API_SECRET;
        const accessToken = process.env.TWITTER_ACCESS_TOKEN;
        const accessSecret = process.env.TWITTER_ACCESS_SECRET;

        // For V2 search, a Bearer token is often easiest, but user context works too.
        // We will try to instantiate with what we have.
        if (appKey && appSecret && accessToken && accessSecret) {
            this.client = new TwitterApi({
                appKey,
                appSecret,
                accessToken,
                accessSecret,
            });
            this.hasConfig = true;
        } else if (process.env.TWITTER_BEARER_TOKEN) {
            // Fallback to app-only bearer token if provided
            this.client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
            this.hasConfig = true;
        } else {
            console.warn("⚠️ Twitter Agent missing keys in env. Ingestion will be skipped.");
        }
    }

    /**
     * Fetches recent tweets from Base pioneers or containing specific keywords.
     * Returns an array formatted similarly to Neynar Casts for the ingest pipeline.
     */
    async fetchEcosystemSignals(): Promise<any[]> {
        if (!this.hasConfig || !this.client) {
            console.log("🚫 Twitter Agent disabled (no keys). Skipping Twitter fetch.");
            return [];
        }

        console.log("🐦 Fetching ecosystem signals from X (Twitter)...");
        const results: any[] = [];

        try {
            // Construct a search query:
            // "base.app" OR "reward" from specific users, OR just "base.app" globally if we want (rate limits apply).
            // For precision, let's search for "base.app" from our pioneers OR in general with high engagement.
            // A simple query to start: tweets from pioneers containing "base.app" or "build"

            const fromQuery = this.PIONEERS.map(p => `from:${p}`).join(' OR ');
            // Query: (from:jessepollak OR from:...) (base.app OR reward OR build)
            // Note: Twitter v2 basic search limits apply.
            const query = `(${fromQuery}) (base.app OR reward)`;

            console.log(`   Query: ${query}`);

            // Fetch recent (last 7 days for standard v2 search)
            const searchBase = await this.client.v2.search(query, {
                'tweet.fields': ['created_at', 'public_metrics', 'entities', 'author_id'],
                'expansions': ['author_id'],
                'user.fields': ['username', 'name'],
                max_results: 50 // Keep small to avoid rate limits
            });

            // Process results
            const tweets = searchBase.tweets || [];
            const includes = searchBase.includes;

            for (const tweet of tweets) {
                // Find author details
                const author = includes?.users?.find((u: any) => u.id === tweet.author_id);

                // Map to a "Cast-like" object so our normalizer can handle it easily
                const normalizedTweet = {
                    hash: tweet.id, // Use tweet ID as hash
                    text: tweet.text,
                    author: {
                        username: author?.username || 'unknown_twitter_user',
                        displayName: author?.name || 'Unknown',
                        fid: 0 // No FID for Twitter users, indicate it's external
                    },
                    timestamp: tweet.created_at || new Date().toISOString(),
                    replies: { count: tweet.public_metrics?.reply_count || 0 },
                    reactions: { count: tweet.public_metrics?.like_count || 0 },
                    recasts: { count: tweet.public_metrics?.retweet_count || 0 }, // Map RTs to recasts
                    embeds: [], // We could parse tweet.entities.urls here, but normalizer also checks text
                    source: 'TWITTER' // Custom flag to identify origin
                };

                // Extract URLs from entities to pass as embeds to mimic Farcaster
                if (tweet.entities && tweet.entities.urls) {
                    normalizedTweet.embeds = tweet.entities.urls.map((u: any) => ({
                        url: u.expanded_url || u.url
                    })) as any;
                }

                results.push(normalizedTweet);
            }

            console.log(`✅ Fetched ${results.length} signals from X.`);

        } catch (error: any) {
            console.error("❌ Failed to fetch from X:", error?.message || error);
        }

        return results;
    }
}
