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
        <main className="min-h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden font-mono selection:bg-electric-blue/30">

            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-electric-blue/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-2.5 h-2.5 bg-electric-blue rounded-full group-hover:animate-ping" />
                    <span className="font-bold tracking-tight text-xl">CURATO<span className="text-electric-blue">BASE</span></span>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
                    <Link href="/prestige" className="hover:text-white transition-colors flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Prestige
                    </Link>
                    <Link href="https://github.com/utkuhanku/curatobase" target="_blank" className="hover:text-white transition-colors">
                        Source
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center max-w-4xl mx-auto mt-[-50px]">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-widest text-electric-blue mb-8 animate-fade-in-up">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse" />
                    LIVE SIGNAL INTERCEPTION ACTIVE
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 animate-fade-in-up delay-100">
                    THE AUTONOMOUS <br />
                    <span className="text-white">BASE CURATOR</span>
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-fade-in-up delay-200">
                    An AI-powered agent scanning the Base ecosystem for high-signal opportunities, new deployments, and verified builders in real-time.
                </p>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto animate-fade-in-up delay-300">
                    <Link href="/dashboard" className="w-full md:w-auto group relative px-8 py-4 bg-white text-black font-bold tracking-wide rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center justify-center gap-2">
                            ENTER TERMINAL <ArrowRight size={16} />
                        </span>
                    </Link>

                    <Link href="/prestige" className="w-full md:w-auto px-8 py-4 border border-white/10 bg-white/5 font-medium tracking-wide rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-gray-300 hover:text-white">
                        <ShieldCheck size={16} /> VIEW REGISTRY
                    </Link>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/5 w-full max-w-lg mx-auto animate-fade-in-up delay-500">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{formatNumber(totalSignals)}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Signals Scanned</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Uptime</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{verifiedApps}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Verified Apps</div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <footer className="relative z-10 py-6 text-center text-[10px] text-gray-600 border-t border-white/5 bg-black/50">
                <p>BUILT ON BASE // POWERED BY COINBASE DEVELOPER PLATFORM</p>
            </footer>

        </main>
    );
}
