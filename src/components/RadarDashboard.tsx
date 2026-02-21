"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap, Database, Search, Filter, Play, Scan, Award, ChevronRight, Smartphone, CheckCircle2, XCircle, Clock, Radio } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

// Mock data for display - in production this would be passed as props
const stats = {
    scanned: 1420,
    candidates: 12,
    curated: 1
};

const topApp = {
    name: "SuperDapp",
    description: "A decentralized social layer for Base ecosystem enthusiasts.",
    agentInsight: "Strong on-chain footprint verified. Contract interaction volume is high. Reward criteria met.",
    curationScore: 95,
    urls: JSON.stringify({ baseApp: "https://base.app", website: "#" })
};

export function RadarDashboard() {
    return (
        <div className="relative space-y-8 p-2">

            {/* 1. EXECUTIVE SUMMARY ROW - MONOLITHIC REDESIGN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-[2px] bg-white/[0.05] p-[2px] rounded-[32px] overflow-hidden">
                {/* METRIC: NETWORK VOLUME */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-10 md:p-16 bg-[#030303] flex flex-col items-center justify-center text-center group hover:bg-[#050505] transition-colors"
                >
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1652F0] animate-pulse"></span>
                        Ecosystem Scan
                    </h3>
                    <div className="text-6xl md:text-7xl font-black text-white tracking-tighter tabular-nums mb-3">1,420</div>
                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Signals / 24h</p>
                </motion.div>

                {/* METRIC: QUALITY FILTER */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="p-10 md:p-16 bg-[#030303] flex flex-col items-center justify-center text-center group hover:bg-[#050505] transition-colors"
                >
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1652F0]"></span>
                        Valid Candidates
                    </h3>
                    <div className="text-6xl md:text-7xl font-black text-white tracking-tighter tabular-nums mb-3">12</div>
                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Passed Threshold</p>
                </motion.div>

                {/* METRIC: CURATED SELECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="p-10 md:p-16 bg-[#030303] flex flex-col items-center justify-center text-center group hover:bg-[#050505] transition-colors relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,122,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10">
                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF7A] shadow-[0_0_10px_#00FF7A]"></span>
                            Elite Curation
                        </h3>
                        <div className="text-6xl md:text-7xl font-black text-[#00FF7A] tracking-tighter tabular-nums mb-3">1</div>
                        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">Promoted Project</p>
                    </div>
                </motion.div>
            </div>


            {/* 3. FEATUTRED SECTION "The Frame" */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative mt-16"
            >
                {/* Header Label */}
                <div className="flex items-center gap-3 mb-6 px-2">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    <span className="text-sm font-bold tracking-widest text-[#1652F0] uppercase">Elite Curation Spotlight</span>
                </div>

                {/* Main Card */}
                <div className="bg-[#030303] border-t border-b md:border border-white/[0.03] md:rounded-[40px] overflow-hidden relative group transition-all duration-700 hover:bg-[#050505]">
                    {/* Vast Empty Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1652F0]/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                    {topApp ? (
                        <div className="relative z-10 px-6 py-16 md:p-24 flex flex-col items-center text-center">

                            {/* App Details - Monolithic */}
                            <div className="max-w-4xl space-y-10">
                                <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-full mb-4">
                                    <Award size={14} className="text-[#00FF7A]" />
                                    <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Verified Ecosystem Partner</span>
                                </div>

                                <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] text-balance">
                                    {topApp.name}
                                </h2>

                                <p className="text-2xl md:text-4xl text-gray-400 font-light leading-snug text-balance max-w-3xl mx-auto">
                                    {topApp.description}
                                </p>

                                <div className="pt-12 flex justify-center w-full">
                                    {topApp.urls && JSON.parse(topApp.urls).baseApp ? (
                                        <a href={JSON.parse(topApp.urls).baseApp} target="_blank"
                                            className="px-12 py-6 bg-white text-black hover:bg-gray-200 hover:scale-105 font-black text-sm uppercase tracking-[0.2em] rounded-full transition-all duration-500 flex items-center gap-4 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                                            Experience {topApp.name} <ChevronRight size={18} className="transition-transform" />
                                        </a>
                                    ) : (
                                        <div className="px-12 py-6 bg-white/[0.02] text-gray-500 font-black text-sm uppercase tracking-[0.2em] rounded-full border border-white/[0.05]">
                                            Experience Unavailable
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 px-6 py-24 md:p-32 flex flex-col items-center text-center">
                            <div className="inline-block p-6 rounded-full bg-white/[0.02] border border-white/[0.05] mb-8">
                                <Scan size={48} className="text-gray-600 animate-pulse" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-500 tracking-tighter mb-4">Awaiting Signal</h2>
                            <p className="text-xl text-gray-600 font-light">The Curator is analyzing the ecosystem.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* 4. HOW IT WORKS (Ultra Minimal) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="pt-24 pb-12 w-full max-w-6xl mx-auto"
            >
                <div className="flex flex-col items-center mb-16 text-center">
                    <h3 className="text-xs font-bold text-gray-500 tracking-[0.3em] uppercase mb-4">The Curato Standard</h3>
                    <h4 className="text-3xl md:text-4xl font-black text-white tracking-tight text-balance">How the Agent surfaces excellence.</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                    {[
                        { title: "Monitor", icon: Radio, desc: "Autonomous scanning of the Base network and Farcaster social graph for deployment signals." },
                        { title: "Verify", icon: Search, desc: "Rigorous heuristic analysis verifying source code, origin reputation, and eliminating spam contracts." },
                        { title: "Promote", icon: Award, desc: "High-grade verified applications are dynamically minted to the dashboard for user discovery." }
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-6">
                            <div className="h-16 w-16 rounded-full border border-white/[0.05] bg-white/[0.02] flex items-center justify-center text-[#1652F0]">
                                <s.icon size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white tracking-tight mb-3">{s.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed font-light px-4">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 flex justify-center">
                    <Link href="/about" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1652F0] hover:text-white transition-colors">
                        Read the full manifesto <ChevronRight size={14} />
                    </Link>
                </div>
            </motion.div>

        </div>
    );

}
