import { runAutonomousCycle } from '../src/lib/agent/autonomous-loop';

console.log("Starting Autonomous Cycle...");
runAutonomousCycle().then(() => {
    console.log("Cycle Complete.");
    process.exit(0);
}).catch((error) => {
    console.error("Cycle Failed:", error);
    process.exit(1);
});
