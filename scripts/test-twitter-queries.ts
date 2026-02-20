import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN as string).readOnly;

async function testQuery(query: string) {
    console.log(`\nTesting query: ${query}`);
    try {
        const search = await client.v2.search(query, {
            max_results: 15,
            'tweet.fields': ['created_at', 'text', 'public_metrics'],
            'user.fields': ['username']
        });

        let count = 0;
        for (const tweet of search.tweets || []) {
            count++;
            console.log(`[${tweet.public_metrics?.like_count} likes] ${tweet.text.replace(/\n/g, ' ')}`.substring(0, 150));
        }
        console.log(`Fetched ${count} tweets for this query.`);
    } catch (e: any) {
        console.error('Error:', e?.data || e);
    }
}

async function main() {
    // 1. Existing query
    await testQuery(`(url:"base.app" OR "base.app") -is:retweet`);

    // 2. Broadened reward keywords on Base
    await testQuery(`("mini app" OR "miniapp") ("base") (reward OR usdc OR prize) -is:retweet`);

    // 3. Mentions of baseapp
    await testQuery(`(@base OR @baseapp OR "base app") (reward OR usdc) miniapp -is:retweet`);
}

main().finally(() => process.exit(0));
