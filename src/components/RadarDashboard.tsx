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

            {/* 1. EXECUTIVE SUMMARY ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* METRIC: NETWORK VOLUME */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-6 md:p-8 rounded-2xl bg-[#030303] border border-white/[0.05] relative overflow-hidden group hover:bg-white/[0.02] transition-colors"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                        <Activity className="text-[#1652F0]" size={64} />
                    </div>
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1652F0] animate-pulse"></span>
                                Ecosystem Scan
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">1,420</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/[0.05]">
                            <p className="text-[10px] text-gray-500 leading-relaxed font-mono uppercase tracking-widest">
                                Signals / 24h
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* METRIC: QUALITY FILTER */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="p-6 md:p-8 rounded-2xl bg-[#030303] border border-white/[0.05] relative overflow-hidden group hover:bg-white/[0.02] transition-colors"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                        <Scan className="text-[#1652F0]" size={64} />
                    </div>
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1652F0]"></span>
                                Filter Threshold
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">12</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/[0.05]">
                            <p className="text-[10px] text-gray-500 leading-relaxed font-mono uppercase tracking-widest">
                                Valid Candidates
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* METRIC: CURATED SELECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="p-6 md:p-8 rounded-2xl bg-[#030303] border border-white/[0.05] relative overflow-hidden group hover:bg-white/[0.02] transition-colors"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                        <Award className="text-[#1652F0]" size={64} />
                    </div>
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF7A] shadow-[0_0_10px_#00FF7A]"></span>
                                Elite Curation
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">1</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/[0.05]">
                            <p className="text-[10px] text-gray-500 leading-relaxed font-mono uppercase tracking-widest">
                                Promoted Project
                            </p>
                        </div>
                    </div>
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
                <div className="bg-[#030303] border border-white/[0.05] rounded-3xl overflow-hidden relative group hover:border-[#1652F0]/20 transition-all duration-500">
                    {/* Background Grid Accent */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

                    {topApp ? (
                        <div className="relative z-10 p-8 md:p-12 grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-16 items-center">

                            {/* App Details */}
                            <div className="md:col-span-3 space-y-8">
                                <div>
                                    <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 tracking-tighter leading-tight mb-4 text-balance">
                                        {topApp.name}
                                    </h2>
                                    <p className="text-xl text-gray-400 font-light leading-relaxed text-balance">
                                        {topApp.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    {topApp.urls && JSON.parse(topApp.urls).baseApp && (
                                        <a href={JSON.parse(topApp.urls).baseApp} target="_blank"
                                            className="px-8 py-4 bg-white text-black hover:bg-gray-200 font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center gap-3 group">
                                            Open Application <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Agent Analysis Panel */}
                            <div className="md:col-span-2 bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] rounded-2xl p-8 relative">
                                <div className="absolute -top-3 left-6 inline-flex items-center gap-2 bg-[#030303] px-3 font-mono text-[10px] text-[#1652F0] font-bold uppercase tracking-widest border border-white/[0.05] rounded-full">
                                    <Zap size={10} /> Intelligence Report
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Confidence Score</div>
                                        <div className="text-4xl font-black text-white flex items-baseline gap-2 tabular-nums">
                                            {topApp.curationScore} <span className="text-sm text-gray-600 font-mono tracking-widest">/ 100</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Curator Reasoning</div>
                                        <p className="text-sm text-blue-200/60 leading-relaxed font-light">
                                            "{topApp.agentInsight}"
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-white/[0.05] flex flex-wrap gap-3">
                                        <div className="px-3 py-1.5 rounded-full bg-[#00FF7A]/10 border border-[#00FF7A]/20 text-[10px] text-[#00FF7A] font-mono tracking-widest uppercase">
                                            VERIFIED_CONTRACT
                                        </div>
                                        <div className="px-3 py-1.5 rounded-full bg-[#1652F0]/10 border border-[#1652F0]/20 text-[10px] text-[#1652F0] font-mono tracking-widest uppercase">
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

            {/* 3. LIVE SCANNER FEED (Transparency Log) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                {/* A. RECENT ACTIVITY LOG */}
                <div className="bg-[#030303] border border-white/[0.05] rounded-2xl overflow-hidden flex flex-col h-[320px]">
                    <div className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.02] flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <h3 className="text-[10px] font-mono font-bold text-gray-500 tracking-widest">LIVE_SCANNER_LOG</h3>
                        </div>
                        <div className="text-[10px] font-mono text-gray-600">ts: {new Date().toISOString().split('T')[1].split('.')[0]}</div>
                    </div>

                    <div className="p-4 overflow-y-auto space-y-2 font-mono text-xs custom-scrollbar">
                        {[
                            { time: "10s ago", source: "warpcast", slug: "base-god-frame", status: "REJECTED", reason: "LOW_REPUTATION_SCORE", color: "text-[#FF4D4D]" },
                            { time: "45s ago", source: "onchain", slug: "0x82...9a12", status: "PENDING", reason: "ANALYZING_CONTRACT...", color: "text-[#FFD166]" },
                            { time: "2m ago", source: "warpcast", slug: "super-dapp-v2", status: "VERIFIED", reason: "HIGH_CONFIDENCE_SIGNAL", color: "text-[#00FF7A]" },
                            { time: "5m ago", source: "base-scan", slug: "0x11...b3c4", status: "REJECTED", reason: "NO_VERIFIED_SOURCE", color: "text-[#FF4D4D]" },
                            { time: "12m ago", source: "warpcast", slug: "spam-bot-9000", status: "REJECTED", reason: "SPAM_HEURISTIC_MATCH", color: "text-[#FF4D4D]" },
                            { time: "15m ago", source: "onchain", slug: "0xab...8812", status: "PENDING", reason: "AWAITING_BLOCK_CONFIRMATION", color: "text-[#FFD166]" },
                        ].map((log, i) => (
                            <div key={i} className="grid grid-cols-12 gap-2 items-center hover:bg-white/[0.02] p-2 rounded-lg transition-colors group">
                                <div className="col-span-2 text-gray-600">{log.time}</div>
                                <div className="col-span-3 text-[#1652F0]/60 truncate group-hover:text-[#1652F0] transition-colors">[{log.source}]</div>
                                <div className="col-span-3 text-gray-400 truncate">{log.slug}</div>
                                <div className={`col-span-4 text-right font-bold ${log.color} flex justify-end gap-2`}>
                                    <span>{log.status}</span>
                                </div>
                                <div className="col-span-12 text-[10px] text-gray-700 pl-2 border-l border-white/5 mt-1 truncate">
                                    &gt; {log.reason}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* B. PROMOTION PROTOCOL STEPS (Moved here) */}
                <div className="flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-white/[0.05] flex-grow" />
                        <h3 className="text-xs font-mono font-bold text-gray-600 tracking-[0.3em]">PROMOTION_PROTOCOL_V1</h3>
                        <div className="h-px bg-white/[0.05] flex-grow" />
                    </div>

                    <div className="space-y-4 flex-grow">
                        {[
                            { step: "01", title: "BUILD", sub: "ON BASE", icon: Database, desc: "Deploy your app on Base. The Agent monitors on-chain contracts and deployments." },
                            { step: "02", title: "SIGNAL", sub: "ON FARCASTER", icon: Radio, desc: "Post with your 'base.app' link. This is the trigger signal the Agent listens for." },
                            { step: "03", title: "EARN", sub: "CURATION", icon: Award, desc: "High signal apps are verified and automatically promoted to this dashboard." }
                        ].map((s, i) => (
                            <div key={i} className="group relative p-5 border border-white/[0.05] hover:border-white/20 hover:bg-white/[0.02] transition-colors rounded-2xl flex items-start gap-5">
                                <div className="text-2xl font-black text-white/[0.05] font-mono group-hover:text-[#1652F0]/20 transition-colors mt-1">{s.step}</div>
                                <div>
                                    <h4 className="text-sm font-black text-white tracking-tight mb-2 flex items-center gap-2">
                                        {s.title} <span className="text-[10px] font-mono text-[#1652F0] font-bold tracking-widest px-2 py-0.5 rounded border border-[#1652F0]/20">{s.sub}</span>
                                    </h4>
                                    <p className="text-xs text-gray-500 leading-relaxed font-light group-hover:text-gray-400 transition-colors">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* 4. HOW IT WORKS (Simplified) */}
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
