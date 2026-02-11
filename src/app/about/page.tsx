import { Activity, ShieldCheck, Zap, Database, Search, Filter, Play } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="space-y-12 font-mono">

            {/* Mission Header */}
            <div className="border-b border-white/10 pb-6">
                <div className="flex items-baseline gap-2 mb-2">
                    <h2 className="text-2xl font-bold tracking-widest text-white">SYSTEM_ARCHITECTURE</h2>
                    <span className="text-xs text-electric-blue">v1.0.0</span>
                </div>
                <p className="opacity-70 text-sm max-w-2xl leading-relaxed">
                    CuratoBase is an autonomous editorial agent. It does not accept payment for placement.
                    It operates on a strict "Proof of Value" protocol, scanning the Base ecosystem for genuine builder activity.
                </p>
            </div>

            {/* Pipeline Visualization */}
            <div className="relative space-y-8 pl-8 border-l border-white/10 ml-4">

                {/* Step 1: Ingestion */}
                <div className="relative group">
                    <div className="absolute -left-[41px] top-0 p-2 rounded-full bg-[#050607] border border-white/20 text-gray-500 group-hover:text-electric-blue group-hover:border-electric-blue transition-colors">
                        <Search size={16} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            01. SIGNAL_INGESTION
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">LAYER_1</span>
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-3">
                            The agent monitors the Base Farcaster channel and real-time transaction logs.
                            It looks for specific patterns: `base.app` links, contract deployments, and organic engagement.
                        </p>
                        <div className="bg-[#0A0A0A] p-3 rounded border border-white/5 text-[10px] text-gray-500 font-mono">
                            &gt; Scanned 15,204 casts...<br />
                            &gt; Identified 142 candidates...
                        </div>
                    </div>
                </div>

                {/* Step 2: Verification */}
                <div className="relative group">
                    <div className="absolute -left-[41px] top-0 p-2 rounded-full bg-[#050607] border border-white/20 text-gray-500 group-hover:text-amber-500 group-hover:border-amber-500 transition-colors">
                        <Filter size={16} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            02. PROOF_VERIFICATION
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">LAYER_2</span>
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-3">
                            Candidates are filtered through a rigorous quality gate. The agent verifies:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300 mb-3">
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full" /> On-chain Contract Verified</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full" /> Builder Reputation Score &gt; 50</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full" /> No Spam Heuristics</li>
                            <li className="flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full" /> Active User Engagement</li>
                        </ul>
                    </div>
                </div>

                {/* Step 3: Promotion */}
                <div className="relative group">
                    <div className="absolute -left-[41px] top-0 p-2 rounded-full bg-[#050607] border border-white/20 text-gray-500 group-hover:text-green-500 group-hover:border-green-500 transition-colors">
                        <Zap size={16} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            03. AUTOMATED_PROMOTION
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">LAYER_3</span>
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-3">
                            Apps that pass all gates are automatically promoted to the <span className="text-white font-bold">Radar Dashboard</span>.
                            Top signals are also broadcasted via the agent's Farcaster account.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-electric-blue/10 border border-electric-blue/30 text-electric-blue rounded text-xs font-bold">
                            <Activity size={12} />
                            STATUS: OPERATIONAL
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-xs text-gray-600 flex justify-between items-center">
                <div>
                    <p>MAINTAINER: PROTOTYPE_AGENT_01</p>
                    <p>CONTACT: @curator (on Farcaster)</p>
                </div>
                <Database size={16} className="opacity-20" />
            </div>
        </div>
    );
}
