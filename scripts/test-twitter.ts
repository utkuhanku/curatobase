import 'dotenv/config';
import { TwitterAgent } from '../src/lib/agent/twitter';
import { TwitterApi } from 'twitter-api-v2';

(async () => {
    const agent = new TwitterAgent();
    const signals = await agent.fetchEcosystemSignals();
    console.log('Got ' + signals.length + ' signals');
    const utku = signals.filter(s => s.author.username === 'utkus_eth');
    console.log('Found utkus_eth explicitly:', utku.length);
    if (utku.length > 0) {
        console.log('Example text:', utku[0].text);
    } else {
        console.log('Trying manual search for utkus_eth...');
        if (process.env.TWITTER_BEARER_TOKEN) {
            const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
            // We will try an exact query to see if Twitter's API index holds his posts.
            const q2 = 'from:utkus_eth "base.app"';
            const res = await client.v2.search(q2, { 'tweet.fields': ['created_at'], max_results: 10 });
            const tweets = res.tweets || [];
            console.log('Found manual:', tweets.length);
            if (tweets.length > 0) {
                console.log('Manual text sample:', tweets[0].text);
            }
        } else {
            console.log("No bearer token.");
        }
    }
})();
