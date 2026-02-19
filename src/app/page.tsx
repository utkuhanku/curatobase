import { TerminalFeed } from "@/components/TerminalFeed";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, Terminal, ShieldCheck, Activity, Zap } from "lucide-react";
import Link from "next/link";
                    >
                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                        <span className="relative">ENTER TERMINAL</span>
                        <span className="absolute inset-0 bg-electric-blue/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link >

    <p className="text-xs text-gray-500 font-mono">
        ACCESS_LEVEL: PUBLIC // MODE: READ_ONLY
    </p>
                </div >
            </div >

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
        </div >
    );
}
