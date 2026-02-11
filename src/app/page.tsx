import { DiscoveryFeed } from "@/components/DiscoveryFeed";
import Link from "next/link";
import { Zap, Radio } from "lucide-react";
import AgentPulse from "@/components/AgentPulse";
import NotificationToggle from "@/components/NotificationToggle";

export default async function Home() {
    return (
        <div className="space-y-8 min-h-screen">
            <header className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
                        <span className="text-electric-blue">Curato</span>Base
                    </h1>
                    <p className="text-gray-500 font-mono text-sm mt-1">Autonomous Curator Agent</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <nav className="flex gap-4 text-sm font-bold font-mono">
                        <Link href="/" className="text-white border-b-2 border-electric-blue pb-1">Radar</Link>
                        <Link href="/reports" className="text-gray-500 hover:text-white transition-colors pb-1">Logs</Link>
                    </nav>
                    <NotificationToggle />
                </div>
            </header>

            {/* Agent Status Banner */}
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
                <div className="mt-4 flex gap-4 text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-1"><span className="text-green-500">✓</span> BUILD</span>
                    <span className="flex items-center gap-1"><span className="text-green-500">✓</span> SHIP ON BASE</span>
                    <span className="flex items-center gap-1"><span className="text-green-500">✓</span> POST ON FARCASTER</span>
                </div>
            </div>

            <DiscoveryFeed />

            <footer className="text-center text-xs text-gray-700 font-mono py-8">
                SYSTEM_ID: CURATO_V1 // STATUS: ONLINE
            </footer>
        </div>
    );
}
