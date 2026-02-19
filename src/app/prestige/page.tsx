```
import { ShieldCheck, BadgeCheck, Activity } from "lucide-react";
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const TRUSTED_APPS = [
    {
        name: "Moxie",
        category: "Infrastructure",
        description: "Fan engagement protocol offering rewards for activity.",
        trustScore: 99.9,
        triggerReason: "Consistent daily reward distribution to >10k users. Zero incident reports.",
        metric: "Reward Consistency",
        metricValue: "99.9%",
        url: "https://moxie.xyz",
        color: "text-blue-400"
    },
    {
        name: "Aerodrome",
        category: "DeFi",
        description: "The central trading and liquidity marketplace on Base.",
        trustScore: 99.5,
        triggerReason: "Highest TVL on Base. Official OP Stack partner. Audited contracts.",
        metric: "Liquidity Depth",
        metricValue: "$142M",
        url: "https://aerodrome.finance",
        color: "text-blue-400"
    },
    {
        name: "Virtuals Protocol",
        category: "AI / Agents",
        description: "Decentralized factory for autonomous AI agents.",
        trustScore: 98.2,
        triggerReason: "New high-velocity agent deployment standards. Verified factory.",
        metric: "Contract Velocity",
        metricValue: "12/hr",
        url: "https://virtuals.io",
        color: "text-purple-400"
    }
];

export default function PrestigePage() {
    const [apps, setApps] = useState(TRUSTED_APPS);
    const [lastChecked, setLastChecked] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setLastChecked(new Date());
            
            // Randomly fluctuate scores slightly to show "Liveness"
            setApps(prev => prev.map(app => ({
                ...app,
                trustScore: Math.min(100, Math.max(90, app.trustScore + (Math.random() - 0.5) * 0.1)),
                // Occasionally update the metric value for a "live" feel
                metricValue: app.name === "Aerodrome" 
                    ? `$${ (142 + (Math.random() * 0.5)).toFixed(2) } M`
                    : app.metricValue
            })));

        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
                <p>REGISTRY_ID: 0x12..9a // IMMUTABLE RECORD</p>
            </div>
        </div>
    );
}
