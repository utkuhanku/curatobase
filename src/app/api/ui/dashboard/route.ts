import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch the most recently curated app
        const topApp = await prisma.app.findFirst({
            where: {
                status: { in: ['CURATED', 'TOP_PICK'] }
            },
            orderBy: {
                updatedAt: 'desc'
            },
            include: {
                signals: {
                    take: 1,
                    orderBy: {
                        timestamp: 'desc'
                    }
                },
                builder: true
            }
        });

        if (!topApp) {
            return NextResponse.json({
                title: "No Signals Yet",
                subtitle: "The agent is currently scanning the network...",
                confidence: "0%",
                sentiment: "UNKNOWN",
                authorStats: "N/A",
                signalUrl: "https://base.org",
                reason: "Awaiting first high-signal detection.",
                category: "SYSTEM"
            }, { status: 200 });
        }

        let urls: any = {};
        try { urls = JSON.parse(topApp.urls); } catch (e) { }

        // Determine source URL
        let signalUrl = topApp.signals[0]?.urls ? JSON.parse(topApp.signals[0].urls)[0] : null;
        if (!signalUrl && topApp.signals[0]?.urls) {
            try {
                const parsed = JSON.parse(topApp.signals[0].urls);
                if (parsed.app) signalUrl = parsed.app;
                else if (parsed.demo) signalUrl = parsed.demo;
            } catch (e) { }
        }
        if (!signalUrl && urls.app) signalUrl = urls.app;
        if (!signalUrl && urls.baseApp) signalUrl = urls.baseApp;
        if (!signalUrl && urls.demo) signalUrl = urls.demo;
        if (!signalUrl && urls.website) signalUrl = urls.website;
        if (!signalUrl) signalUrl = `https://base.org`;

        let sentiment = "UNKNOWN_SIGNAL";
        if (topApp.curationScore > 80) sentiment = "HIGHLY POSITIVE";
        else if (topApp.curationScore > 50) sentiment = "POSITIVE";

        // Reason parsed from Breakdown or fallback
        let reasonStr = topApp.agentInsight || "Verified on-chain metrics across ecosystem.";
        if (topApp.reasons) {
            try {
                const parsedReasons = JSON.parse(topApp.reasons);
                if (Array.isArray(parsedReasons) && parsedReasons.length > 0) {
                    reasonStr = parsedReasons[0].replace(/_/g, ' ');
                }
            } catch (e) { }
        }

        let displayTitle = topApp.name || `Discovered App`;
        const isPlaceholder = displayTitle.startsWith('App 0x') || displayTitle.startsWith('Project by @');

        if (isPlaceholder && topApp.description) {
            const onMatch = topApp.description.match(/on\s+@?([A-Za-z0-xyz]+)/i);
            if (onMatch && onMatch[1] && onMatch[1].toLowerCase() !== 'base' && onMatch[1].toLowerCase() !== 'farcaster') {
                displayTitle = onMatch[1];
            } else {
                const builderMatch = topApp.description.match(/by\s+@([A-Za-z0-9_]+)/i);
                displayTitle = builderMatch ? `Studio ${builderMatch[1]}` : `Curation Target`;
            }
        } else if (displayTitle.startsWith('App 0x')) {
            displayTitle = `Curation Target`;
        }

        const payload = {
            title: displayTitle,
            subtitle: topApp.description?.substring(0, 100) || `High-signal application discovered by autonomous agent.`,
            confidence: `${topApp.curationScore.toFixed(1)}%`,
            sentiment,
            authorStats: topApp.builder?.confidenceLevel ? topApp.builder.confidenceLevel.replace(/_/g, ' ') : "Unknown Builder",
            signalUrl: signalUrl,
            reason: reasonStr,
            category: topApp.description?.toLowerCase().includes('game') ? "GAMING" : (topApp.description?.toLowerCase().includes('defi') || topApp.description?.toLowerCase().includes('finance')) ? "DEFI / FI" : "SOCIAL / UTILITY"
        };

        return NextResponse.json(payload, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
