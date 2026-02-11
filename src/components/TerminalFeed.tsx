import { prisma } from "@/lib/db";
import { CurationStatus } from "@/lib/types";
import { ExternalLink, Github, Hexagon, Zap, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";

export async function TerminalFeed() {
    const curatedApps = await prisma.app.findMany({
        where: { status: CurationStatus.CURATED },
        include: { builder: true },
        orderBy: { lastEventAt: 'desc' },
        take: 10
    });

    const watchlistApps = await prisma.app.findMany({
        where: { status: CurationStatus.WATCHLIST },
        include: { builder: true },
        orderBy: { lastEventAt: 'desc' },
        take: 20
    });

    const FeedRow = ({ app, rank, isCurated }: { app: any, rank: number, isCurated: boolean }) => {
        const urls = JSON.parse(app.urls);
        const builder = app.builder;
        const handles = JSON.parse(builder.handles);
        const builderHandle = handles.farcaster || builder.id;

        // Extract Score Breakdown
        let scoreDetails = { evidence: 0, builder: 0 };
        try {
            const breakdown = JSON.parse(app.scoreBreakdown || '{}');
            if (breakdown.scores?.breakdown) {
                scoreDetails = breakdown.scores.breakdown;
            }
        } catch (e) { }

        return (
            <div className={`group relative border-b border-white/5 hover:bg-white/5 transition-all ${isCurated ? 'bg-electric-blue/5' : ''}`}>
                <div className="flex items-center py-3 px-2 gap-4 text-xs font-mono">
                    {/* Rank */}
                    <div className="w-8 text-gray-600 text-right">{rank.toString().padStart(2, '0')}</div>

                    {/* Signal Type */}
                    <div className="w-24 shrink-0">
                        {isCurated ? (
                            <span className="text-electric-blue font-bold tracking-wider">[ CURATED ]</span>
                        ) : (
                            <span className="text-gray-500 tracking-wider">[ SIGNAL ]</span>
                        )}
                    </div>

                    {/* App Name & Desc */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className={`font-bold truncate ${isCurated ? 'text-white text-sm' : 'text-gray-300'}`}>
                                {app.name}
                            </span>
                            {urls.baseApp && <Hexagon size={12} className="text-blue-500" />}
                            {urls.repo && <Github size={12} className="text-gray-500" />}
                        </div>
                        <div className="text-gray-500 truncate mt-0.5 max-w-md">
                            {app.description.slice(0, 60)}...
                        </div>
                    </div>

                    {/* Builder */}
                    <div className="w-32 hidden md:block text-gray-400 truncate">
                        @{builderHandle}
                    </div>

                    {/* Verdict / Insight */}
                    <div className="w-48 hidden lg:block text-right">
                        {app.agentInsight ? (
                            <span className="text-electric-blue/80 italic truncate block">"{app.agentInsight.slice(0, 30)}..."</span>
                        ) : (
                            <span className="text-gray-700">ANALYZING...</span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="w-24 flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        {urls.baseApp ? (
                            <a href={urls.baseApp} target="_blank" className="hover:text-electric-blue"><Hexagon size={14} /></a>
                        ) : (
                            <span className="text-gray-800"><Hexagon size={14} /></span>
                        )}
                        {urls.website ? (
                            <a href={urls.website} target="_blank" className="hover:text-white"><ExternalLink size={14} /></a>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="font-mono text-sm">
            {/* Table Header */}
            <div className="flex items-center py-2 px-2 gap-4 text-[10px] text-gray-600 border-b border-white/10 uppercase tracking-widest mb-2">
                <div className="w-8 text-right">#</div>
                <div className="w-24">Status</div>
                <div className="flex-1">Detected App</div>
                <div className="w-32 hidden md:block">Builder</div>
                <div className="w-48 hidden lg:block text-right">Agent Verdict</div>
                <div className="w-24 text-right">Links</div>
            </div>

            {/* List */}
            <div className="space-y-px">
                {curatedApps.map((app, i) => <FeedRow key={app.id} app={app} rank={i + 1} isCurated={true} />)}
                {watchlistApps.map((app, i) => <FeedRow key={app.id} app={app} rank={curatedApps.length + i + 1} isCurated={false} />)}

                {curatedApps.length === 0 && watchlistApps.length === 0 && (
                    <div className="py-12 text-center text-gray-600">
                        WAITING FOR SIGNAL...
                    </div>
                )}
            </div>
        </div>
    );
}
