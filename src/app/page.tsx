import { TerminalFeed } from "@/components/TerminalFeed";
import { RadarDashboard } from "@/components/RadarDashboard";
import HomeView from "@/components/HomeView";
import Link from "next/link";
import NotificationToggle from "@/components/NotificationToggle";
import AgentPulse from "@/components/AgentPulse";
import { Radio } from "lucide-react";

export default async function Home() {
    return (
        <div className="min-h-screen">
            <header className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
                        <span className="text-electric-blue">Curato</span>Base
                    </h1>
                    <p className="text-gray-500 font-mono text-sm mt-1">Autonomous Curator Agent</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <nav className="flex gap-4 text-sm font-bold font-mono">
                        <Link href="/reports" className="text-gray-500 hover:text-white transition-colors pb-1">Logs</Link>
                        <Link href="/about" className="text-gray-500 hover:text-white transition-colors pb-1">About</Link>
                    </nav>
                    <NotificationToggle />
                </div>
            </header>

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
