import { Activity, ShieldCheck, Zap, Database, Search, Filter, Smartphone, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AboutPage() {
    return (
        <div className="space-y-12 animate-fade-in pb-12">

            {/* Header */}
            <div className="border-b border-white/5 pb-8 text-center max-w-2xl mx-auto">
                <div className="flex bg-white/5 border border-white/10 rounded-full px-3 py-1 w-fit mx-auto mb-6">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        System Architecture v2.0
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                    Autonomous Curation Protocol
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed text-balance">
                    CuratoBase operates as a read-only editorial agent. It scans, verifies, and promotes builders based on on-chain proofs, not payment.
                </p>
            </div>

            {/* Pipeline Visualization */}
            <div className="relative max-w-4xl mx-auto">
                {/* Central Line */}
                <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent" />

                <div className="space-y-12">

                    {/* Step 1: Ingestion */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="hidden md:block text-right">
                            <h3 className="text-xl font-bold text-white mb-2">Signal Ingestion</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                The agent monitors the Base Farcaster channel and real-time transaction logs for `base.app` links and contract deployments.
                            </p>
                        </div>

                        <div className="relative flex items-center justify-center md:order-none order-first">
                            <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10 flex items-center justify-center text-blue-500">
                                <Search size={18} />
                            </div>
                        </div>

                        <div className="md:hidden pl-12">
                            <h3 className="text-xl font-bold text-white mb-2">Signal Ingestion</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                The agent monitors the Base Farcaster channel and real-time transaction logs.
                            </p>
                        </div>

                        <GlassCard className="p-4 bg-[#0a0a0a]/80">
                            <div className="font-mono text-[10px] text-gray-500 space-y-1">
                                <div className="flex gap-2"><span className="text-blue-500">GET</span> /feeds/base-channel <span className="text-green-500">200 OK</span></div>
                                <div className="flex gap-2"><span className="text-blue-500">SCAN</span> 0x82...9a12 <span className="text-amber-500">PENDING</span></div>
                                <div className="flex gap-2"><span className="text-blue-500">EXTRACT</span> regex:base.app/* <span className="text-gray-600">match: 142</span></div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Step 2: Verification */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <GlassCard className="p-6 bg-[#0a0a0a]/80 md:order-1 order-3">
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <CheckCircle2 size={16} className="text-green-500" /> On-chain Contract Verified
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <CheckCircle2 size={16} className="text-green-500" /> Reputation Score &gt; 50
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <CheckCircle2 size={16} className="text-green-500" /> No Spam Heuristics
                                </li>
                            </ul>
                        </GlassCard>

                        <div className="relative flex items-center justify-center md:order-2 order-first">
                            <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10 flex items-center justify-center text-purple-500">
                                <ShieldCheck size={18} />
                            </div>
                        </div>

                        <div className="md:text-left pl-12 md:pl-0 md:order-3">
                            <h3 className="text-xl font-bold text-white mb-2">Proof Verification</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Candidates must pass a rigorous quality gate. We verify builder identity, contract audit status, and community engagement.
                            </p>
                        </div>
                    </div>

                    {/* Step 3: Promotion */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="md:text-right hidden md:block">
                            <h3 className="text-xl font-bold text-white mb-2">Automated Promotion</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                High-confidence signals are broadcast to the dashboard and Farcaster network.
                            </p>
                        </div>

                        <div className="relative flex items-center justify-center md:order-none order-first">
                            <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] z-10 flex items-center justify-center text-yellow-500">
                                <Zap size={18} />
                            </div>
                        </div>

                        <div className="md:hidden pl-12">
                            <h3 className="text-xl font-bold text-white mb-2">Automated Promotion</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                High-confidence signals are broadcast to the dashboard and Farcaster network.
                            </p>
                        </div>

                        <GlassCard className="p-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white">
                                    <Smartphone size={16} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white">New Signal Detected</div>
                                    <div className="text-[10px] text-blue-200">Just now • @curator</div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                📦 <b>SuperDapp</b> detected.<br />
                                ✅ <b>Proof:</b> Contract 0x8a... verified.<br />
                                🔗 <b>Audit:</b> curatobase.com/audit/123
                            </p>
                        </GlassCard>
                    </div>

                </div>
            </div>

            <div className="mt-24 pt-8 border-t border-white/5 text-center">
                <p className="text-xs text-gray-600 mb-2">MAINTAINED BY PROTOTYPE_AGENT_01</p>
                <div className="flex justify-center gap-4 text-xs text-gray-500">
                    <span>GitHub</span>
                    <span>Docs</span>
                    <span>Status</span>
                </div>
            </div>
        </div>
    );
}
