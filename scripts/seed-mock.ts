import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding mock elite app...");
    await prisma.app.create({
        data: {
            name: "DropCast",
            description: "$48 rewards pool airdrop on @DropCast by @binfergu. The $CLAIM mini app is officially live built for Base.",
            urls: JSON.stringify({ baseApp: "https://dropcast.example.com", warpcast: "https://warpcast.com/dropcast" }),
            status: "CURATED",
            reasons: JSON.stringify(["Excellent execution of social rewards on Base."]),
            agentInsight: "Organic builder rewarding the ecosystem. Automatically triggered for top-tier promotion out of respect for their distribution.",
            curationScore: 98,
            builder: {
                create: {
                    handles: JSON.stringify({ farcaster: "binfergu", x: "binfergu" }),
                    wallets: JSON.stringify(["0x1234567890123456789012345678901234567890"]),
                    trustScore: 95.5,
                    confidenceLevel: "KNOWN_BUILDER"
                }
            }
        }
    });

    console.log("Mock elite app seeded.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
