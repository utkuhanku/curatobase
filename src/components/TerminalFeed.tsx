"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Hexagon, Terminal } from "lucide-react";
import { SIMULATION_DATA } from "@/data/simulation";

export function TerminalFeed() {
    const [logs, setLogs] = useState<typeof SIMULATION_DATA>([]);

    useEffect(() => {
        // Hydration fix: Start with some data
        setLogs(SIMULATION_DATA.slice(0, 5));

        const interval = setInterval(() => {
            const randomLog = SIMULATION_DATA[Math.floor(Math.random() * SIMULATION_DATA.length)];
            // Update timestamp to "Just now" for the new log
            const newLog = { ...randomLog, timestamp: 'LIVE', hash: '0x' + Math.random().toString(16).slice(2, 10) };

            setLogs(prev => {
                const updated = [newLog, ...prev];
                return updated.slice(0, 8); // Keep max 8 items
            });
        }, 3500); // New log every 3.5s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-mono text-xs bg-[#050505] rounded-xl border border-white/10 overflow-hidden flex flex-col h-[400px]">
            {/* Terminal Header */}
            <div className="bg-white/5 px-4 py-3 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-2 text-gray-400">
                    <Terminal size={14} className="text-electric-blue" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Live Intercept Feed</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/20" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                    <div className="w-2 h-2 rounded-full bg-green-500/20" />
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] text-gray-600 uppercase tracking-widest border-b border-white/5 bg-black/20">
                <div className="col-span-2">Time/Hash</div>
                <div className="col-span-2">Origin</div>
                <div className="col-span-6">Signal Data</div>
                <div className="col-span-2 text-right">Confidence</div>
            </div>

            {/* Scrollable Feed */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 relative">
                {/* Scan Line Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-blue/5 to-transparent h-16 w-full animate-scan pointer-events-none" />

                {logs.map((log, i) => (
                    <div
                        key={`${log.hash}-${i}`}
                        className="grid grid-cols-12 gap-2 items-center p-2 rounded hover:bg-white/5 transition-all animate-fade-in border-l-2 border-transparent hover:border-electric-blue group"
                    >
                        {/* Time & Hash */}
                        <div className="col-span-2 flex flex-col">
                            <span className={`text-[10px] font-bold ${i === 0 ? 'text-green-400 animate-pulse' : 'text-gray-500'}`}>
                                {i === 0 ? '> LIVE' : log.timestamp}
                            </span>
                            <span className="text-[9px] text-gray-700 font-mono group-hover:text-electric-blue cursor-pointer transition-colors">
                                {log.hash}
                            </span>
                        </div>

                        {/* Origin */}
                        <div className="col-span-2">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-gray-300">
                                {log.type === 'SOCIAL_SIGNAL' ? '🗣️' : '⛓️'} {log.handle.slice(0, 8)}
                            </span>
                        </div>

                        {/* Message */}
                        <div className="col-span-6 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-electric-blue text-[10px] font-bold">
                                    {log.action}
                                </span>
                            </div>
                            <div className="text-gray-400 text-[10px] truncate group-hover:text-white transition-colors">
                                {log.message}
                            </div>
                        </div>

                        {/* Confidence / Action */}
                        <div className="col-span-2 text-right flex flex-col items-end gap-1">
                            <span className={`text-[10px] font-bold ${log.confidence > 98 ? 'text-green-500' : 'text-blue-500'}`}>
                                {log.confidence}%
                            </span>
                            <a href={log.url} target="_blank" className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-gray-500 hover:text-white flex items-center gap-1">
                                VIEW <ExternalLink size={8} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Stats */}
            <div className="border-t border-white/5 p-2 bg-black/40 flex justify-between items-center text-[9px] text-gray-600 font-mono">
                <div>SCANNED_OBJECTS: {24500 + logs.length * 12}</div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    STREAM_ACTIVE
                </div>
            </div>
        </div>
    );
}
