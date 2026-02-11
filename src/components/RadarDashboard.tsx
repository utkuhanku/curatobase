
"use client";

import { motion } from "framer-motion";
import { Hexagon, Radio, Zap, Activity, Database, Globe, Cpu, Scan, Signal, Award, ChevronRight } from "lucide-react";
import Link from "next/link";

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

            {/* 1. EXECUTIVE SUMMARY ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* METRIC: NETWORK VOLUME */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-6 rounded-xl bg-[#080a0c] border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Activity className="text-blue-500" size={32} />
                    </div>
                    <h3 className="text-xs font-medium text-blue-400 uppercase tracking-widest mb-2">Network Monitor</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white tabular-nums">{stats.scanned.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 font-normal">signals/24h</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                        Continuous scanning of Farcaster casts and Base transactions for new deployments.
                    </p>
                </motion.div>

                {/* METRIC: QUALITY FILTER */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="p-6 rounded-xl bg-[#080a0c] border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Scan className="text-amber-500" size={32} />
                    </div>
                    <h3 className="text-xs font-medium text-amber-500 uppercase tracking-widest mb-2">Quality Filter</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white tabular-nums">{stats.candidates}</span>
                        <span className="text-xs text-gray-500 font-normal">candidates</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                        Potential apps identified. Pending deeper verification of smart contracts and builder identity.
                    </p>
                </motion.div>

                {/* METRIC: CURATED SELECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="p-6 rounded-xl bg-[#080a0c] border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Award className="text-green-500" size={32} />
                    </div>
                    <h3 className="text-xs font-medium text-green-500 uppercase tracking-widest mb-2">Verified & Curated</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white tabular-nums">{stats.curated}</span>
                        <span className="text-xs text-gray-500 font-normal">top pick</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                        High-confidence applications that meet all safety and engagement criteria.
                    </p>
                </motion.div>
            </div>


            {/* 2. FEATURED SIGNAL (The "Frame") */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative"
            >
                {/* Header Label */}
                <div className="flex items-center gap-2 mb-3 px-1">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-xs font-bold tracking-widest text-blue-500 uppercase">Incoming Signal Detected</span>
                </div>

                {/* Main Card */}
                <div className="bg-[#050505] border border-blue-900/30 rounded-2xl overflow-hidden relative">
                    {/* Background Grid Accent */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1652f00a_1px,transparent_1px),linear-gradient(to_bottom,#1652f00a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                    {topApp ? (
                        <div className="relative z-10 p-8 md:p-10 grid grid-cols-1 md:grid-cols-5 gap-10 items-center">

                            {/* App Details */}
                            <div className="md:col-span-3 space-y-6">
                                <div>
                                    <h2 className="text-5xl font-bold text-white tracking-tight leading-tight mb-3">
                                        {topApp.name}
                                    </h2>
                                    <p className="text-lg text-gray-400 font-light leading-relaxed">
                                        {topApp.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {topApp.urls && JSON.parse(topApp.urls).baseApp && (
                                        <a href={JSON.parse(topApp.urls).baseApp} target="_blank"
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 group">
                                            Open Mini App <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Agent Analysis Panel */}
                            <div className="md:col-span-2 bg-blue-950/10 border border-blue-900/20 rounded-xl p-6 relative">
                                <div className="absolute -top-3 left-4 bg-[#050505] px-2 text-[10px] text-blue-400 font-mono uppercase tracking-widest">
                                    Agent Analysis
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">Score</div>
                                        <div className="text-3xl font-bold text-white flex items-baseline gap-2">
                                            {topApp.curationScore} <span className="text-sm text-gray-600 font-normal">/ 100</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase font-medium mb-1">Reasoning</div>
                                        <p className="text-sm text-blue-200/80 leading-relaxed italic">
                                            "{topApp.agentInsight}"
                                        </p>
                                    </div>

                                    <div className="pt-2 flex gap-2">
                                        <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] text-green-400 font-mono">
                                            VERIFIED_CONTRACT
                                        </div>
                                        <div className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-mono">
                                            HIGH_ENGAGEMENT
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-24">
                            <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                                <Scan size={32} className="text-gray-500 animate-pulse" />
                            </div>
                            <p className="text-gray-500 font-medium">Scanning network for new signals...</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* 3. HOW IT WORKS (Simplified) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="pt-8 border-t border-white/5"
            >
                <div className="flex justify-between items-end mb-6">
                    <h3 className="text-sm font-bold text-white tracking-wide">How Curato Works</h3>
                    <Link href="/about" className="text-xs text-blue-500 hover:text-blue-400 transition-colors">Learn more &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { title: "1. Monitor", desc: "Agent scans Base chain & Farcaster" },
                        { title: "2. Verify", desc: "Checks contracts, reputation & spam" },
                        { title: "3. Promote", desc: "Top apps get visibility & rewards" }
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                            <div className="h-8 w-8 rounded-full bg-blue-900/20 text-blue-500 flex items-center justify-center font-bold text-xs ring-1 ring-blue-900/40">
                                {i + 1}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-200">{s.title}</h4>
                                <p className="text-xs text-gray-500">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

        </div>
    );
}

