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

            // Name Resolution
            let name = app.name;
            const isPlaceholder = name?.startsWith('App 0x') || name?.startsWith('Project by @');

            if (isPlaceholder && app.description) {
                // Try to find the app name in the description (e.g. '@DropCast', or capitalized words after 'on')
                const onMatch = app.description.match(/on\s+@?([A-Za-z0-xyz]+)/i);
                if (onMatch && onMatch[1] && onMatch[1].toLowerCase() !== 'base' && onMatch[1].toLowerCase() !== 'farcaster') {
                    name = onMatch[1];
                } else {
                    // Fallback to Author handle as the project name
                    const builderMatch = app.description.match(/by\s+@([A-Za-z0-9_]+)/i);
                    name = builderMatch ? `Studio ${builderMatch[1]}` : `Curation Target`;
                }
            } else if (name?.startsWith('App 0x')) {
                name = `Curation Target`;
            }

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
