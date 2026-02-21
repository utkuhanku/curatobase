"use client";

import { useState, useEffect } from "react";
import { Zap, Activity, ShieldCheck, ArrowUpRight } from "lucide-react";

type SignalData = {
    title: string;
    subtitle: string;
    confidence: string;
    sentiment: string;
    authorStats: string;
    signalUrl: string;
    reason: string;
    category: string;
};

export function SignalHero() {
    const [signal, setSignal] = useState<SignalData | null>(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        fetch('/api/ui/dashboard')
            .then(res => res.json())
            .then(data => {
                setSignal(data);
                setTimeout(() => setAnimate(true), 100);
            })
            .catch(err => console.error("Failed to load dashboard signal", err));
    }, []);

    if (!signal) {
        return (
            <div className="h-[400px] w-full bg-[#030303] rounded-2xl border border-white/[0.03] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 opacity-30">
                    <Zap size={24} className="animate-pulse text-[#1652F0]" />
                    <div className="text-[10px] font-mono tracking-widest text-[#1652F0]">AWAITING INTERCEPT...</div>
                </div>
            </div>
        );
    }

    return (
        <section className={`relative group transition-all duration-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#1652F0]/20 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition duration-1000 pointer-events-none"></div>
            <div className="relative bg-[#030303]/80 backdrop-blur-xl rounded-2xl border border-white/[0.05] overflow-hidden flex flex-col md:flex-row min-h-[400px]">

                {/* LEFT: SIGNAL DATA */}
                <div className="flex-1 p-8 md:p-12 space-y-6 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1652F0]/10 text-[#1652F0] text-[10px] tracking-widest font-bold uppercase border border-[#1652F0]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1652F0] animate-pulse"></span>
                            Live Intelligence
                        </div>
                        <div className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">
                            CONFIDENCE: <span className="text-white font-bold">{signal.confidence}</span>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-4 leading-tight text-balance">
                            {signal.title}
                        </h2>
                        <p className="text-lg text-gray-400 font-light leading-relaxed border-l-2 border-[#1652F0]/50 pl-4 py-1">
                            {signal.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 border-t border-white/[0.05] pt-6">
                        <div>
                            <span className="block text-[10px] uppercase text-gray-600 mb-1.5 font-bold tracking-widest">Sentiment Analysis</span>
                            <span className="text-white flex items-center gap-2 font-mono">
                                <Activity size={14} className="text-[#00FF7A]" />
                                {signal.sentiment}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase text-gray-600 mb-1.5 font-bold tracking-widest">Author Reputation</span>
                            <span className="text-white flex items-center gap-2 font-mono">
                                <ShieldCheck size={14} className="text-[#1652F0]" />
                                {signal.authorStats}
                            </span>
                        </div>
                    </div>

                    <div className="pt-6 mt-auto">
                        <a
                            href={signal.signalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase transition-all"
                        >
                            Access Raw Signal <ArrowUpRight size={14} />
                        </a>
                    </div>
                </div>

                {/* RIGHT: AGENT LOGIC / WHY */}
                <div className="w-full md:w-96 bg-gradient-to-b from-white/[0.02] to-transparent border-l border-white/[0.05] p-8 md:p-12 flex flex-col justify-center space-y-8">
                    <div>
                        <h3 className="text-[10px] font-bold text-[#1652F0] uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Zap size={10} /> Curator Logic
                        </h3>
                        <div className="h-px w-8 bg-[#1652F0]/30" />
                    </div>

                    <ul className="space-y-6 text-sm text-gray-300 font-light leading-relaxed">
                        <li className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-[#00FF7A]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#00FF7A]/20">
                                <div className="w-1.5 h-1.5 bg-[#00FF7A] rounded-full" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Primary Driver</span>
                                <span>{signal.reason}</span>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-[#1652F0]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#1652F0]/20">
                                <div className="w-1.5 h-1.5 bg-[#1652F0] rounded-full" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">Classification</span>
                                <span>{signal.category} module triggered.</span>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </section>
    );
}
