
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Report data...");

    // Create a dummy report
    await prisma.report.create({
        data: {
            date: new Date(),
            status: "PUBLISHED",
            summary: "Daily Scan: 142 Apps Detected. 3 Curated. High signal from 'SuperDapp'.",
            candidates: JSON.stringify([
                { name: "SuperDapp", status: "CURATED", reason: "Strong Ops + Verified Onchain" },
                { name: "BasePaint", status: "WATCHLIST", reason: "Active Dev" }
            ]),
            publishedUrl: "https://warpcast.com/curatobase/0x123",
            castHash: "0x1234567890abcdef"
        }
    });

    console.log("Seeding complete.");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
