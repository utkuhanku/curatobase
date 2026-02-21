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
            <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none opacity-40" />

            {/* Subtle Core Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)] pointer-events-none" />

            {/* Navbar */}
            <nav className="relative z-20 px-8 py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-2 h-2 bg-[#1652F0] rounded-full shadow-[0_0_12px_#1652F0] ring-4 ring-[#1652F0]/20" />
                    <span className="font-bold tracking-widest text-lg uppercase text-white">Curato<span className="text-[#1652F0] font-black">Base</span></span>
                </div>
                <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <Link href="/prestige" className="hover:text-white transition-colors flex items-center gap-2 group">
                        <ShieldCheck size={14} className="text-[#1652F0] group-hover:drop-shadow-[0_0_8px_#1652F0]" /> Prestige
                    </Link>
                    <Link href="https://github.com/utkuhanku/curatobase" target="_blank" className="hover:text-white transition-colors">
                        Source
                    </Link>
                </div>
            </nav>

            {/* Split Hero Section */}
            <div className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center relative z-10 gap-16 lg:gap-8 min-h-[85vh] py-12 lg:py-0">

                {/* LEFT: Copy & CTAs */}
                <div className="w-full lg:w-1/2 flex flex-col items-start text-left shrink-0">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-bold tracking-[0.2em] text-gray-300 mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-[#00FF7A] animate-pulse shadow-[0_0_8px_#00FF7A]" />
                        AUTONOMOUS CURATION ENGINE ACTIVE
                    </div>

                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-white text-balance animate-fade-in-up delay-100">
                        Curating the<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600">On-Chain</span><br />
                        Economy.
                    </h1>

                    <p className="text-gray-400 text-lg sm:text-xl max-w-xl mb-12 leading-relaxed font-light animate-fade-in-up delay-200">
                        An autonomous AI agent monitoring the Base ecosystem. We intercept noisy social signals, verify on-chain proofs, and index only the highest quality builders into an immutable prestige registry.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-in-up delay-300">
                        <Link href="/dashboard" className="w-full sm:w-auto group relative px-8 py-5 bg-white text-black font-black text-[11px] tracking-[0.25em] uppercase rounded-full overflow-hidden hover:scale-105 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                            <span className="relative flex items-center justify-center gap-3">
                                ENTER TERMINAL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        <Link href="/prestige" className="w-full sm:w-auto px-8 py-5 border border-white/[0.08] bg-white/[0.02] backdrop-blur-md font-bold tracking-[0.2em] uppercase text-[11px] rounded-full hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 flex items-center justify-center gap-3 text-gray-400 hover:text-white group">
                            <ShieldCheck size={14} className="text-[#1652F0] group-hover:scale-110 transition-transform" /> VIEW REGISTRY
                        </Link>
                    </div>

                    {/* Metric Band Built-in */}
                    <div className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t border-white/[0.05] animate-fade-in-up delay-500 w-full">
                        <div>
                            <div className="text-3xl font-black text-white mb-1 tracking-tighter tabular-nums flex items-baseline gap-1">
                                {formatNumber(totalSignals)}
                                <span className="text-[#1652F0] text-sm tracking-normal">sigs</span>
                            </div>
                            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-1.5"><Activity size={10} /> Analyzed Network</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white mb-1 tracking-tighter tabular-nums flex items-baseline gap-1">
                                {verifiedApps}
                                <span className="text-[#00FF7A] text-sm tracking-normal">verified</span>
                            </div>
                            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-1.5"><Shield size={10} /> Curated Apps</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Agent Visualizer */}
                <div className="w-full lg:w-1/2 max-w-lg lg:max-w-none relative animate-fade-in-up delay-400 perspective-[2000px]">

                    {/* Floating Glow Behind */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1652F0]/20 to-purple-500/10 blur-[80px] rounded-full" />

                    <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-[32px] border border-white/[0.1] bg-black/40 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg] transition-transform duration-700">

                        {/* Fake Mac Window Header */}
                        <div className="h-12 border-b border-white/[0.05] bg-white/[0.02] flex items-center px-6 gap-2 shrink-0">
                            <div className="w-3 h-3 rounded-full bg-white/[0.1] hover:bg-red-500 transition-colors"></div>
                            <div className="w-3 h-3 rounded-full bg-white/[0.1] hover:bg-yellow-500 transition-colors"></div>
                            <div className="w-3 h-3 rounded-full bg-white/[0.1] hover:bg-green-500 transition-colors"></div>
                            <div className="ml-auto flex items-center gap-2 text-[10px] font-mono text-gray-500 tracking-widest uppercase">
                                <Network size={12} className="text-[#1652F0]" /> CDP.Agent.v2
                            </div>
                        </div>

                        {/* Animated Internals */}
                        <div className="flex-1 p-6 sm:p-8 flex flex-col gap-6 relative">
                            {/* Scanning Simulation */}
                            <div className="flex items-start gap-4 opacity-50">
                                <Activity className="text-gray-500 mt-1 shrink-0" size={16} />
                                <div className="space-y-2 w-full">
                                    <div className="h-2 w-1/3 bg-white/10 rounded overflow-hidden relative">
                                        <div className="absolute inset-y-0 left-0 w-full bg-white/20 animate-[slide_2s_ease-in-out_infinite]" />
                                    </div>
                                    <div className="h-2 w-1/2 bg-white/5 rounded" />
                                </div>
                            </div>

                            {/* Signal Intercept Card */}
                            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#1652F0]" />
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-[10px] font-bold tracking-widest text-[#1652F0] uppercase flex items-center gap-2">
                                        <Zap size={12} className="fill-[#1652F0]" /> Signal Intercepted
                                    </div>
                                    <div className="text-[10px] font-mono text-gray-500">0x8f...4a2</div>
                                </div>
                                <div className="text-sm text-gray-300 font-sans leading-relaxed mb-4">
                                    "Just shipped the v2 liquid vault architecture on Base. Integrated CDP rewards engine. LFG 🔵"
                                </div>

                                {/* AI Processing Animation */}
                                <div className="space-y-3 pt-4 border-t border-white/[0.05]">
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                                        <span className="text-gray-500">Semantic Engine</span>
                                        <span className="text-[#00FF7A] animate-pulse">VERIFIED</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                                        <span className="text-gray-500">Onchain Proof</span>
                                        <span className="text-[#00FF7A] animate-pulse">LOCATED</span>
                                    </div>
                                </div>
                            </div>

                            {/* Final Output */}
                            <div className="mt-auto flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#1652F0]/20 flex items-center justify-center border border-[#1652F0]/40 shrink-0">
                                    <Code size={16} className="text-[#1652F0]" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white mb-1 tracking-wider uppercase">Project Indexed</div>
                                    <div className="text-[10px] text-gray-500 font-mono">Curated score: 94.2/100</div>
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
