"use client";

import { useState, useEffect } from "react";
import { Zap, Activity, ShieldCheck, ArrowUpRight } from "lucide-react";
import { HERO_SIGNALS } from "@/data/simulation";

export function SignalHero() {
    const [signal, setSignal] = useState(HERO_SIGNALS[0]);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Randomize on mount (client-side) to ensure freshness
        const random = HERO_SIGNALS[Math.floor(Math.random() * HERO_SIGNALS.length)];
        setSignal(random);
        setAnimate(true);
    }, []);

    return (
        <section className={`relative group transition-all duration-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-electric-blue to-purple-600 rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-1000"></div>
            <div className="relative bg-[#050505] rounded-xl border border-white/10 overflow-hidden flex flex-col md:flex-row">

                {/* LEFT: SIGNAL DATA */}
                <div className="flex-1 p-8 md:p-10 space-y-6">
                    <div className="flex justify-between items-start">
                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-electric-blue/10 text-electric-blue text-[10px] tracking-widest font-bold uppercase">
                            <Zap size={10} /> Live Intercept
                        </div>
                        <div className="text-gray-500 text-[10px] font-mono">
                            CONFIDENCE: <span className="text-white">{signal.confidence}</span>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2 leading-tight">
                            {signal.title}
                        </h2>
                        <p className="text-lg text-gray-400 font-light leading-relaxed border-l-2 border-electric-blue/50 pl-4 py-1">
                            {signal.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 border-t border-white/5 pt-4">
                        <div>
                            <span className="block text-[10px] uppercase text-gray-600 mb-1">Sentiment Analysis</span>
                            <span className="text-white flex items-center gap-2">
                                <Activity size={12} className="text-green-500" />
                                {signal.sentiment}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase text-gray-600 mb-1">Author Reputation</span>
                            <span className="text-white flex items-center gap-2">
                                <ShieldCheck size={12} className="text-blue-500" />
                                {signal.authorStats}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <a
                            href={signal.signalUrl}
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
                            <span><strong>Selection Reason:</strong> {signal.reason}</span>
                        </li>
                        <li className="flex gap-3">
                            <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            </div>
                            <span><strong>Category:</strong> {signal.category} match confirmed.</span>
                        </li>
                    </ul>
                </div>

            </div>
        </section>
    );
}
