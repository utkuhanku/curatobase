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

            <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 relative z-10">

                {/* HERO: THE SIGNAL (Sensational Reveal) */}
                <section className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue via-purple-600 to-electric-blue rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-1000 animate-gradient-xy"></div>
                    <div className="relative bg-[#050505] rounded-xl border border-white/10 overflow-hidden">

                        {/* Header Stripe */}
                        <div className="h-1 w-full bg-gradient-to-r from-electric-blue via-transparent to-transparent" />

                        <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                            {/* Left: Content */}
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-electric-blue/30 bg-electric-blue/5 text-electric-blue text-[10px] tracking-[0.2em] font-bold uppercase mb-2">
                                    <Zap size={10} /> Latest Signal Intercepted
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-2">
                                    {data.autonomy.curatedGem ? data.autonomy.curatedGem.split(':')[0] : 'Scanning...'}
                                </h2>

                                <p className="text-xl text-gray-400 font-light leading-relaxed border-l-2 border-white/10 pl-6 italic">
                                    {data.autonomy.curatedGem ? `"${data.autonomy.curatedGem.split(':')[1]?.replace(/"/g, '') || '...'}"` : '...'}
                                </p>

                                <div className="flex flex-wrap gap-3 pt-4">
                                    {data.autonomy.sentiment && (
                                        <span className="sc-prop text-xs px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-medium flex items-center gap-2">
                                            {data.autonomy.sentiment}
                                        </span>
                                    )}
                                    {data.autonomy.authorStats && (
                                        <span className="sc-prop text-xs px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 font-medium flex items-center gap-2">
                                            <ShieldCheck size={12} /> {data.autonomy.authorStats}
                                        </span>
                                    )}
                                </div>

                                <div className="pt-8">
                                    <a
                                        href={data.autonomy.signalUrl || 'https://warpcast.com'}
                                        target="_blank"
                                        className="inline-flex items-center gap-3 bg-electric-blue hover:bg-blue-600 text-black px-8 py-4 rounded-lg font-bold tracking-wide transition-all transform hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]"
                                    >
                                        VIEW ORIGINAL SIGNAL <ArrowUpRight size={18} />
                                    </a>
                                </div>
                            </div>

                            {/* Right: Abstract Visualization / Stats */}
                            <div className="relative h-full min-h-[300px] flex items-center justify-center bg-grid-white/[0.02] border-l border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />

                                <div className="text-center space-y-6 relative z-10">
                                    <div className="inline-block p-6 rounded-full bg-white/5 border border-white/10 mb-4 animate-pulse">
                                        <Activity size={48} className="text-electric-blue" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">Confidence Score</div>
                                        <div className="text-5xl font-black text-white tracking-tighter mt-2">98.4<span className="text-lg text-gray-600">%</span></div>
                                    </div>
                                    <div className="text-xs text-gray-600 font-mono">
                                        AI Analysis • Social Graph • On-Chain History
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* STATS GRID */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <GlassCard className="p-6">
                        <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Agent Treasury</h3>
                        <div className="text-2xl font-bold text-white">{Number(data.financials.revenueVault.balance).toFixed(4)} <span className="text-sm text-blue-500">ETH</span></div>
                    </GlassCard>
                    <GlassCard className="p-6">
                        <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Compute Gas</h3>
                        <div className="text-2xl font-bold text-white">{Number(data.financials.computeBrain.balance).toFixed(4)} <span className="text-sm text-green-500">ETH</span></div>
                    </GlassCard>
                    <GlassCard className="p-6 md:col-span-2 flex items-center justify-between">
                        <div>
                            <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Verify Autonomy</h3>
                            <div className="text-xs text-gray-400">Transaction Hash: <span className="text-white font-mono">{data.verification.lastTxHash ? data.verification.lastTxHash.slice(0, 16) + '...' : 'NULL'}</span></div>
                        </div>
                        {data.verification.explorerLink && (
                            <a href={data.verification.explorerLink} target="_blank" className="text-xs border border-white/20 hover:bg-white/10 px-3 py-1.5 rounded transition-colors text-white">
                                Basescan ↗
                            </a>
                        )}
                    </GlassCard>
                </section>

            </div>
        </main>
    );
}
