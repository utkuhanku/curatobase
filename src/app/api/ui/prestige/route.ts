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
            },
            include: {
                signals: {
                    take: 1,
                    orderBy: { timestamp: 'desc' }
                }
            }
        });

        const registryItems = curatedApps.map(app => {
            let urls: any = {};
            try { urls = JSON.parse(app.urls); } catch (e) { }

            // Determine best link
            let postUrl = `https://base.org`;
            if (app.signals && app.signals.length > 0 && app.signals[0].urls) {
                try {
                    const sigUrls = JSON.parse(app.signals[0].urls);
                    if (sigUrls && sigUrls.length > 0) postUrl = sigUrls[0];
                } catch (e) { }
            }
            if (postUrl === `https://base.org` && urls.app) postUrl = urls.app;
            if (postUrl === `https://base.org` && urls.demo) postUrl = urls.demo;
            if (postUrl === `https://base.org` && urls.website) postUrl = urls.website;

            // Name
            const name = app.name?.startsWith('App 0x') ? `Project ${app.id.substring(0, 6)}` : app.name;

            return {
                id: app.id,
                name: name,
                category: "Agent Curated",
                description: app.description || "Verified on-chain application.",
                trustScore: app.curationScore,
                triggerReason: app.agentInsight || app.reasons || "Passed heuristic filtering.",
                metric: "Curated On",
                metricValue: app.createdAt.toLocaleDateString(),
                url: postUrl,
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
