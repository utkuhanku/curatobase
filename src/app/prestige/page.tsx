import { CyberCard } from "@/components/ui/CyberCard";
import { BadgeCheck, ShieldCheck, Star } from "lucide-react";

export default function PrestigePage() {
    return (
        <div className="space-y-8 font-mono">
            {/* Header Section */}
            <div className="border-b border-white/10 pb-6 mb-8">
                <h2 className="text-2xl font-bold tracking-widest text-amber-400 flex items-center gap-3">
                    <Star className="fill-amber-400 text-amber-400" size={24} />
                    HALL_OF_FAME
                </h2>
                <p className="opacity-70 text-sm mt-2 max-w-xl">
                    The Prestige Registry tracks applications that have maintained a &gt;99% trust score over 30+ days.
                    These operators have proven consistent reward distribution and uptime.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { name: "Moxie", tier: "DIAMOND", score: "99.9%", since: "Jan 2024", desc: "Consistently high reward distribution and verified on-chain proofs." },
                    { name: "Aerodrome", tier: "PLATINUM", score: "99.5%", since: "Feb 2024", desc: "Top-tier liquidity layer with automated reward verification." },
                    { name: "Zora", tier: "PLATINUM", score: "99.2%", since: "Feb 2024", desc: "Leading creative protocol with verifiable artist payouts." },
                ].map((app, i) => (
                    <CyberCard key={i} variant={app.tier === "DIAMOND" ? "alert" : "default"} className="relative group">
                        <div className="absolute top-4 right-4 text-amber-500/20 group-hover:text-amber-500 transition-colors">
                            <ShieldCheck size={32} />
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div>
                                <div className="text-[10px] text-amber-500 uppercase tracking-widest mb-1 border border-amber-500/20 inline-block px-2 py-0.5 rounded bg-amber-500/5">
                                    {app.tier}_TIER
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">{app.name}</h3>
                            </div>

                            <p className="text-xs text-gray-400 leading-relaxed h-10">
                                {app.desc}
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div>
                                    <div className="text-[10px] text-gray-600 uppercase">Trust Score</div>
                                    <div className="text-xl font-bold text-green-400">{app.score}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-600 uppercase">Tracked Since</div>
                                    <div className="text-sm font-bold text-gray-300 mt-1">{app.since}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold bg-green-500/5 p-2 rounded justify-center border border-green-500/10">
                                <BadgeCheck size={12} /> VERIFIED_OPERATOR
                            </div>
                        </div>
                    </CyberCard>
                ))}

                {/* Empty Slot Placeholder */}
                <div className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-30 min-h-[200px]">
                    <div className="w-12 h-12 rounded-full bg-white/5 mb-4" />
                    <p className="text-xs font-mono uppercase tracking-widest">Slot Available</p>
                    <p className="text-[10px] mt-2">Maintain 99% score to qualify</p>
                </div>
            </div>

            <div className="text-center pt-12 opacity-50 text-[10px]">
                <p>REGISTRY_ID: 0x12..9a // IMMUTABLE RECORD</p>
            </div>
        </div>
    );
}
