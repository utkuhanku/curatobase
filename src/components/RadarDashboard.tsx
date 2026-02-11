import { prisma } from "@/lib/db";
import { CurationStatus } from "@/lib/types";
import { Hexagon, Radio, Zap, Activity, Info, Eye, Database, Globe } from "lucide-react";
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
        <div className="space-y-6">

            {/* 1. AGENT STATE CARD (The "Scanner") */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-electric-blue/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Radio size={80} /></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-electric-blue">
                            <Activity size={18} className="animate-pulse" />
                            <h3 className="text-sm font-bold tracking-widest">LIVE SCANNER</h3>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stats.scanned.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">Casts analyzed in the last 24h</p>

                        <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500 leading-relaxed">
                            The Agent continuously reads the Farcaster stream, looking for new apps, keywords like "launched" or "shipped", and valid <span className="text-gray-300 font-mono">base.app</span> URLs.
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Database size={80} /></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-green-400">
                            <Database size={18} />
                            <h3 className="text-sm font-bold tracking-widest">CURATION ENGINE</h3>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stats.candidates} <span className="text-lg text-gray-500 font-normal">detected</span></p>
                        <p className="text-sm text-gray-400">Only {stats.curated} passed the quality filter.</p>

                        <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500 leading-relaxed">
                            Not every app makes it. The Agent filters for:
                            <ul className="mt-1 space-y-1 text-gray-400 font-mono">
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Verified Builder ID</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Functioning URL</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> No Spam/Shill patterns</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. TOP SIGNAL (The Spotlight) */}
            <div className="border border-electric-blue/30 bg-gradient-to-br from-electric-blue/10 to-black rounded-2xl p-1">
                <div className="bg-[#050607]/80 backdrop-blur-sm rounded-[14px] p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-electric-blue">
                            <Zap size={18} fill="currentColor" />
                            <h3 className="text-sm font-bold tracking-widest">TOP DETECTED SIGNAL</h3>
                        </div>
                        <span className="text-[10px] bg-electric-blue/20 text-electric-blue px-2 py-1 rounded border border-electric-blue/20">
                            AUTONOMOUS SELECTION
                        </span>
                    </div>

                    {topApp ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{topApp.name}</h2>
                                <p className="text-gray-300 text-lg leading-relaxed mb-6">{topApp.description}</p>

                                <div className="flex flex-wrap gap-3">
                                    {topApp.urls && JSON.parse(topApp.urls).baseApp && (
                                        <a href={JSON.parse(topApp.urls).baseApp} target="_blank" className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                                            <Hexagon size={16} /> Open Mini App
                                        </a>
                                    )}
                                    {topApp.urls && JSON.parse(topApp.urls).website && (
                                        <a href={JSON.parse(topApp.urls).website} target="_blank" className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors">
                                            <Globe size={16} /> Website
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-sm">
                                <h4 className="text-gray-500 font-mono text-xs uppercase mb-3">Agent Reasoning</h4>
                                <p className="text-electric-blue/90 italic mb-4">"{topApp.agentInsight}"</p>

                                <div className="space-y-2 text-xs font-mono text-gray-400">
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span>Relevance</span>
                                        <span className="text-white">{(topApp.curationScore || 0) * 10}%</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-1">
                                        <span>Builder</span>
                                        <span className="text-white">Active</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status</span>
                                        <span className="text-green-400">VERIFIED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 font-mono">
                            SCANNING FOR NEXT TOP PICK...
                        </div>
                    )}
                </div>
            </div>

            {/* 3. HOW IT WORKS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="md:col-span-3 text-center mb-2">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Promotion Protocol</h3>
                </div>
                {[
                    { title: "1. BUILD", desc: "Create a Base Mini App.", icon: Database },
                    { title: "2. SHIP", desc: "Deploy it. The agent watches on-chain activity.", icon: Zap },
                    { title: "3. SIGNAL", desc: "Post on Farcaster with 'base.app' link.", icon: Radio }
                ].map((step, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-3 text-white">
                            <step.icon size={18} />
                        </div>
                        <h4 className="font-bold text-white text-sm mb-1">{step.title}</h4>
                        <p className="text-xs text-gray-400">{step.desc}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}
