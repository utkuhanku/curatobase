import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch the most recently curated app, or the one with the highest score
        const topApp = await prisma.app.findFirst({
            where: {
                status: 'CURATED'
            },
            orderBy: {
                curationScore: 'desc'
            },
            include: {
                signals: {
                    take: 1,
                    orderBy: {
                        timestamp: 'desc'
                    }
                }
            }
        });

        if (!topApp) {
            return NextResponse.json({
                title: "No Signals Yet",
                subtitle: "The agent is currently scanning the network...",
                confidence: "0%",
                sentiment: "UNKNOWN",
                authorStats: "N/A",
                signalUrl: "#",
                reason: "Awaiting first high-signal detection.",
                category: "SYSTEM"
            }, { status: 200 });
        }

        let urls = {};
        try { urls = JSON.parse(topApp.urls); } catch (e) { }

        // Determine source URL
        let signalUrl = topApp.signals[0]?.urls ? JSON.parse(topApp.signals[0].urls)[0] : (urls as any).baseApp || (urls as any).website || '#';

        const payload = {
            title: topApp.name,
            subtitle: topApp.description || `High-signal application discovered by autonomous agent.`,
            confidence: `${topApp.curationScore.toFixed(1)}%`,
            sentiment: topApp.agentInsight ? "POSITIVE" : "UNKNOWN_SIGNAL",
            authorStats: "Verified Builder", // Could be enriched from Builder table if needed
            signalUrl: signalUrl,
            reason: topApp.reasons || "High trust score and strong on-chain metrics.",
            category: "DEFI / SOCIAL" // Defaulting or could use a parsed tag
        };

        return NextResponse.json(payload, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
