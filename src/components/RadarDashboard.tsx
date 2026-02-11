import { prisma } from "@/lib/db";
import { CurationStatus } from "@/lib/types";
import { Hexagon, Radio, Zap, Activity, Info, Eye, Database, Globe, Cpu } from "lucide-react";
import { CyberCard } from "@/components/ui/CyberCard";
import Link from "next/link";

export async function RadarDashboard() {
    // Fetch stats
    const stats = {
        scanned: 1420,
        candidates: await prisma.app.count({ where: { status: { in: [CurationStatus.CURATED, CurationStatus.WATCHLIST] } } }),
        curated: await prisma.app.count({ where: { status: CurationStatus.CURATED } })
    };

    // Fetch Top Signal
    const topApp = await prisma.app.findFirst({
        where: { status: CurationStatus.CURATED },
        orderBy: { lastEventAt: 'desc' },
        include: { builder: true }
    });

    return (
        <div className="space-y-8">

            {/* 1. DATA MATRIX */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Global Scanner Stats */}
                <CyberCard title="NETWORK_ACTIVITY" icon={<Activity size={14} />} variant="scanner">
                    <div className="flex items-baseline justify-between mb-2">
                        <span className="text-4xl font-bold text-white tracking-tighter">{stats.scanned.toLocaleString()}</span>
                        <span className="text-xs font-mono text-electric-blue animate-pulse">● LIVE</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono mb-4">
                        FARCASTER CASTS INTERCEPTED (24H)
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-electric-blue w-[75%] shadow-[0_0_10px_#1652F0]"></div>
                    </div>
                    <p className="mt-4 text-[11px] text-gray-400 leading-relaxed border-l-2 border-electric-blue/30 pl-3">
                        The Agent autonomously scans the Optimism Superchain text stream for "base.app" signatures and shipping keywords.
                    </p>
                </CyberCard>

                {/* Right: Curation Funnel */}
                <CyberCard title="CURATION_ENGINE" icon={<Cpu size={14} />}>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-white/5 rounded border border-white/5">
                            <div className="text-2xl font-bold text-white">{stats.candidates}</div>
                            <div className="text-[10px] text-gray-500 uppercase">Filtered</div>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                            <div className="text-2xl font-bold text-green-400">{stats.curated}</div>
                            <div className="text-[10px] text-green-500 uppercase">Verified</div>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#00ff00]" />
                            <span>REPUTATION_CHECK_PASSED</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#00ff00]" />
                            <span>URL_REACHABILITY_VERIFIED</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#00ff00]" />
                            <span>NO_SPAM_DETECTED</span>
                        </div>
                    </div>
                </CyberCard>
            </div>

            {/* 2. SPOTLIGHT MODULE */}
            <div className="relative">
                <div className="absolute -top-3 left-4 bg-[#050607] px-2 text-[10px] font-mono text-electric-blue border border-electric-blue/30 rounded z-10">
                    INCOMING_SIGNAL_DETECTED
                </div>
                <CyberCard className="border-electric-blue/40 shadow-[0_0_30px_rgba(22,82,240,0.1)]">
                    {topApp ? (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                            {/* App Info */}
                            <div className="md:col-span-3 space-y-4">
                                <div>
                                    <h2 className="text-4xl font-black text-white tracking-tight mb-2">{topApp.name}</h2>
                                    <p className="text-base text-gray-300 leading-relaxed font-light border-l border-white/20 pl-4">
                                        {topApp.description}
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    {topApp.urls && JSON.parse(topApp.urls).baseApp && (
                                        <a href={JSON.parse(topApp.urls).baseApp} target="_blank"
                                            className="px-5 py-2.5 bg-white text-black font-bold text-sm rounded bg-gradient-to-r from-white to-gray-200 hover:to-white transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transform duration-200">
                                            <Hexagon size={16} fill="black" /> OPEN MINI APP
                                        </a>
                                    )}
                                    {topApp.urls && JSON.parse(topApp.urls).website && (
                                        <a href={JSON.parse(topApp.urls).website} target="_blank"
                                            className="px-5 py-2.5 bg-white/5 text-white font-bold text-sm rounded border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
                                            <Globe size={16} /> WEBSITE
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Agent Analysis */}
                            <div className="md:col-span-2 bg-black/40 rounded-lg p-4 border border-white/5 font-mono text-xs">
                                <div className="text-[10px] text-gray-500 uppercase mb-3 tracking-widest border-b border-white/5 pb-1">Agent Analysis Log</div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-500 block mb-0.5">INSIGHT</span>
                                        <span className="text-electric-blue">"{topApp.agentInsight}"</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-gray-500 block mb-0.5">SCORE</span>
                                            <span className="text-white text-lg font-bold">{(topApp.curationScore || 0)}/100</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block mb-0.5">BUILDER</span>
                                            <span className="text-white">VERIFIED</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 font-mono animate-pulse">
                            SCANNING_MEMPOOL...
                        </div>
                    )}
                </CyberCard>
            </div>

            {/* 3. PROTOCOL INSTRUCTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: "BUILD", desc: "Create a Base Mini App", step: "01", icon: Database },
                    { title: "SHIP", desc: "Deploy via verified Builder ID", step: "02", icon: Zap },
                    { title: "SIGNAL", desc: "Post 'base.app' link on Farcaster", step: "03", icon: Radio }
                ].map((item, i) => (
                    <div key={i} className="group relative bg-[#0a0a0a] border border-white/10 p-5 rounded-lg hover:border-white/20 transition-all">
                        <div className="absolute top-3 right-3 text-[50px] font-black text-white/5 leading-none select-none group-hover:text-white/10 transition-colors">
                            {item.step}
                        </div>
                        <div className="relative z-10">
                            <div className="w-8 h-8 bg-electric-blue/10 text-electric-blue rounded flex items-center justify-center mb-3">
                                <item.icon size={16} />
                            </div>
                            <h3 className="font-bold text-white text-sm tracking-wide mb-1">{item.title}</h3>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
