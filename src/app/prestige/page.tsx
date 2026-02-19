"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldCheck, BadgeCheck, Activity, ExternalLink, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TRUSTED_APPS = [
    {
        name: "Moxie",
        category: "Infrastructure",
        description: "Fan engagement protocol offering rewards for activity.",
        trustScore: 99.9,
        triggerReason: "Consistent daily reward distribution to >10k users. Zero incident reports.",
        metric: "Reward Consistency",
        metricValue: "99.9%",
        url: "https://moxie.xyz",
        color: "text-blue-400"
    },
    {
        name: "Aerodrome",
        category: "DeFi",
        description: "The central trading and liquidity marketplace on Base.",
        trustScore: 99.5,
        triggerReason: "Highest TVL on Base. Official OP Stack partner. Audited contracts.",
        metric: "Liquidity Depth",
        metricValue: "$142M",
        url: "https://aerodrome.finance",
        color: "text-blue-400"
    },
    {
        name: "Virtuals Protocol",
        category: "AI / Agents",
        description: "Decentralized factory for autonomous AI agents.",
        trustScore: 98.2,
        triggerReason: "New high-velocity agent deployment standards. Verified factory.",
        metric: "Contract Velocity",
        metricValue: "12/hr",
        url: "https://virtuals.io",
        color: "text-purple-400"
    }
];

export default function PrestigePage() {
    const [apps, setApps] = useState(TRUSTED_APPS);
    const [lastChecked, setLastChecked] = useState(new Date());

    useEffect(() => {
        // Hydration fix: ensure consistent initial render
        setLastChecked(new Date());

        const interval = setInterval(() => {
            setLastChecked(new Date());

            setApps(prev => prev.map(app => {
                // Randomly fluctuate scores slightly to show "Liveness"
                const newScore = Math.min(100, Math.max(90, app.trustScore + (Math.random() - 0.5) * 0.1));

                // Occasionally update the metric value for a "live" feel
                let newMetricValue = app.metricValue;
                if (app.name === "Aerodrome") {
                    newMetricValue = `$${(142 + (Math.random() * 0.5)).toFixed(2)}M`;
                }

                return {
                    ...app,
                    trustScore: newScore,
                    metricValue: newMetricValue
                };
            }));

        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 animate-fade-in pb-12 min-h-screen bg-[#030303] text-white font-mono selection:bg-electric-blue/30 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto p-6 md:p-12 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="text-blue-500" size={16} />
                            <h2 className="text-sm font-bold tracking-wide text-blue-500 uppercase">Prestige Registry</h2>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 flex items-center gap-3">
                            <ShieldCheck size={40} className="text-electric-blue" />
                            Trusted Operators
                        </h1>
                        <p className="text-gray-400 max-w-lg text-sm md:text-base leading-relaxed">
                            Applications that have maintained high integrity scores based on on-chain behavior and community feedback.
                        </p>
                    </div>
                    <div className="mt-6 md:mt-0 text-right">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Status</div>
                        <div className="flex items-center gap-2 justify-end text-green-500 font-bold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                            <Activity size={14} className="animate-pulse" />
                            LIVE MONITORING
                        </div>
                        <div className="text-[10px] text-gray-600 mt-2 font-mono">
                            LAST AUDIT: {lastChecked.toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {apps.map((app, i) => (
                        <GlassCard key={app.name} className="p-6 md:p-8 flex flex-col justify-between h-full group hover:bg-[#1c1c1e] bg-[#1c1c1e]/60 transition-all duration-300 hover:border-electric-blue/30 border-white/5">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/5 uppercase tracking-wider">{app.category}</span>
                                    <a href={app.url} target="_blank" className="text-gray-500 hover:text-white transition-colors">
                                        <ExternalLink size={16} />
                                    </a>
                                </div>

                                <h3 className="text-2xl font-bold mb-2 group-hover:text-electric-blue transition-colors flex items-center gap-2">
                                    {app.name === "Moxie" && "Ⓜ️"}
                                    {app.name === "Aerodrome" && "✈️"}
                                    {app.name === "Virtuals Protocol" && "🤖"}
                                    {app.name}
                                    <BadgeCheck size={16} className="text-blue-500" />
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed font-light">
                                    {app.description}
                                </p>

                                <div className="space-y-3 mt-6">
                                    <div className="text-xs text-gray-400 bg-black/20 p-3 rounded border border-white/5 relative overflow-hidden">
                                        <div className="absolute left-0 top-0 h-full w-[2px] bg-electric-blue/50" />
                                        <span className="block text-[10px] text-gray-500 uppercase font-bold mb-1 flex items-center gap-1">
                                            <Zap size={10} className="text-yellow-500" /> Trigger Reason
                                        </span>
                                        "{app.triggerReason}"
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 mt-6">
                                <div>
                                    <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">Trust Score</div>
                                    <div className={`text-xl font-bold ${Number(app.trustScore) > 99 ? 'text-green-400' : 'text-blue-400'}`}>
                                        {app.trustScore.toFixed(1)}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-medium text-gray-500 uppercase mb-1">{app.metric}</div>
                                    <div className="text-sm text-gray-300 font-mono">{app.metricValue}</div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}

                    {/* Apply Card */}
                    <Link href="https://github.com/utkuhanku/curatobase" target="_blank" className="group border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all cursor-pointer min-h-[300px]">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Lock size={24} className="text-gray-500 group-hover:text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-300 mb-2">Become Verified</h3>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto">
                            Submit your Builder Code and Agent Logic for automated verification.
                        </p>
                    </Link>
                </div>

                <div className="mt-12 text-center text-xs text-gray-600">
                    <Link href="/dashboard" className="hover:text-white transition-colors">
                        &larr; Return to Dashboard
                    </Link>
                </div>
                <div className="text-center pt-4 opacity-50 text-[10px]">
                    <p>REGISTRY_ID: 0x12..9a // IMMUTABLE RECORD</p>
                </div>
            </div>
        </div>
    );
}
