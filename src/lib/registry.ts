import { Zap, Activity, ShieldCheck, Trophy, Gift } from "lucide-react";

export type BaseApp = {
    id: string;
    name: string;
    category: string;
    description: string;
    trustScore: number;
    triggerReason: string;
    metric: string;
    metricValue: string;
    url: string;
    icon: string;
    isNewDiscovery?: boolean; // For UI highlighting
    discoveredAt?: string;
};

// SIMULATE DISCOVERY FETCH
export async function fetchRegistry(): Promise<BaseApp[]> {
    try {
        const response = await fetch('/api/ui/prestige');
        if (!response.ok) {
            throw new Error('Failed to fetch registry data');
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching prestige data:", error);
        return [];
    }
}
