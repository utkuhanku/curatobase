import 'dotenv/config';
import { PrismaClient, CurationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Looking up target...");
        const target = await prisma.app.findUnique({ where: { id: '2024916317640556917' } });
        console.log("Target found:", target?.id, target?.status);

        console.log("Running exactly what TrustReportRunner runs...");
        const apps = await prisma.app.findMany({
            where: {
                status: {
                    in: ['CURATED', 'TOP_PICK', 'WATCHLIST']
                }
            },
            include: { builder: true }
        });
        console.log("Found", apps.length, "apps in DB.");
        console.log("Target in list?", apps.some(a => a.id === '2024916317640556917'));

        if (apps.some(a => a.id === '2024916317640556917')) {
            console.log("Wait, if it IS in the list, then we need to see what happens in the loop!");
            for (const app of apps) {
                if (app.id === '2024916317640556917') {
                    const breakdown = (app as any).scoreBreakdown ? JSON.parse((app as any).scoreBreakdown) : {};
                    const reward = breakdown.rewardCheck || {};
                    const reasons = (app as any).reasons ? JSON.parse((app as any).reasons) : [];
                    console.log("Breakdown:", breakdown);
                    console.log("Reasons:", reasons);
                    console.log("Reward:", reward);
                }
            }
        }
    } catch (e) {
        console.error("ERROR:", e);
    }
}
main().finally(() => process.exit(0));
