import 'dotenv/config';
import { TwitterAgent } from '../src/lib/agent/twitter';
import { BaseAppDetector } from '../src/lib/domain/detectors';

(async () => {
    const agent = new TwitterAgent();
    const signals = await agent.fetchEcosystemSignals();
    const utku = signals.filter(s => s.author.username === 'utkus_eth');
    if (utku.length > 0) {
        console.log('Text:', utku[0].text);
        console.log('Embeds:', JSON.stringify(utku[0].embeds, null, 2));
        console.log('Detector result:', BaseAppDetector.detect(utku[0].text, utku[0].embeds));
    } else {
        console.log('No utkus_eth signal found.');
    }
})();
