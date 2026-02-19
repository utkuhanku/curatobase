'use client';
import { GlassCard } from '@/components/ui/GlassCard';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Zap, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';
import { SignalHero } from "@/components/SignalHero";

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

        // LIVE SIMULATION EFFECT
        const interval = setInterval(() => {
            setData(prev => {
                if (!prev) return null;
                const newBlock = (prev.network.blockNumber || 24300000) + 1;
                const balanceChange = (Math.random() - 0.4) * 0.0001; // Tiny fluctuations

                return {
                    ...prev,
                    network: { ...prev.network, blockNumber: newBlock },
                    financials: {
                        ...prev.financials,
                        revenueVault: {
                            ...prev.financials.revenueVault,
                            balance: (Number(prev.financials.revenueVault.balance) + Math.max(0, balanceChange)).toString()
                        },
                        computeBrain: {
                            ...prev.financials.computeBrain,
                            balance: (Number(prev.financials.computeBrain.balance) - 0.00001).toString() // Slowly burning gas
                        }
                    }
                };
            });
        }, 2000); // New block every 2s

        return () => clearInterval(interval);
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

                {/* HERO: HIGH DENSITY SIGNAL CARD (Client Side Randomization) */}
                <SignalHero />

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
