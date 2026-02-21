import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, Terminal, ShieldCheck, Activity, Zap, Code, Shield, Network } from "lucide-react";
import Link from "next/link";
import { PrismaClient } from '@prisma/client';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
    const prisma = new PrismaClient();

    // Fetch real metrics
    const totalSignals = await prisma.signal.count();
    const verifiedApps = await prisma.app.count({ where: { status: 'CURATED' } });

    // Format large numbers
    const formatNumber = (num: number) => {
        if (num > 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };

    return (
        <main className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-x-hidden font-sans selection:bg-[#1652F0]/30 selection:text-white">

            {/* Background Atmosphere */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-gradient-to-b from-[#1652F0]/10 via-[#1652F0]/5 to-transparent blur-[120px] opacity-60" />
                <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full opacity-40" />

                {/* Subtle Core Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 px-6 sm:px-8 py-6 max-w-7xl mx-auto w-full flex justify-between items-center">
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-2 h-2 bg-[#1652F0] rounded-full shadow-[0_0_12px_#1652F0] ring-2 ring-[#1652F0]/30" />
                    <span className="font-bold tracking-widest text-sm sm:text-base uppercase text-white font-mono">Curato<span className="text-[#1652F0] font-black">Base</span></span>
                </div>
                <div className="flex items-center gap-6 sm:gap-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">
                    <Link href="/prestige" className="hover:text-white transition-colors flex items-center gap-2 group">
                        <ShieldCheck size={14} className="text-[#1652F0] group-hover:drop-shadow-[0_0_8px_#1652F0]" /> Prestige
                    </Link>
                    <Link href="https://github.com/utkuhanku/curatobase" target="_blank" className="hover:text-white transition-colors hidden sm:block">
                        Source
                    </Link>
                </div>
            </nav>

            {/* Split Hero Section */}
            <div className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-center relative z-10 gap-16 lg:gap-8 py-12 lg:py-20 xl:py-24">

                {/* LEFT: Copy & CTAs */}
                <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start text-center lg:text-left shrink-0 z-20">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-[100px] border border-white/10 bg-white/5 backdrop-blur-md text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-gray-300 mb-8 sm:mb-10 animate-fade-in-up font-mono">
                        <span className="w-2 h-2 rounded-full bg-[#00FF7A] animate-pulse shadow-[0_0_12px_#00FF7A]" />
                        AUTONOMOUS CURATOR
                    </div>

                    <h1 className="text-5xl sm:text-7xl lg:text-7xl xl:text-[6.5rem] font-black tracking-tighter mb-8 leading-[0.95] text-white animate-fade-in-up delay-100 text-balance w-full">
                        Curating the<br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1652F0] to-cyan-400 lg:ml-0 mx-2">On-Chain</span><br className="hidden lg:block" />
                        Economy.
                    </h1>

                    <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl max-w-xl mb-12 leading-relaxed font-light animate-fade-in-up delay-200 tracking-tight text-balance">
                        An autonomous AI agent monitoring the Base ecosystem. We intercept noisy social signals, verify on-chain proofs, and index top builders.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full animate-fade-in-up delay-300">
                        <Link href="/dashboard" className="w-full sm:w-auto overflow-hidden group relative px-8 py-4 sm:py-5 bg-white text-black font-black text-[11px] sm:text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] font-mono">
                            <span className="relative flex items-center justify-center gap-3">
                                ENTER TERMINAL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        <Link href="/prestige" className="w-full sm:w-auto px-8 py-4 sm:py-5 border border-white/[0.08] bg-white/[0.02] backdrop-blur-md font-bold tracking-[0.2em] font-mono uppercase text-[11px] sm:text-xs rounded-full hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 flex items-center justify-center gap-3 text-gray-400 hover:text-white group">
                            <ShieldCheck size={14} className="text-[#1652F0] group-hover:scale-110 transition-transform" /> VIEW REGISTRY
                        </Link>
                    </div>

                    {/* Metric Band Built-in */}
                    <div className="flex items-center justify-center lg:justify-start gap-12 sm:gap-16 mt-16 pt-10 border-t border-white/[0.05] animate-fade-in-up delay-400 w-full max-w-md mx-auto lg:mx-0">
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tighter tabular-nums flex items-baseline gap-1">
                                {formatNumber(totalSignals)}
                                <span className="text-[#1652F0] text-lg tracking-normal font-medium">sigs</span>
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] font-mono flex items-center gap-1.5"><Activity size={12} /> Analyzed</div>
                        </div>
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tighter tabular-nums flex items-baseline gap-1">
                                {verifiedApps}
                                <span className="text-[#00FF7A] text-lg tracking-normal font-medium">ok</span>
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] font-mono flex items-center gap-1.5"><Shield size={12} /> Curated</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Agent Visualizer */}
                <div className="w-full lg:w-[50%] max-w-2xl mx-auto lg:max-w-none relative animate-fade-in-up delay-500 perspective-[2000px] mt-12 lg:mt-0 z-20">

                    <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[5/4] rounded-[24px] sm:rounded-[32px] border border-white/[0.1] bg-[#030303]/80 backdrop-blur-3xl shadow-[0_0_100px_rgba(22,82,240,0.15)] flex flex-col overflow-hidden transition-all duration-700 ease-out lg:rotate-y-[-5deg] lg:rotate-x-[5deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg]">

                        {/* Fake Mac Window Header */}
                        <div className="h-12 border-b border-white/[0.08] bg-white/[0.02] flex items-center px-6 gap-2 shrink-0 backdrop-blur-md">
                            <div className="w-3 h-3 rounded-full bg-white/[0.15] hover:bg-red-500 transition-colors"></div>
                            <div className="w-3 h-3 rounded-full bg-white/[0.15] hover:bg-yellow-500 transition-colors"></div>
                            <div className="w-3 h-3 rounded-full bg-white/[0.15] hover:bg-green-500 transition-colors"></div>
                            <div className="ml-auto flex items-center gap-2 text-[9px] sm:text-[10px] font-mono text-gray-500 tracking-widest uppercase">
                                <Network size={12} className="text-[#1652F0]" /> Agent.v2
                            </div>
                        </div>

                        {/* Animated Internals */}
                        <div className="flex-1 p-6 sm:p-10 flex flex-col gap-6 relative font-mono">
                            {/* Scanning Simulation */}
                            <div className="flex items-start gap-4">
                                <Activity className="text-[#1652F0] mt-1 shrink-0 animate-pulse" size={16} />
                                <div className="space-y-3 w-full">
                                    <div className="h-2 w-1/3 bg-white/10 rounded-full overflow-hidden relative">
                                        <div className="absolute inset-y-0 left-0 w-full bg-[#1652F0]/60 animate-[slide_2s_ease-in-out_infinite]" />
                                    </div>
                                    <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                                </div>
                            </div>

                            {/* Signal Intercept Card */}
                            <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-5 sm:p-6 relative group shadow-2xl mt-2 sm:mt-6">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#1652F0] shadow-[0_0_20px_#1652F0]" />
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-[10px] sm:text-xs font-bold tracking-widest text-[#1652F0] uppercase flex items-center gap-2">
                                        <Zap size={14} className="fill-[#1652F0] drop-shadow-[0_0_8px_#1652F0]" /> Signal Intercepted
                                    </div>
                                    <div className="text-[9px] sm:text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded">0x8f...4a2</div>
                                </div>
                                <div className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed mb-6 tracking-tight">
                                    "Just shipped the v2 liquid vault architecture on Base. Integrated CDP rewards engine. LFG 🔵"
                                </div>

                                {/* AI Processing Animation */}
                                <div className="space-y-3 sm:space-y-4 pt-5 border-t border-white/[0.05]">
                                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold">
                                        <span className="text-gray-500">Semantic Engine</span>
                                        <span className="text-[#00FF7A] animate-pulse drop-shadow-[0_0_5px_#00FF7A]">VERIFIED</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold">
                                        <span className="text-gray-500">Onchain Proof</span>
                                        <span className="text-[#00FF7A] animate-pulse drop-shadow-[0_0_5px_#00FF7A] delay-100">LOCATED</span>
                                    </div>
                                </div>
                            </div>

                            {/* Final Output */}
                            <div className="mt-auto flex items-center gap-4 border-t border-white/[0.05] pt-6 opacity-90">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1652F0]/20 flex items-center justify-center border border-[#1652F0]/40 shrink-0">
                                    <Code size={18} className="text-[#1652F0]" />
                                </div>
                                <div>
                                    <div className="text-xs sm:text-sm font-bold text-white mb-1 tracking-widest uppercase">Project Indexed</div>
                                    <div className="text-[10px] sm:text-[11px] text-gray-500">Confidence Score: 94.2/100</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <footer className="relative z-20 py-8 text-center text-[9px] sm:text-[10px] text-gray-600 font-bold tracking-[0.3em] uppercase font-mono border-t border-white/[0.02]">
                <p>Designed for the <span className="text-white">Base Ecosystem</span> <span className="text-[#1652F0] mx-2">||</span> Autonomous Curation Protocol</p>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slide {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
            `}} />

        </main>
    );
}
