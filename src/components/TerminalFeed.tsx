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

    return (
        <div className="font-mono text-sm bg-black/20 rounded-lg p-2 border border-white/5">
            {/* Table Header */}
            <div className="flex items-center py-3 px-3 gap-4 text-[10px] text-gray-500 border-b border-white/5 uppercase tracking-[0.2em] mb-2 bg-white/[0.02]">
                <div className="w-8 text-right text-gray-700">#</div>
                <div className="w-28 pl-1">Detection</div>
                <div className="flex-1">Target Protocol</div>
                <div className="w-32 hidden md:block">Builder ID</div>
                <div className="w-48 hidden lg:block text-right">Probability</div>
                <div className="w-20 text-right">Uplink</div>
            </div>

            {/* List */}
            <div className="space-y-1">
                {curatedApps.map((app, i) => <FeedRow key={app.id} app={app} rank={i + 1} isCurated={true} />)}
                {watchlistApps.map((app, i) => <FeedRow key={app.id} app={app} rank={curatedApps.length + i + 1} isCurated={false} />)}

                {curatedApps.length === 0 && watchlistApps.length === 0 && (
                    <div className="py-16 text-center text-gray-700 flex flex-col items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        <span className="tracking-widest text-xs">NO SIGNALS INTERCEPTED</span>
                    </div>
                )}
            </div>

            <div className="mt-4 border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-gray-600 px-2">
                <div>SYNC_RATE: 100ms</div>
                <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    LIVE FEED ACTIVE
                </div>
            </div>
        </div>
    );
}

function FeedRow({ app, rank, isCurated }: { app: any, rank: number, isCurated: boolean }) {
    const urls = JSON.parse(app.urls);
    const builder = app.builder;
    const handles = JSON.parse(builder.handles);
    const builderHandle = handles.farcaster || builder.id;

    return (
        <div className={`group relative border border-transparent hover:border-white/5 hover:bg-white/[0.03] rounded-md transition-all duration-300 ${isCurated ? 'bg-blue-500/[0.02]' : ''}`}>
            <div className="flex items-center py-3 px-3 gap-4 text-xs font-mono relative z-10">
                {/* Rank */}
                <div className="w-8 text-gray-700 text-right font-light group-hover:text-gray-500 transition-colors">
                    {rank.toString().padStart(2, '0')}
                </div>

                {/* Signal Type */}
                <div className="w-28 shrink-0 flex items-center">
                    {isCurated ? (
                        <span className="text-electric-blue font-bold text-[10px] tracking-widest px-2 py-0.5 rounded bg-electric-blue/10 border border-electric-blue/20 shadow-[0_0_10px_-5px_#3b82f6]">
                            VERIFIED
                        </span>
                    ) : (
                        <span className="text-gray-600 text-[10px] tracking-widest px-2 py-0.5 border border-white/5 rounded">
                            PENDING
                        </span>
                    )}
                </div>

                {/* App Name & Desc */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={`font-bold truncate tracking-tight ${isCurated ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                            {app.name}
                        </span>
                        {urls.baseApp && <Hexagon size={10} className="text-blue-500 fill-blue-500/20" />}
                    </div>
                    <div className="text-gray-600 truncate mt-0.5 max-w-md text-[10px] group-hover:text-gray-500 transition-colors">
                        {app.description ? app.description.slice(0, 55) : 'No description available'}...
                    </div>
                </div>

                {/* Builder */}
                <div className="w-32 hidden md:block text-gray-500 truncate text-[10px]">
                    <span className="text-gray-700 mr-1">from</span>
                    <span className="text-gray-400 group-hover:text-blue-400 transition-colors">@{builderHandle}</span>
                </div>

                {/* Verdict / Insight */}
                <div className="w-48 hidden lg:block text-right">
                    {app.agentInsight ? (
                        <span className="text-electric-blue/80 italic truncate block text-[10px]">
                            {app.agentInsight.slice(0, 25)}...
                        </span>
                    ) : (
                        <span className="text-gray-800 text-[10px] tracking-widest">SCANNING...</span>
                    )}
                </div>

                {/* Actions */}
                <div className="w-20 flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <a href={urls.baseApp || urls.website || '#'} target="_blank" className="hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
                        <ExternalLink size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
}
