import { TerminalFeed } from "@/components/TerminalFeed";
import { RadarDashboard } from "@/components/RadarDashboard";
import HomeView from "@/components/HomeView";
import Link from "next/link";
import NotificationToggle from "@/components/NotificationToggle";
import AgentPulse from "@/components/AgentPulse";
import { Radio } from "lucide-react";

export default async function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex items-center justify-between pb-6 border-b border-white/10 mb-8 z-20 relative">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
                        <span className="text-electric-blue">Curato</span>Base
                    </h1>
                    <p className="text-gray-500 font-mono text-sm mt-1">Autonomous Curator Agent</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <nav className="flex items-center gap-4 text-sm font-bold font-mono">
                        <Link href="/reports" className="text-gray-500 hover:text-white transition-colors pb-1">Logs</Link>
                        <Link href="/about" className="text-gray-500 hover:text-white transition-colors pb-1">About</Link>
                    </nav>
                    <NotificationToggle />
                </div>
            </header>

            {/* HERO SECTION WITH ENTER BUTTON */}
            <div className="relative mb-12 group">
                <div className="absolute inset-0 bg-blue-500/5 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                <div className="relative z-10 border-y border-white/10 bg-black/50 backdrop-blur-sm py-12 flex flex-col items-center justify-center text-center gap-6">
                    <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase">
                        The Base Ecosystem <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-purple-500">Intelligence Layer</span>
                    </h2>

                    <Link
                        href="/dashboard"
                        className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden font-mono font-bold text-white tracking-[0.2em] uppercase transition-all duration-300 bg-transparent border-2 border-electric-blue rounded-none focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-95"
                    >
                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                        <span className="relative">ENTER TERMINAL</span>
                        <span className="absolute inset-0 bg-electric-blue/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>

                    <p className="text-xs text-gray-500 font-mono">
                        ACCESS_LEVEL: PUBLIC // MODE: READ_ONLY
                    </p>
                </div>
            </div>

            <HomeView
                radarComponent={
                    <div className="space-y-8">
                        {/* Agent Status Banner - Only on Radar View */}
                        <div className="bg-gradient-to-r from-electric-blue/10 to-transparent border-l-4 border-electric-blue p-4 rounded-r-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <Radio className="text-electric-blue animate-pulse" />
                                    <div>
                                        <h3 className="font-bold text-white text-sm tracking-wide">PROMOTION PROTOCOL ACTIVE</h3>
                                        <p className="text-xs text-gray-400 mt-1 max-w-md">
                                            This feed is not curated by humans. It is populated by the Curato Agent monitoring the Base ecosystem.
                                        </p>
                                    </div>
                                </div>
                                <AgentPulse />
                            </div>
                        </div>
                        <RadarDashboard />
                    </div>
                }
                terminalComponent={<TerminalFeed />}
            />

            <footer className="text-center text-xs text-gray-700 font-mono py-8 border-t border-white/5 mt-12">
                SYSTEM_ID: CURATO_V1 // STATUS: ONLINE
            </footer>
        </div>
    );
}
