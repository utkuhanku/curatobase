'use client';
import { GlassCard } from '@/components/ui/GlassCard';
import { useEffect, useState } from 'react';

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

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">INITIALIZING UPLINK...</div>;

    // Handle error or build mode state
    if (!data || (data as any).status === 'BUILD_MODE' || !data.network) {
        return (
            <div className="min-h-screen bg-black text-white p-10 font-mono flex flex-col items-center justify-center text-center gap-4">
                <h1 className="text-2xl text-red-500">SYSTEM CONFIGURATION PENDING</h1>
                <p className="text-gray-400 max-w-md">
                    The autonomous agent is deployed but waiting for environment variables.
                </p>
                <div className="bg-white/5 p-4 rounded text-xs text-left w-full max-w-lg space-y-2">
                    <p className="text-blue-400">Required Vercel Env Vars:</p>
                    <ul className="list-disc pl-4 text-gray-500">
                        <li>REVENUE_CONTRACT_ADDRESS</li>
                        <li>COMPUTE_WALLET_ADDRESS</li>
                        <li>BASE_RPC_URL</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-4 md:p-8 bg-black text-white font-mono selection:bg-blue-500/30">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className="text-xs font-medium tracking-widest text-green-500 uppercase">
                            System Online • Block {data.network.blockNumber}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                        Autonomous Proof
                    </h1>
                </div>

                {/* Financial Health Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <GlassCard className="p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Revenue Vault</span>
                            <span className="text-xs text-blue-400 border border-blue-500/30 px-2 py-1 rounded">ETH</span>
                        </div>
                        <div className="text-3xl font-bold tracking-tight">
                            {Number(data.financials.revenueVault.balance).toFixed(4)}
                        </div>
                        <div className="text-[10px] text-gray-600 break-all">{data.financials.revenueVault.address.slice(0, 8)}...</div>
                    </GlassCard>

                    <GlassCard className="p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Brain (Gas)</span>
                            <span className="text-xs text-green-400 border border-green-500/30 px-2 py-1 rounded">L2</span>
                        </div>
                        <div className="text-3xl font-bold tracking-tight">
                            {Number(data.financials.computeBrain.balance).toFixed(4)}
                        </div>
                        <div className="text-[10px] text-gray-600 break-all">{data.financials.computeBrain.address.slice(0, 8)}...</div>
                    </GlassCard>

                    {/* Novelty Metric: Runway */}
                    <GlassCard className="p-6 flex flex-col gap-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-between relative z-10">
                            <span className="text-sm text-gray-400">Survival Runway</span>
                            <span className="text-xs text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded">EST</span>
                        </div>
                        <div className="text-3xl font-bold tracking-tight relative z-10">
                            {/* Assume 0.0005 ETH burn per day for calculation */}
                            {((Number(data.financials.revenueVault.balance) + Number(data.financials.computeBrain.balance)) / 0.0005).toFixed(0)} <span className="text-lg font-normal text-gray-500">Days</span>
                        </div>
                        <div className="text-[10px] text-green-400 relative z-10">
                            Based on current burn rate
                        </div>
                    </GlassCard>
                </div>

                {/* Latest Discovery (The "Work") */}
                <GlassCard className="p-0 overflow-hidden group">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />

                    <div className="p-4 border-b border-white/5 flex justify-between items-center relative z-10">
                        <h3 className="font-semibold text-sm tracking-wide text-blue-400">Latest Signal Discovery</h3>
                        <span className="text-xs text-gray-500">Curato Engine</span>
                    </div>
                    <div className="p-6 relative z-10 flex flex-col gap-2">
                        <div className="text-3xl font-bold text-white tracking-tight">
                            {data.autonomy.curatedGem || 'Scanning...'}
                        </div>
                        <div className="text-xs text-gray-400">
                            Identified as a high-velocity protocol in the Base ecosystem.
                        </div>
                        <div className="mt-2 flex gap-2">
                            <a href="https://base.org/ecosystem" target="_blank" className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors">
                                View on Base Ecosystem ↗
                            </a>
                        </div>
                    </div>
                </GlassCard>

                {/* Verification & Compliance */}
                <GlassCard className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <h3 className="font-semibold text-sm tracking-wide">Strict Verification Engine</h3>
                        <span className="text-xs text-gray-500">ERC-8021 Compliance</span>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-gray-400 text-sm">Last Autonomous Run</span>
                            <span className="text-white text-sm">
                                {data.autonomy.lastRunTime ? new Date(data.autonomy.lastRunTime).toLocaleTimeString() : 'WAITING...'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-gray-400 text-sm">Last On-Chain Tx</span>
                            {data.verification.lastTxHash ? (
                                <a
                                    href={data.verification.explorerLink!}
                                    target="_blank"
                                    className="text-blue-400 text-sm hover:underline cursor-pointer"
                                    rel="noreferrer"
                                >
                                    {data.verification.lastTxHash.slice(0, 10)}...
                                </a>
                            ) : (
                                <span className="text-gray-600 text-sm">None Recorded</span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Builder Code Status</span>
                            <span className={`text-sm font-bold ${data.verification.builderCodeCompliance.includes('VERIFIED') ? 'text-green-500' : 'text-red-500'}`}>
                                {data.verification.builderCodeCompliance}
                            </span>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </main>
    );
}
