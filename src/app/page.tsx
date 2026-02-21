import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, Terminal, ShieldCheck, Activity, Zap } from "lucide-react";
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

            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#1652F0]/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

            {/* Navbar */}
            <nav className="relative z-10 px-8 py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-2 h-2 bg-[#1652F0] rounded-full group-hover:animate-ping shadow-[0_0_10px_#1652F0]" />
                    <span className="font-bold tracking-widest text-lg uppercase">Curato<span className="text-[#1652F0] font-black">Base</span></span>
                </div>
                <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <Link href="/prestige" className="hover:text-white transition-colors flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#1652F0]" /> Prestige
                    </Link>
                    <Link href="https://github.com/utkuhanku/curatobase" target="_blank" className="hover:text-white transition-colors">
                        Source
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center max-w-5xl mx-auto mt-[-50px]">

                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] text-[10px] font-bold tracking-widest text-[#1652F0] mb-10 animate-fade-in-up">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1652F0] animate-pulse" />
                    LIVE SIGNAL INTERCEPTION ACTIVE
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600 animate-fade-in-up delay-100 text-balance">
                    THE AUTONOMOUS <br />
                    <span className="text-white">BASE CURATOR</span>
                </h1>

                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up delay-200 text-balance">
                    An AI-powered agent scanning the Base ecosystem for high-signal opportunities, new deployments, and verified builders in real-time.
                </p>

                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto animate-fade-in-up delay-300">
                    <Link href="/dashboard" className="w-full md:w-auto group relative px-10 py-5 bg-white text-black font-black text-xs tracking-[0.2em] uppercase rounded-full overflow-hidden hover:scale-105 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                        <span className="relative flex items-center justify-center gap-3">
                            <Terminal size={16} /> ENTER TERMINAL <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>

                    <Link href="/prestige" className="w-full md:w-auto px-10 py-5 border border-white/[0.05] bg-white/[0.02] font-bold tracking-[0.2em] uppercase text-xs rounded-full hover:bg-white/[0.05] transition-all duration-500 flex items-center justify-center gap-3 text-gray-400 hover:text-white">
                        <ShieldCheck size={16} className="text-[#1652F0]" /> VIEW REGISTRY
                    </Link>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-white/[0.05] w-full max-w-2xl mx-auto animate-fade-in-up delay-500">
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter tabular-nums">{formatNumber(totalSignals)}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Signals Scanned</div>
                    </div>
                    <div className="text-center relative">
                        <div className="absolute inset-y-0 -left-4 w-px bg-white/[0.05]" />
                        <div className="absolute inset-y-0 -right-4 w-px bg-white/[0.05]" />
                        <div className="text-3xl md:text-4xl font-black text-[#00FF7A] mb-2 tracking-tighter tabular-nums">99.9%</div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Agent Uptime</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter tabular-nums">{verifiedApps}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Verified Modules</div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <footer className="relative z-10 py-8 text-center text-[10px] text-gray-600 font-bold tracking-[0.3em] border-t border-white/[0.05] bg-black/50">
                <p>BUILT ON BASE <span className="text-[#1652F0] mx-2">||</span> POWERED BY COINBASE DEVELOPER PLATFORM</p>
            </footer>

        </main>
    );
}
