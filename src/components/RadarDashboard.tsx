"use client";

import { motion } from "framer-motion";
import { Hexagon, Radio, Zap, Activity, Database, Globe, Cpu, Scan, Signal, Award } from "lucide-react";

// Mock data to ensure it renders on client immediately without async issues for now
// In real app, pass this as props from a server component wrapper
const stats = {
    scanned: 1420,
    candidates: 12,
    curated: 1
};

const topApp = {
    name: "SuperDapp",
    description: "A decentralized social layer for Base ecosystem enthusiasts.",
    agentInsight: "Strong on-chain footprint + verified rewards.",
    curationScore: 95,
    urls: JSON.stringify({ baseApp: "https://base.app", website: "https://base.org" })
};

export function RadarDashboard() {
    return (
        <div className="relative space-y-8 p-2">

            {/* 1. HERO HUD: GLOBAL METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* A. LIVE SCANNER */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-2 relative overflow-hidden rounded-xl bg-[#030303] border border-white/10 group"
                >
                    {/* CSS Grid Background */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#1652f01a_1px,transparent_1px),linear-gradient(to_bottom,#1652f01a_1px,transparent_1px)] bg-[size:24px_24px]" />

                    <div className="absolute top-0 right-0 p-4 opacity-50"><Activity className="text-electric-blue animate-pulse" size={24} /></div>

                    <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 bg-electric-blue rounded-full animate-ping" />
                                <h3 className="text-xs font-mono font-bold text-electric-blue tracking-widest">REALTIME_SCANNER_FEED</h3>
                            </div>
                        </div>

                        <div className="flex items-end gap-4 mt-8">
                            <div>
                                <div className="text-5xl font-black text-white tracking-tighter tabular-nums leading-none">
                                    {stats.scanned.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-mono">Casts Analyzed (24h)</div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-white/5 flex gap-8">
                            <div>
                                <div className="text-2xl font-bold text-gray-300 tabular-nums">{stats.candidates}</div>
                                <div className="text-[10px] text-gray-600 uppercase font-mono">Filtered</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-400 tabular-nums">{stats.curated}</div>
                                <div className="text-[10px] text-green-600 uppercase font-mono">Selected</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* B. CURATION CRITERIA */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="rounded-xl bg-[#050607] border border-white/10 p-6 flex flex-col justify-center relative min-h-[200px]"
                >
                    <div className="absolute top-2 right-2"><Cpu size={16} className="text-gray-700" /></div>
                    <h3 className="text-xs font-mono font-bold text-gray-500 tracking-widest mb-6">CRITERIA_MATRIX</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20"><Scan size={12} /></div>
                            <span className="text-sm font-bold text-gray-300">Verified Builder</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20"><Globe size={12} /></div>
                            <span className="text-sm font-bold text-gray-300">Live URL</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20"><Signal size={12} /></div>
                            <span className="text-sm font-bold text-gray-300">Organic Signal</span>
                        </li>
                    </ul>
                </motion.div>
            </div>


            {/* 2. TOP SIGNAL SPOTLIGHT (The "Frame") */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative group"
            >
                {/* SVG HUD Frame */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 0 L10 0 L10 2 L2 2 L2 10 L0 10 Z" fill="#1652F0" opacity="0.5" />
                        <path d="M100 0 L90 0 L90 2 L98 2 L98 10 L100 10 Z" fill="#1652F0" opacity="0.5" />
                        <path d="M0 100 L10 100 L10 98 L2 98 L2 90 L0 90 Z" fill="#1652F0" opacity="0.5" />
                        <path d="M100 100 L90 100 L90 98 L98 98 L98 90 L100 90 Z" fill="#1652F0" opacity="0.5" />

                        <rect x="0" y="0" width="100" height="100" fill="none" stroke="#1652f0" strokeWidth="0.2" strokeOpacity="0.2" />
                    </svg>
                </div>

                {/* Main Content Container */}
                <div className="relative z-10 bg-[#030303]/90 backdrop-blur-md border border-electric-blue/20 rounded-lg p-8 md:p-12 overflow-hidden mx-1 my-1">

                    {topApp ? (
                        <div className="relative z-20">
                            <div className="flex justify-between items-start mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-electric-blue/10 border border-electric-blue/30 text-electric-blue text-[10px] font-mono font-bold tracking-widest">
                                    <Zap size={10} fill="currentColor" /> ACTIVE_SIGNAL_DETECTED
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-500 font-mono">CONFIDENCE</div>
                                    <div className="text-3xl font-black text-white tabular-nums">{(topApp.curationScore || 0)}<span className="text-sm text-gray-500 font-normal">%</span></div>
                                </div>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(22,82,240,0.5)]">
                                {topApp.name}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <p className="text-lg text-gray-400 font-light leading-relaxed">
                                    {topApp.description}
                                </p>
                                <div className="bg-electric-blue/5 border-l-2 border-electric-blue p-4">
                                    <p className="font-mono text-xs text-electric-blue mb-1">AGENT_ANALYSIS_LOG:</p>
                                    <p className="text-sm text-gray-300 italic">"{topApp.agentInsight}"</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                {topApp.urls && JSON.parse(topApp.urls).baseApp && (
                                    <a href={JSON.parse(topApp.urls).baseApp} target="_blank"
                                        className="px-6 py-3 bg-white text-black font-extrabold text-sm rounded hover:bg-electric-blue hover:text-white transition-all flex items-center gap-2 group/btn shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                        <Hexagon size={18} className="group-hover/btn:rotate-90 transition-transform" />
                                        OPEN MINI APP
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Scan size={48} className="text-gray-700 mx-auto mb-4 animate-spin-slow" />
                            <p className="text-gray-500 font-mono tracking-widest">SCANNING_MEMPOOL_FOR_SIGNAL...</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* 3. PROMOTION PROTOCOL STEPS */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-white/10 flex-grow" />
                    <h3 className="text-xs font-mono font-bold text-gray-600 tracking-[0.3em]">PROMOTION_PROTOCOL_V1</h3>
                    <div className="h-px bg-white/10 flex-grow" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { step: "01", title: "BUILD", sub: "ON BASE", icon: Database, desc: "Deploy your app on Base. The Agent monitors on-chain contracts and deployments." },
                        { step: "02", title: "SIGNAL", sub: "ON FARCASTER", icon: Radio, desc: "Post with your 'base.app' link. This is the trigger signal the Agent listens for." },
                        { step: "03", title: "EARN", sub: "CURATION", icon: Award, desc: "High signal apps are verified and automatically promoted to this dashboard." }
                    ].map((s, i) => (
                        <div key={i} className="group relative p-6 border border-white/5 hover:border-white/20 hover:bg-white/[0.02] transition-colors rounded-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-4xl font-black text-white/5 font-mono group-hover:text-electric-blue/20 transition-colors">{s.step}</div>
                                <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors border border-white/5"><s.icon size={18} /></div>
                            </div>
                            <h4 className="text-lg font-black text-white tracking-tight mb-1">{s.title}</h4>
                            <div className="text-[10px] font-mono text-electric-blue uppercase tracking-widest mb-3">{s.sub}</div>
                            <p className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
    );
}
