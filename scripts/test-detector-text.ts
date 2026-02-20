import { BaseAppDetector, DemoDetector } from '../src/lib/domain/detectors';

function testDetection(text: string) {
    console.log(`\nTesting: "${text}"`);
    const baseApp = BaseAppDetector.detect(text, []);
    const isDemo = DemoDetector.detect(text, []);
    console.log(`BaseAppDetector:`, baseApp);
    console.log(`DemoDetector: isDemo = ${isDemo}`);
}

const inputs = [
    "Base Me mini app distributes 5k USDC for a week.",
    "my mini app on base called “Base Me”",
    "I gave you Arbase Clicker until the first drop - now they've already given away about for top 50",
    "let me represent my mini app on base called “Base Me”",
    "Base App Leaderboards"
];

for (const input of inputs) {
    testDetection(input);
}
