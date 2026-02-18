import { GlassCard } from '@/components/ui/GlassCard';
import { createPublicClient, http, formatEther } from 'viem';
import { base } from 'viem/chains';

const REVENUE_CONTRACT = process.env.REVENUE_CONTRACT_ADDRESS as `0x${string}`;
const COMPUTE_WALLET = process.env.COMPUTE_WALLET_ADDRESS as `0x${string}`;

async function getFinancialData() {
    const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL) });

    // safe fallback
    if (!REVENUE_CONTRACT || !COMPUTE_WALLET) return null;

    const [revenueBal, computeBal] = await Promise.all([
        client.getBalance({ address: REVENUE_CONTRACT }),
        client.getBalance({ address: COMPUTE_WALLET })
    ]);

    return {
        revenue: formatEther(revenueBal),
        compute: formatEther(computeBal),
        contract: REVENUE_CONTRACT,
        wallet: COMPUTE_WALLET
    };
}

export default async function DashboardPage() {
    const finance = await getFinancialData();

    return (
        <main className="min-h-screen p-4 md:p-8 bg-black text-white selection:bg-blue-500/30">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className="text-xs font-medium tracking-widest text-green-500 uppercase">System Online</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                        Autonomous Agent Status
                    </h1>
                </div>

                {/* Financial Health Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassCard className="p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Revenue Vault</span>
                            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </span>
                        </div>
                        <div className="text-3xl font-mono font-bold tracking-tight">
                            {finance ? Number(finance.revenue).toFixed(4) : "0.0000"} <span className="text-lg text-gray-500">ETH</span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono break-all">{finance?.contract}</div>
                    </GlassCard>

                    <GlassCard className="p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Compute Gas</span>
                            <span className={`p-2 rounded-lg ${Number(finance?.compute) < 0.002 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </span>
                        </div>
                        <div className="text-3xl font-mono font-bold tracking-tight">
                            {finance ? Number(finance.compute).toFixed(4) : "0.0000"} <span className="text-lg text-gray-500">ETH</span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono break-all">{finance?.wallet}</div>
                    </GlassCard>
                </div>

                {/* Agent Activity Log (Mock for MVP) */}
                <GlassCard className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-white/5">
                        <h3 className="font-semibold text-sm tracking-wide">Autonomous Log</h3>
                    </div>
                    <div className="divide-y divide-white/5 font-mono text-sm max-h-[300px] overflow-y-auto">
                        <div className="p-4 flex gap-4 hover:bg-white/5 transition-colors">
                            <span className="text-gray-500">{new Date().toLocaleTimeString()}</span>
                            <span className="text-blue-400">[MONITOR]</span>
                            <span className="text-gray-300">Scanning Base Mainnet for signals...</span>
                        </div>
                        <div className="p-4 flex gap-4 hover:bg-white/5 transition-colors">
                            <span className="text-gray-500">{new Date(Date.now() - 3600000).toLocaleTimeString()}</span>
                            <span className="text-green-400">[SYSTEM]</span>
                            <span className="text-gray-300">Cycle complete. Gas levels healthy.</span>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </main>
    );
}
