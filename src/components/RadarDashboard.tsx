import { prisma } from "@/lib/db";
import { CurationStatus } from "@/lib/types";
import { Hexagon, Radio, Zap, ArrowRight, Activity, Terminal } from "lucide-react";
import Link from "next/link";

export async function RadarDashboard() {
    // Fetch stats
    const stats = {
        scanned: 1420, // Mock for now, or fetch from DB state
        candidates: await prisma.app.count({ where: { status: { in: [CurationStatus.CURATED, CurationStatus.WATCHLIST] } } }),
        curated: await prisma.app.count({ where: { status: CurationStatus.CURATED } })
    };

    // Fetch Top Signal
    const topApp = await prisma.app.findFirst({
        where: { status: CurationStatus.CURATED },
        orderBy: { lastEventAt: 'desc' },
        include: { builder: true }
    });

    const InstructionCard = ({ icon: Icon, title, desc }: any) => (
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-2">
            <div className="bg-electric-blue/20 w-8 h-8 rounded-lg flex items-center justify-center text-electric-blue">
                <Icon size={16} />
            </div>
            <h3 className="font-bold text-white text-sm">{title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
        </div>
    );

    return (
        <div className="space-y-12">
            {/* 1. Hero Metrics */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-electric-blue/10 border border-electric-blue/30 p-4 rounded-lg text-center">
                    <div className="text-electric-blue font-bold text-2xl mb-1">{stats.scanned.toLocaleString()}</div>
                    <div className="text-[10px] uppercase tracking-widest text-electric-blue/60 font-mono">Casts Scanned</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                    <div className="text-white font-bold text-2xl mb-1">{stats.candidates}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Apps Detected</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-center">
                    <div className="text-green-400 font-bold text-2xl mb-1">{stats.curated}</div>
                    <div className="text-[10px] uppercase tracking-widest text-green-500/60 font-mono">High Signal</div>
                </div>
            </div>

            {/* 2. Top Signal Spotlight */}
            {topApp ? (
                <div className="relative overflow-hidden rounded-2xl border border-electric-blue/30 bg-gradient-to-br from-electric-blue/10 to-black p-8">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Hexagon size={120} /></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="animate-pulse relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-mono text-green-400 tracking-widest">LIVE INCOMING SIGNAL</span>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{topApp.name}</h2>
                        <p className="text-gray-300 max-w-md text-lg leading-relaxed mb-6">
                            {topApp.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm font-mono text-electric-blue/80 bg-electric-blue/5 inline-flex px-4 py-2 rounded-lg border border-electric-blue/20">
                            <Activity size={16} />
                            <span>AGENT_VERDICT: "{topApp.agentInsight}"</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                    <Radio className="mx-auto text-gray-600 mb-4 animate-pulse" size={32} />
                    <p className="text-gray-500 font-mono">SCANNING FOR HIGH SIGNAL...</p>
                </div>
            )}

            {/* 3. How it Works (Trigger) */}
            <div>
                <div className="flex items-center gap-2 mb-6 opacity-70">
                    <Zap size={16} className="text-electric-blue" />
                    <h3 className="text-sm font-bold font-mono tracking-widest">HOW TO TRIGGER THE AGENT</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InstructionCard
                        icon={Hexagon}
                        title="1. SHIP ON BASE"
                        desc="Deploy your app. The agent monitors the blockchain and 'base.app' URLs for new deployments."
                    />
                    <InstructionCard
                        icon={Activity}
                        title="2. POST PROOF"
                        desc="Share it on Farcaster. Include a Demo URL, Github Repo, or Transaction Hash. No proof = No signal."
                    />
                    <InstructionCard
                        icon={Radio}
                        title="3. GET CURATED"
                        desc="If your signal is strong (Code + Live), the agent autonomously promotes you here and in daily reports."
                    />
                </div>
            </div>
        </div>
    );
}
