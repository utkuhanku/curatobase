import { prisma } from '@/lib/db';
import Terminal, { TerminalApp } from './Terminal';
import { CurationStatus } from '@/lib/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AuditPage() {

    // Fetch ALL apps (Terminal handles filtering)
    const apps = await prisma.app.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 500, // Reasonable limit for terminal cache
        include: { builder: true }
    });

    const formattedData: TerminalApp[] = apps.map(app => {
        const breakdown = (app as any).scoreBreakdown ? JSON.parse((app as any).scoreBreakdown) : {};
        const urls = app.urls ? JSON.parse(app.urls as string) : {};

        // v7 Structure
        const promo = breakdown.promotion || {};
        const reward = breakdown.rewardCheck || {};
        const signal = breakdown.baseAppSignal || {};
        const stats = breakdown.scores?.breakdown || {};

        // Builder Handle from Relation (or fallback to unknown)
        // Note: app.builder might be null if relation failed (though we ensure it in script)
        const builderHandle = app.builder?.handles || "unknown"; // Handles fallback if schema varies

        return {
            id: app.id,
            appKey: app.name, // appKey removed from schema, using name
            builderHandle: builderHandle,
            status: app.status as CurationStatus,

            score: app.curationScore,
            updatedAt: app.updatedAt.toISOString(),
            description: app.description || "",
            urls: {
                sourceCast: `https://warpcast.com/${builderHandle}/${app.id}`,
                baseApp: signal.appUrl || urls.app || null,
                demo: urls.demo?.[0] || null
            },
            insight: (app as any).agentInsight || "Analysis pending.",
            confidence: (app.builder as any)?.confidenceLevel || "NORMAL",

            // Stats
            seenCount: promo.reasons?.includes("DEEP_TIME") ? 5 : 1,
            replies: 0,
            uniqueRepliers: promo.reasons?.includes("DEEP_ENGAGEMENT") ? 5 : 0,

            // Proof
            isBaseApp: !!signal.isBaseApp,
            hasDemo: promo.reasons?.includes("EXTERNAL_PROOF") || !!urls.demo?.length,
            hasRepo: promo.reasons?.includes("OPEN_SOURCE") || !!urls.repo?.length,

            hasReward: reward.status && reward.status !== 'NONE' && reward.status !== 'UNVERIFIED',
            rewardStatus: reward.status || "NONE",

            onchainVerified: promo.reasons?.includes("ONCHAIN_VERIFIED") || reward.status?.includes("VERIFIED"),

            // Promotion
            promotionReady: promo.ready || false,
            promoReasons: promo.reasons || [],
            promoMissing: promo.missing || []
        };
    });

    // Fetch Reports
    const reports = await prisma.signal.findMany({
        where: { type: 'TRUST_REPORT' },
        orderBy: { timestamp: 'desc' },
        take: 50
    });

    const formattedReports = reports.map(r => {
        const urlData = r.urls ? JSON.parse(r.urls as string) : {};
        const itemCount = urlData.includedAppIds?.length || 0;
        const published = !!urlData.publishedHash;

        return {
            id: r.id,
            date: r.timestamp.toLocaleString(),
            title: "TRUST REPORT",
            summary: r.rawText.split('\n').filter(l => l.trim().length > 0).slice(1, 2).join(''), // Brief
            fullText: r.rawText,
            itemCount,
            published
        };
    });

    const lastUpdate = apps.length > 0 ? apps[0].updatedAt.toLocaleString() : "Syncing...";

    return (
        <div className="flex flex-col h-screen bg-black">
            <div className="bg-[#111] border-b border-green-900/50 p-3 flex justify-between items-center text-xs font-mono shrink-0 z-50 relative">
                <div className="flex gap-4">
                    <Link href="/reports" className="text-gray-500 hover:text-green-500 transition-colors uppercase font-bold">Trust Logs</Link>
                    <span className="text-green-500 uppercase font-bold text-shadow-glow">Operator Radar</span>
                </div>
                <div className="text-red-500 font-bold border border-red-900/50 bg-red-900/10 px-2 py-0.5 rounded text-[10px] tracking-widest">
                    INTERNAL / OPERATOR VIEW
                </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
                <Terminal data={formattedData} reports={formattedReports} lastCycle={lastUpdate} />
            </div>
        </div>
    );
}
