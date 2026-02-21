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
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#1652F0]/20 to-purple-500/10 rounded-[40px] opacity-0 group-hover:opacity-100 blur-2xl transition duration-1000 pointer-events-none"></div>
            <div className="relative bg-[#030303]/90 backdrop-blur-2xl rounded-[40px] border border-white/[0.03] overflow-hidden min-h-[500px] flex flex-col justify-center items-center text-center p-8 md:p-24 shadow-2xl">

                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#1652F0]/5 text-[#1652F0] text-[10px] tracking-[0.3em] font-bold uppercase border border-[#1652F0]/10 mb-12">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1652F0] animate-pulse shadow-[0_0_10px_#1652F0]"></span>
                    Live Intercept
                </div>

                <div className="max-w-4xl space-y-8">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-500 leading-[0.9] text-balance">
                        {signal.title}
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed text-balance mx-auto max-w-2xl">
                        {signal.subtitle}
                    </p>
                </div>

                <div className="mt-16 pt-12 border-t border-white/[0.03] w-full max-w-2xl grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase text-gray-600 mb-2 font-bold tracking-widest whitespace-nowrap">Confidence</span>
                        <span className="text-xl text-white font-mono tracking-tighter">{signal.confidence}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase text-gray-600 mb-2 font-bold tracking-widest whitespace-nowrap">Sentiment</span>
                        <span className="text-white flex items-center gap-2 font-mono tracking-tighter text-xl">
                            {signal.sentiment}
                        </span>
                    </div>
                    <div className="flex flex-col items-center col-span-2 md:col-span-2">
                        <span className="text-[10px] uppercase text-gray-600 mb-2 font-bold tracking-widest whitespace-nowrap">Primary Driver</span>
                        <span className="text-sm text-gray-300 font-light leading-snug max-w-[200px] text-balance">
                            {signal.reason}
                        </span>
                    </div>
                </div>

                <div className="mt-16">
                    <a
                        href={signal.signalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-black text-xs tracking-[0.2em] uppercase transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105 group"
                    >
                        Access Raw Signal <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                </div>

            </div>
        </section>
    );
}
