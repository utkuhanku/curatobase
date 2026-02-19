"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink, Zap, Lock, ShieldCheck, BadgeCheck, Activity, Trophy, Gift } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const SYSTEM_STATS = [
    { label: "Total Value Secured", value: "$4.2B", change: "+12%" },
    { label: "Active Agents", value: "1,240", change: "+85/day" },
    { label: "Rewards Distributed", value: "450 ETH", change: "Last 30d" },
];

const TRUSTED_APPS = [
    {
        name: "Aerodrome",
        category: "DeFi",
        description: "The central trading and liquidity marketplace on Base. The engine of the ecosystem.",
        trustScore: 99.8,
        triggerReason: "Dominant liquidity layer. $142M+ TVL. Audited by Spearbit.",
        metric: "Liquidity Depth",
        metricValue: "$580M",
        url: "https://aerodrome.finance",
        icon: "✈️"
    },
    {
        name: "BasePaint",
        category: "Art / Social",
        description: "Collaborative daily pixel art canvas. A community ritual on Base.",
        trustScore: 99.5,
        triggerReason: "400+ consecutive daily mints. 5,000+ unique artists.",
        metric: "Artists Paid",
        metricValue: "320 ETH",
        url: "https://basepaint.xyz",
        icon: "🎨"
    },
    {
        name: "Virtuals Protocol",
        category: "AI / Agents",
        description: "The infrastructure for co-owning and deploying autonomous AI agents.",
        trustScore: 98.9,
        triggerReason: "Verified Agent Factory contract. High-velocity deployments.",
        metric: "Agents Live",
        metricValue: "1,200+",
        url: "https://virtuals.io",
        icon: "🤖"
    },
    {
        name: "Zora",
        category: "NFT / Creator",
        description: "The best place to mint and collect onchain media.",
        trustScore: 99.7,
        triggerReason: "Standard for NFT metadata. Millions of mints secured.",
        metric: "Mints (24h)",
        metricValue: "45,230",
        url: "https://zora.co",
        icon: "orb"
    },
    {
        name: "Blackbird",
        category: "Consumer / Loyalty",
        description: "Restaurant loyalty platform powered by Base.",
        trustScore: 98.5,
        triggerReason: "Real-world utility verified. 100+ NYC partner locations.",
        metric: "Check-ins",
        metricValue: "125k",
        url: "https://blackbird.xyz",
        icon: "🍽️"
    },
    {
        name: "Moonwell",
        category: "DeFi / Lending",
        description: "Simple, open lending and borrowing protocol.",
        trustScore: 99.1,
        triggerReason: "Top lending protocol. Risk management by Gauntlet.",
        metric: "Total Supplied",
        metricValue: "$340M",
        url: "https://moonwell.fi",
        icon: "🌑"
    },
    {
        name: "Farcaster",
        category: "Social",
        description: "Sufficiently decentralized social network.",
        trustScore: 99.9,
        triggerReason: "The social layer of Base. 500k+ active users.",
        metric: "DAU",
        metricValue: "65k",
        url: "https://warpcast.com",
        icon: "🦄"
    },
    {
        name: "Highlight",
        category: "Generative Art",
        description: "Tools for generative art on Ethereum and Base.",
        trustScore: 97.8,
        triggerReason: "Verified generative contracts. Zero tooling exploits.",
        metric: "Artworks",
        metricValue: "2.5M",
        url: "https://highlight.xyz",
        icon: "🖌️"
    },
    {
        name: "Paragraph",
        category: "Publishing",
        description: "Web3 newsletter and publishing platform.",
        trustScore: 98.2,
        triggerReason: "Reliable content distribution. On-chain subscription model.",
        metric: "Writers",
        metricValue: "15k",
        url: "https://paragraph.xyz",
        icon: "✍️"
    },
    {
        name: "Seamless",
        category: "DeFi",
        description: "Native lending and borrowing on Base.",
        trustScore: 96.5,
        triggerReason: "First native lending market. Integrated ecosystem rewards.",
        metric: "TVL",
        metricValue: "$85M",
        url: "https://seamlessprotocol.com",
        icon: "🧵"
    },
    {
        name: "Bountycaster",
        category: "Work / Earn",
        description: "Service to post and discover bounties on Farcaster.",
        trustScore: 97.0,
        triggerReason: "High fulfillment rate. Verified payouts on-chain.",
        metric: "Bounties Paid",
        metricValue: "$500k+",
        url: "https://bountycaster.xyz",
        icon: "💰"
    },
    {
        name: "Talent Protocol",
        category: "Identity",
        description: "Resume on-chain. Build your professional reputation.",
        trustScore: 95.5,
        triggerReason: "Standard for on-chain professional identity.",
        metric: "Passports",
        metricValue: "250k",
        url: "https://talentprotocol.com",
        icon: "🆔"
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
                    // Fluctuate TVL
                    const currentVal = parseFloat(app.metricValue.replace('$', '').replace('M', ''));
                    const newVal = currentVal + (Math.random() - 0.5) * 0.1;
                    newMetricValue = `$${newVal.toFixed(1)}M`;
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
        </div >
    );
}
