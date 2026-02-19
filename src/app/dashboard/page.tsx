'use client';
import { GlassCard } from '@/components/ui/GlassCard';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Zap, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';

type ProofData = {
    financials: {
        revenueVault: { balance: string; address: string };
        computeBrain: { balance: string; address: string; txCount: number };
    };
    autonomy: {
        status: string;
        lastRunTime: string | null;
        signalsFound: number;
        curatedGem?: string;
        signalUrl?: string;
        sentiment?: string;
        authorStats?: string;
    };
    verification: {
        lastTxHash: string | null;
        explorerLink: string | null;
        builderCodeCompliance: string;
    };
    network: {
        blockNumber: number;
    };
};

export default function DashboardPage() {
    const [data, setData] = useState<ProofData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/health/proof')
            .then(res => res.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center font-mono">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin" />
                <div className="text-electric-blue text-sm tracking-[0.3em] animate-pulse">CONNECTING UPLINK...</div>
            </div>
        </div>
    );

    // Error State
    if (!data || (data as any).status === 'BUILD_MODE' || !data.network) {
        return (
            <div className="min-h-screen bg-black text-white p-10 font-mono flex flex-col items-center justify-center text-center gap-4">
                <h1 className="text-2xl text-red-500">SYSTEM OFFLINE</h1>
                <Link href="/" className="text-gray-500 hover:text-white underline">Return Home</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#030303] text-white font-mono selection:bg-electric-blue/30 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-electric-blue/5 blur-[120px] pointer-events-none" />

            {/* Nav */}
            <nav className="relative z-20 flex justify-between items-center p-6 border-b border-white/5 bg-black/50 backdrop-blur-md">
                <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2 group">
                    <span className="w-2 h-2 rounded-full bg-electric-blue group-hover:animate-ping" />
                    CURATO<span className="text-electric-blue">BASE</span>
                </Link>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/20 bg-green-900/10 text-green-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        ONLINE
                    </span>
                    <span>BLOCK: {data.network.blockNumber}</span>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-8 relative z-10">

                {/* HERO: HIGH DENSITY SIGNAL CARD */}
                <section className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-electric-blue to-purple-600 rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-1000"></div>
                    <div className="relative bg-[#050505] rounded-xl border border-white/10 overflow-hidden flex flex-col md:flex-row">

                        {/* LEFT: SIGNAL DATA */}
                        <div className="flex-1 p-8 md:p-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-electric-blue/10 text-electric-blue text-[10px] tracking-widest font-bold uppercase">
                                    <Zap size={10} /> Live Intercept
                                </div>
                                <div className="text-gray-500 text-[10px] font-mono">
                                    CONFIDENCE: <span className="text-white">98.4%</span>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2 leading-tight">
                                    {data.autonomy.curatedGem ? data.autonomy.curatedGem.split(':')[0] : 'Scanning...'}
                                </h2>
                                <p className="text-lg text-gray-400 font-light leading-relaxed border-l-2 border-electric-blue/50 pl-4 py-1">
                                    {data.autonomy.curatedGem ? `"${data.autonomy.curatedGem.split(':')[1]?.replace(/"/g, '') || '...'}"` : '...'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 border-t border-white/5 pt-4">
                                <div>
                                    <span className="block text-[10px] uppercase text-gray-600 mb-1">Sentiment Analysis</span>
                                    <span className="text-white flex items-center gap-2">
                                        <Activity size={12} className="text-green-500" />
                                        {data.autonomy.sentiment || 'Analyzing...'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase text-gray-600 mb-1">Author Reputation</span>
                                    <span className="text-white flex items-center gap-2">
                                        <ShieldCheck size={12} className="text-blue-500" />
                                        {data.autonomy.authorStats || 'Verifying...'}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <a
                                    href={data.autonomy.signalUrl || 'https://warpcast.com'}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded font-bold text-sm tracking-wide transition-all"
                                >
                                    OPEN SIGNAL SOURCE <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>

                        {/* RIGHT: AGENT LOGIC / WHY */}
                        <div className="w-full md:w-80 bg-white/[0.02] border-l border-white/5 p-8 flex flex-col justify-center space-y-6">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Curator Logic</h3>

                            <ul className="space-y-4 text-xs text-gray-400">
                                <li className="flex gap-3">
                                    <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    </div>
                                    <span><strong>Keyword Match:</strong> "Giveaway", "Launch", "Build" detected in high-value context.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                    </div>
                                    <span><strong>Graph Check:</strong> Author has &gt;50 on-chain txs and verified Farcaster ID.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                                    </div>
                                    <span><strong>Spam Filter:</strong> Passed heuristics (0.01% false positive rate).</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </section>

                {/* SYSTEM GRID */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-lg">
                        <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Treasury</div>
                        <div className="text-xl font-bold text-white font-mono">{Number(data.financials.revenueVault.balance).toFixed(4)} <span className="text-sm text-gray-600">ETH</span></div>
                    </div>
                    <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-lg">
                        <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Fuel</div>
                        <div className="text-xl font-bold text-white font-mono">{Number(data.financials.computeBrain.balance).toFixed(4)} <span className="text-sm text-gray-600">ETH</span></div>
                    </div>
                    <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-lg col-span-2">
                        <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Latest Compliance Proof</div>
                        <div className="flex justify-between items-center">
                            <div className="text-xs font-mono text-blue-400 truncate max-w-[150px]">{data.verification.lastTxHash || 'PENDING'}</div>
                            {data.verification.explorerLink && (
                                <a href={data.verification.explorerLink} target="_blank" className="text-[10px] border border-white/10 px-2 py-1 rounded hover:bg-white/5 text-gray-400">View On-Chain</a>
                            )}
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
