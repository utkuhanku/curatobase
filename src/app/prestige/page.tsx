import { ShieldCheck, BadgeCheck, Activity } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function PrestigePage() {
    return (
        <div className="space-y-8 animate-fade-in pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="text-blue-500" size={16} />
                        <h2 className="text-sm font-bold tracking-wide text-blue-500 uppercase">Prestige Registry</h2>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Trusted Operators</h1>
                    <p className="text-gray-400 mt-2 max-w-xl leading-relaxed">
                        Applications that have maintained a &gt;99% trust score over 30+ days.
                        Validated for consistent reward distribution and uptime.
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400">
                        {3} Verified
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. MOXIE */}
                <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-full group hover:bg-[#1c1c1e] bg-[#1c1c1e]/60">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl font-bold">
                                Ⓜ️
                            </div>
                            <div className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 flex items-center gap-1.5">
                                <BadgeCheck size={12} /> VERIFIED
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Moxie</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Consistently high reward distribution and verified on-chain proofs.
                            Top-tier reputation in the Farcaster ecosystem.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                        <div>
                            <div className="text-[10px] font-medium text-gray-500 uppercase">Trust Score</div>
                            <div className="text-xl font-bold text-white">99.9%</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-medium text-gray-500 uppercase">Since</div>
                            <div className="text-xl font-bold text-white">Jan 2024</div>
                        </div>
                    </div>
                </GlassCard>

                {/* 2. AERODROME */}
                <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-full group hover:bg-[#1c1c1e] bg-[#1c1c1e]/60">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl font-bold text-blue-500">
                                ✈️
                            </div>
                            <div className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 flex items-center gap-1.5">
                                <BadgeCheck size={12} /> VERIFIED
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Aerodrome</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Top-tier liquidity layer with automated reward verification.
                            Central trading hub for Base.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                        <div>
                            <div className="text-[10px] font-medium text-gray-500 uppercase">Trust Score</div>
                            <div className="text-xl font-bold text-white">99.5%</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-medium text-gray-500 uppercase">Since</div>
                            <div className="text-xl font-bold text-white">Feb 2024</div>
                        </div>
                    </div>
                </GlassCard>

                {/* 3. VIRTUALS */}
                <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-full group hover:bg-[#1c1c1e] bg-[#1c1c1e]/60">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-2xl font-bold text-purple-500">
                                🤖
                            </div>
                            <div className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20 flex items-center gap-1.5">
                                <BadgeCheck size={12} /> EMERGING
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Virtuals</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Leading AI agent launchpad. High volume of verifiable contract deployments.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                        <div>
                            <div className="text-[10px] font-medium text-gray-500 uppercase">Trust Score</div>
                            <div className="text-xl font-bold text-white">96.2%</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-medium text-gray-500 uppercase">Since</div>
                            <div className="text-xl font-bold text-white">Nov 2024</div>
                        </div>
                    </div>
                </GlassCard>

                {/* EMPTY SLOT / APPLY */}
                <GlassCard className="p-6 md:p-8 flex flex-col items-center justify-center h-full border-dashed !bg-transparent opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                    <ShieldCheck className="text-gray-600 mb-4" size={48} strokeWidth={1} />
                    <h3 className="text-lg font-bold text-gray-500">Apply for Verification</h3>
                    <p className="text-sm text-gray-600 mt-2 text-center max-w-[200px]">
                        Maintain 90+ score for 30 days to unlock Prestige status.
                    </p>
                </GlassCard>
            </div>
            <div className="text-center pt-12 opacity-50 text-[10px]">
                <p>REGISTRY_ID: 0x12..9a // IMMUTABLE RECORD</p>
            </div>
        </div>
    );
}
