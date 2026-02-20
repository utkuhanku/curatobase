import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch all vetted apps for the registry
        const curatedApps = await prisma.app.findMany({
            where: {
                status: 'CURATED'
            },
            orderBy: {
                curationScore: 'desc'
            }
        });

        const registryItems = curatedApps.map(app => {
            let urls: any = {};
            try { urls = JSON.parse(app.urls); } catch (e) { }

            return {
                id: app.id,
                name: app.name,
                category: "Agent Curated",
                description: app.description || "Verified on-chain application.",
                trustScore: app.curationScore,
                triggerReason: app.agentInsight || app.reasons || "Passed heuristic filtering.",
                metric: "Curated On",
                metricValue: app.createdAt.toLocaleDateString(),
                url: urls.baseApp || urls.website || "#",
                icon: "💠", // Default icon
                isNewDiscovery: false
            };
        });

        return NextResponse.json(registryItems, { status: 200 });

    } catch (error: any) {
        console.error("Failed to fetch prestige data", error);
        return NextResponse.json([], { status: 500 });
    }
}
