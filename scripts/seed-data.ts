
import { PrismaClient } from '@prisma/client';
import { CurationStatus } from '@/lib/types';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding dummy data...");

    // 1. Create Builders
    await prisma.builder.upsert({
        where: { id: "builder_one" },
        update: {},
        create: { id: "builder_one", handles: JSON.stringify({ farcaster: "vitalik" }), confidenceLevel: "PROVEN_BUILDER", wallets: "[]" }
    });

    await prisma.builder.upsert({
        where: { id: "builder_two" },
        update: {},
        create: { id: "builder_two", handles: JSON.stringify({ farcaster: "jessepollak" }), confidenceLevel: "ACTIVE_BUILDER", wallets: "[]" }
    });

    // 2. Create Apps
    // Curated
    await prisma.app.upsert({
        where: { id: "0xhash1" },
        update: {},
        create: {
            id: "0xhash1",
            name: "SuperDapp",
            description: "A decentralized social layer for Base ecosystem enthusiasts.",
            status: CurationStatus.CURATED,
            curationScore: 95,
            agentInsight: "Strong on-chain footprint + verified rewards.",
            builderId: "builder_one",
            urls: JSON.stringify({ baseApp: "https://base.app/app/superdapp", website: "https://super.dapp" }),
            lastEventAt: new Date()
        }
    });

    // Watchlist
    await prisma.app.upsert({
        where: { id: "0xhash2" },
        update: {},
        create: {
            id: "0xhash2",
            name: "BasePaint v2",
            description: "Collaborative pixel art on chain. New shipping event detected.",
            status: CurationStatus.WATCHLIST,
            curationScore: 70,
            agentInsight: "Monitoring for reward distribution proof.",
            builderId: "builder_two",
            urls: JSON.stringify({ repo: "https://github.com/basepaint" }),
            lastEventAt: new Date(Date.now() - 86400000)
        }
    });

    console.log("Seeding complete.");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
