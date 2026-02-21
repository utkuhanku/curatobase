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
        <main className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden font-mono selection:bg-[#1652F0]/30 selection:text-white">

            {/* Background Atmosphere */}
            <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-[#1652F0]/10 via-[#1652F0]/5 to-transparent blur-[120px] pointer-events-none opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[600px] bg-gradient-to-r from-purple-600/5 to-[#1652F0]/5 blur-[150px] rounded-full pointer-events-none opacity-60 flex-shrink-0" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none opacity-40 flex-shrink-0" />

            {/* Subtle Core Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)] pointer-events-none" />

            {/* Navbar */}
            <nav className="relative z-20 px-6 sm:px-8 py-6 max-w-7xl mx-auto w-full flex justify-between items-center">
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-2 h-2 bg-[#1652F0] rounded-full shadow-[0_0_12px_#1652F0] ring-4 ring-[#1652F0]/20" />
                    <span className="font-bold tracking-widest text-base sm:text-lg uppercase text-white">Curato<span className="text-[#1652F0] font-black">Base</span></span>
                </div>
                <div className="flex items-center gap-6 sm:gap-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
                    <Link href="/prestige" className="hover:text-white transition-colors flex items-center gap-2 group">
                        <ShieldCheck size={14} className="text-[#1652F0] group-hover:drop-shadow-[0_0_8px_#1652F0]" /> Prestige
                    </Link>
                    <Link href="https://github.com/utkuhanku/curatobase" target="_blank" className="hover:text-white transition-colors">
                        Source
                    </Link>
                </div>
            </nav>

            {/* Split Hero Section */}
            <div className="flex-1 w-full max-w-[90rem] mx-auto px-6 lg:px-12 xl:px-20 grid grid-cols-1 lg:grid-cols-12 items-center justify-between relative z-10 gap-16 lg:gap-12 min-h-[85vh] py-16 lg:py-0 overflow-y-auto lg:overflow-visible">

                {/* LEFT: Copy & CTAs */}
                <div className="w-full lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left shrink-0">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-gray-400 mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-[#00FF7A] animate-pulse shadow-[0_0_12px_#00FF7A]" />
                        AUTONOMOUS CURATION ENGINE
                    </div>

                    <h1 className="text-6xl sm:text-8xl xl:text-[7.5rem] font-black tracking-tighter mb-8 leading-[0.85] text-white text-balance animate-fade-in-up delay-100 drop-shadow-2xl">
                        Curating the<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-700">On-Chain</span><br />
                        Economy.
                    </h1>

                    <p className="text-gray-400 text-lg sm:text-xl max-w-xl mb-12 leading-relaxed font-light animate-fade-in-up delay-200 tracking-tight">
                        An autonomous AI agent monitoring the Base ecosystem. We intercept noisy social signals, verify on-chain proofs, and index only the highest quality builders into an immutable prestige registry.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-in-up delay-300">
                        <Link href="/dashboard" className="w-full sm:w-auto group relative px-8 py-5 bg-white text-black font-black text-[11px] tracking-[0.25em] uppercase rounded-full overflow-hidden hover:scale-105 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                            <span className="relative flex items-center justify-center gap-3">
                                ENTER TERMINAL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        <Link href="/prestige" className="w-full sm:w-auto px-8 py-5 border border-white/[0.08] bg-white/[0.02] backdrop-blur-md font-bold tracking-[0.2em] uppercase text-[11px] rounded-full hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 flex items-center justify-center gap-3 text-gray-400 hover:text-white group">
                            <ShieldCheck size={14} className="text-[#1652F0] group-hover:scale-110 transition-transform" /> VIEW REGISTRY
                        </Link>
                    </div>

                    {/* Metric Band Built-in */}
                    <div className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t border-white/[0.05] animate-fade-in-up delay-400 w-full max-w-md">
                        <div>
                            <div className="text-4xl font-black text-white mb-1 tracking-tighter tabular-nums flex items-baseline gap-1">
                                {formatNumber(totalSignals)}
                                <span className="text-[#1652F0] text-sm tracking-normal font-medium">sigs</span>
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em] flex items-center gap-1.5"><Activity size={10} /> Analyzed Network</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-white mb-1 tracking-tighter tabular-nums flex items-baseline gap-1">
                                {verifiedApps}
                                <span className="text-[#00FF7A] text-sm tracking-normal font-medium">verified</span>
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-gray-600 uppercase font-bold tracking-[0.2em] flex items-center gap-1.5"><Shield size={10} /> Curated Apps</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Agent Visualizer */}
                <div className="w-full lg:col-span-6 lg:col-start-7 max-w-2xl mx-auto lg:max-w-none relative animate-fade-in-up delay-500 perspective-[2000px] mt-8 lg:mt-0 lg:ml-auto">

                    {/* Floating Glow Behind */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1652F0]/30 to-purple-500/10 blur-[100px] rounded-full" />

                    <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/3] xl:aspect-[16/11] rounded-[32px] sm:rounded-[40px] border border-white/[0.08] bg-[#0a0a0c]/80 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden lg:rotate-y-[-8deg] lg:rotate-x-[8deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg] transition-transform duration-1000 ease-out xl:scale-105">

                        {/* Fake Mac Window Header */}
                        <div className="h-12 border-b border-white/[0.05] bg-white/[0.02] flex items-center px-6 gap-2 shrink-0 backdrop-blur-md">
                            <div className="w-3 h-3 rounded-full bg-white/[0.1] hover:bg-red-500 transition-colors"></div>
                            <div className="w-3 h-3 rounded-full bg-white/[0.1] hover:bg-yellow-500 transition-colors"></div>
                            <div className="w-3 h-3 rounded-full bg-white/[0.1] hover:bg-green-500 transition-colors"></div>
                            <div className="ml-auto flex items-center gap-2 text-[9px] font-mono text-gray-500 tracking-widest uppercase">
                                <Network size={12} className="text-[#1652F0]" /> CDP.Agent.v2
                            </div>
                        </div>

                        {/* Animated Internals */}
                        <div className="flex-1 p-6 sm:p-8 xl:p-10 flex flex-col gap-6 relative">
                            {/* Scanning Simulation */}
                            <div className="flex items-start gap-4 opacity-70">
                                <Activity className="text-gray-500 mt-1 shrink-0 animate-pulse" size={16} />
                                <div className="space-y-2 w-full">
                                    <div className="h-1.5 w-1/3 bg-white/10 rounded-full overflow-hidden relative">
                                        <div className="absolute inset-y-0 left-0 w-full bg-[#1652F0]/50 animate-[slide_2s_ease-in-out_infinite]" />
                                    </div>
                                    <div className="h-1.5 w-1/2 bg-white/5 rounded-full" />
                                </div>
                            </div>

                            {/* Signal Intercept Card */}
                            <div className="bg-[#0f0f13] border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden group shadow-2xl xl:mt-4">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1652F0] shadow-[0_0_20px_#1652F0]" />
                                <div className="flex justify-between items-start mb-5">
                                    <div className="text-[10px] font-bold tracking-widest text-[#1652F0] uppercase flex items-center gap-2">
                                        <Zap size={14} className="fill-[#1652F0] drop-shadow-[0_0_8px_#1652F0]" /> Intercepted
                                    </div>
                                    <div className="text-[10px] font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded">0x8f...4a2</div>
                                </div>
                                <div className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed mb-6 tracking-tight">
                                    "Just shipped the v2 liquid vault architecture on Base. Integrated CDP rewards engine. LFG 🔵"
                                </div>

                                {/* AI Processing Animation */}
                                <div className="space-y-4 pt-5 border-t border-white/[0.05]">
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                                        <span className="text-gray-500">Semantic Engine</span>
                                        <span className="text-[#00FF7A] animate-pulse drop-shadow-[0_0_5px_#00FF7A]">VERIFIED</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                                        <span className="text-gray-500">Onchain Proof</span>
                                        <span className="text-[#00FF7A] animate-pulse drop-shadow-[0_0_5px_#00FF7A] delay-100">LOCATED</span>
                                    </div>
                                </div>
                            </div>

                            {/* Final Output */}
                            <div className="mt-auto flex items-center gap-4 xl:mb-2 border-t border-white/[0.05] pt-6">
                                <div className="w-12 h-12 rounded-full bg-[#1652F0]/10 flex items-center justify-center border border-[#1652F0]/30 shrink-0">
                                    <Code size={20} className="text-[#1652F0]" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white mb-1 tracking-wider uppercase">Project Indexed</div>
                                    <div className="text-[11px] text-gray-500 font-mono">Curated score: 94.2/100</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <footer className="relative z-20 py-8 text-center text-[9px] text-gray-600 font-bold tracking-[0.3em] uppercase">
                <p>Designed for the <span className="text-white">Base Ecosystem</span> <span className="text-[#1652F0] mx-3">||</span> Autonomous Curation Protocol</p>
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
