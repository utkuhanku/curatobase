import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN as string).readOnly;

async function fetchUserTweets(username: string) {
    try {
        console.log(`\nfetching user ${username}...`);
        const user = await client.v2.userByUsername(username);
        if (!user.data) {
            console.log(`User ${username} not found.`);
            return;
        }

        const tweets = await client.v2.userTimeline(user.data.id, {
            max_results: 30, // Get last 30 tweets
            'tweet.fields': ['created_at', 'text', 'entities', 'public_metrics'],
            exclude: ['replies', 'retweets'] // mostly interested in announcements
        });

        console.log(`--- TWEETS FROM @${username} ---`);
        for (const tweet of tweets) {
            // Check if it mentions base, app, frame, reward, etc. just as a rough filter for the log
            const text = tweet.text.toLowerCase();
            if (text.includes('base') || text.includes('app') || text.includes('frame') || text.includes('reward') || text.includes('usdc') || text.includes('eth') || text.includes('points') || text.includes('kingy') || text.includes('arbase') || text.includes('clicker')) {
                console.log(`[${tweet.created_at}] - ${tweet.public_metrics?.like_count} likes`);
                console.log(tweet.text);
                console.log('------------------------');
            }
        }
    } catch (e) {
        console.error(`Error fetching for ${username}:`, e);
    }
}

async function main() {
    await fetchUserTweets('kingyru');
    await fetchUserTweets('Vadim_Freesson');
    await fetchUserTweets('0x_fokki');
}

main().finally(() => process.exit(0));
