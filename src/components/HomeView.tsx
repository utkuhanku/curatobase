"use client";

import { useState } from "react";
import { Terminal, Zap, ExternalLink } from "lucide-react";

export default function HomeView({
    radarComponent,
    terminalComponent
}: {
    radarComponent: React.ReactNode,
    terminalComponent: React.ReactNode
}) {
    const [viewMode, setViewMode] = useState<'RADAR' | 'TERMINAL'>('RADAR');

    return (
        <div className="space-y-8">
            {/* View Toggle */}
            <div className="flex justify-end">
                <button
                    onClick={() => setViewMode(viewMode === 'RADAR' ? 'TERMINAL' : 'RADAR')}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-wider border transition-all
                        ${viewMode === 'RADAR'
                            ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                            : 'bg-electric-blue/10 border-electric-blue text-electric-blue shadow-[0_0_15px_rgba(22,82,240,0.3)]'
                        }
                    `}
                >
                    <Terminal size={14} />
                    {viewMode === 'RADAR' ? 'ACCESS_TERMINAL_FEED' : 'RETURN_TO_RADAR'}
                </button>
            </div>

            {/* Content Area */}
            <div className={`transition-opacity duration-300 ${viewMode === 'TERMINAL' ? 'font-mono' : ''}`}>
                {viewMode === 'RADAR' ? radarComponent : terminalComponent}
            </div>

            {/* Footer Context */}
            {viewMode === 'RADAR' && (
                <div className="text-center mt-12 mb-4">
                    <p className="text-xs text-gray-600 font-mono mb-2">
                        CURATO_AGENT IS MONITORING THE BASE MEMPOOL & FARCASTER FEED...
                    </p>
                </div>
            )}
        </div>
    );
}
