"use client";

import { useEffect, useState } from "react";

export default function AgentPulse() {
    const [scannedCount, setScannedCount] = useState(1420);

    useEffect(() => {
        const interval = setInterval(() => {
            setScannedCount(prev => prev + Math.floor(Math.random() * 3));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 text-xs font-mono text-electric-blue/70 bg-electric-blue/5 px-2 py-1 rounded">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-blue"></span>
            </span>
            <span>AGENT_ACTIVE: SCANNING [{scannedCount.toLocaleString()}] CASTS</span>
        </div>
    );
}
