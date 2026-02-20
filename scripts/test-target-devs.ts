import 'dotenv/config';
import { TwitterApi } from 'twitter-api-v2';
import { BaseAppDetector, DemoDetector, RepoDetector } from '../src/lib/domain/detectors';
import { RewardVerifier } from '../src/lib/domain/rewards';

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN as string).readOnly;

async function testDev(username: string) {
    console.log(`\n======== Testing dev: @${username} ========`);
    const user = await client.v2.userByUsername(username);
    if (!user.data) return;

    // fetch their recent tweets
    const tweets = await client.v2.userTimeline(user.data.id, {
        max_results: 15,
        'tweet.fields': ['text']
    });

    for (const t of tweets.tweets || []) {
        const text = t.text;
        const isBaseApp = BaseAppDetector.detect(text, []);
        const isDemo = DemoDetector.detect(text, []);
        const reward = await RewardVerifier.verify(text);

        // Print only if at least one detector tripped so we cut the noise
        if (isBaseApp.isBaseApp || isDemo || reward.status !== 'NONE') {
            console.log(`\n[TWEET] ${text.replace(/\n/g, ' ').substring(0, 80)}...`);
            console.log(`  - BaseApp:`, isBaseApp);
            console.log(`  - Demo:`, isDemo);
            console.log(`  - Reward:`, reward.status);
        }
    }
}

async function main() {
    await testDev('kingyru');
    await testDev('0x_fokki');
    await testDev('Vadim_Freesson'); // Add Vadim as well
}

main().finally(() => process.exit(0));
