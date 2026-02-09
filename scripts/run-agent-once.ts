import { DiscoveryAgent } from '../src/lib/agent/discovery';
import { RewardAgent } from '../src/lib/agent/rewards';
import { prisma } from '../src/lib/db';

async function main() {
    console.log("🚀 Starting Curator Logic Verification (Personas)...");

    // Override env for demo proof
    process.env.CURATO_DEMO_VERIFIED_TX_HASH = "0x030947dcc6d844c52d0f06476abc26a543b194f2919afe5730d2e5780a7c90ea";

    /* 
       PERSONA 1: NEW BUILDER
       - Single signal
       - Valid ship event
    */
    console.log("\n👤 [Persona 1: NEW] Processing...");
    await DiscoveryAgent.processSignal({
        source: "FARCASTER",
        type: "SHIP_EVENT",
        rawText: "Just shipped my first frame on Base! check it out.",
        authorHandle: "new_guy_base",
        timestamp: new Date(),
        urls: ["https://frame.newguy.com"]
    });

    /* 
       PERSONA 2: ACTIVE BUILDER
       - Multiple apps (simulate by creating one, then processing another signal)
    */
    console.log("\n👤 [Persona 2: ACTIVE] Processing...");
    // First app (already exists assume, or create)
    await DiscoveryAgent.processSignal({
        source: "FARCASTER",
        type: "SHIP_EVENT",
        rawText: "Update on Project A: v2 is live.",
        authorHandle: "active_shipper",
        timestamp: new Date(Date.now() - 86400000), // Yesterday
        urls: ["https://projectA.com"]
    });
    // Second app (distinct ship) -> Should trigger ACTIVE status in IdentityResolver
    await DiscoveryAgent.processSignal({
        source: "FARCASTER",
        type: "SHIP_EVENT",
        rawText: "Just launched a totally new tool for creators!",
        authorHandle: "active_shipper",
        timestamp: new Date(),
        urls: ["https://newtool.active.com"]
    });

    /* 
       PERSONA 3: PROVEN BUILDER
       - Has verified rewards
       - Shipping high effort app
    */
    console.log("\n👤 [Persona 3: PROVEN] Processing...");
    // 1. Create Reward Event (Verified via demo hash override)
    await RewardAgent.processAnnouncement(
        "Sent 500 USDC to contributors! 🚀",
        "proven_builder_eth",
        new Date()
    );
    await RewardAgent.verifyPendingRewards(); // This marks it VERIFIED_PAID

    // 2. Process Ship Signal (Now that they are proven)
    await DiscoveryAgent.processSignal({
        source: "FARCASTER",
        type: "SHIP_EVENT",
        rawText: "Major protocol upgrade live on Base Mainnet. Audited and open source.",
        authorHandle: "proven_builder_eth",
        timestamp: new Date(),
        urls: ["https://protocol.proven.com", "https://github.com/proven/protocol"]
    });

    // LOG RESULTS
    console.log("\n📊 Verification Results:");
    const builders = await prisma.builder.findMany({
        where: { handles: { in: ['["new_guy_base"]', '["active_shipper"]', '["proven_builder_eth"]'] } }, // JSON search might fail, assume handle string match for now
        include: { apps: true }
    });

    // Fetch manually to be safe with JSON
    const allBuilders = await prisma.builder.findMany({ include: { apps: true } });

    for (const b of allBuilders) {
        const h = JSON.parse(b.handles).farcaster;
        if (["new_guy_base", "active_shipper", "proven_builder_eth"].includes(h)) {
            console.log(`\nBuilder: @${h}`);
            console.log(`Confidence: ${b.confidenceLevel}`);
            b.apps.forEach(app => {
                console.log(`  - App: ${app.name}`);
                console.log(`    Status: ${app.status}`);
                console.log(`    Verdict: "${app.agentInsight}"`);
            });
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
