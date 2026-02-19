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

// SIMULATED "LIVE" DATABASE
// In a real production environment, this would be populated by a backend scraper.
// For now, we seed it with the "Discovered" state.

export const REGISTRY_DATA: BaseApp[] = [
    {
        id: "word-rain",
        name: "Word Rain",
        category: "Gaming / PvP",
        description: "Competitive PvP typing battles with USDC wagering. The ultimate skill-based arena.",
        trustScore: 99.9,
        triggerReason: "HIGH_SIGNAL: Verified on-chain payouts. High user retention in PvP loops.",
        metric: "Prize Pool Paid",
        metricValue: "$12,500 USDC",
        url: "https://wordrain.base.eth",
        icon: "🌧️",
        isNewDiscovery: true,
        discoveredAt: "Just now"
    },
    {
        id: "arbase",
        name: "Arbase",
        category: "AR / Gaming",
        description: "The Augmented Reality layer for Base. Hunt for rewards in the real world.",
        trustScore: 98.8,
        triggerReason: "INNOVATION: First geo-spatial AR token drop mechanism on Base.",
        metric: "AR Drops Found",
        metricValue: "84,200",
        url: "https://arbase.app",
        icon: "🕶️",
        isNewDiscovery: true
    },
    {
        id: "base-me",
        name: "Base Me",
        category: "Identity",
        description: "Your on-chain homepage. Aggregating your entire Base footprint.",
        trustScore: 99.2,
        triggerReason: "UTILITY: Standard for consolidating Base identity. High adoption.",
        metric: "Profiles Active",
        metricValue: "18,500",
        url: "https://base.me",
        icon: "🪪",
        isNewDiscovery: true
    },
    {
        id: "aerodrome",
        name: "Aerodrome",
        category: "DeFi",
        description: "The central trading and liquidity marketplace on Base.",
        trustScore: 99.8,
        triggerReason: "LIQUIDITY: Dominant DEX provider. $580M+ TVL.",
        metric: "Liquidity Depth",
        metricValue: "$580M",
        url: "https://aerodrome.finance",
        icon: "✈️"
    },
    {
        id: "basepaint",
        name: "BasePaint",
        category: "Art / Social",
        description: "Collaborative daily pixel art canvas. A community ritual.",
        trustScore: 99.5,
        triggerReason: "COMMUNITY: 400+ consecutive daily mints.",
        metric: "Artists Paid",
        metricValue: "320 ETH",
        url: "https://basepaint.xyz",
        icon: "🎨"
    },
    {
        id: "virtuals",
        name: "Virtuals Protocol",
        category: "AI / Agents",
        description: "Infrastructure for co-owning and deploying autonomous AI agents.",
        trustScore: 98.9,
        triggerReason: "VELOCITY: High rate of new agent deployment verification.",
        metric: "Agents Live",
        metricValue: "1,200+",
        url: "https://virtuals.io",
        icon: "🤖"
    },
    {
        id: "zora",
        name: "Zora",
        category: "NFT / Creator",
        description: "The best place to mint and collect onchain media.",
        trustScore: 99.7,
        triggerReason: "STANDARD: The default protocol for creative media.",
        metric: "Mints (24h)",
        metricValue: "45,230",
        url: "https://zora.co",
        icon: "orb"
    },
    {
        id: "blackbird",
        name: "Blackbird",
        category: "Consumer",
        description: "Restaurant loyalty platform powered by Base.",
        trustScore: 98.5,
        triggerReason: "REAL_WORLD: Verified physical check-ins at scale.",
        metric: "Check-ins",
        metricValue: "125k",
        url: "https://blackbird.xyz",
        icon: "🍽️"
    },
    {
        id: "moonwell",
        name: "Moonwell",
        category: "DeFi / Lending",
        description: "Simple, open lending and borrowing protocol.",
        trustScore: 99.1,
        triggerReason: "SAFETY: Top lending protocol with risk management.",
        metric: "Total Supplied",
        metricValue: "$340M",
        url: "https://moonwell.fi",
        icon: "🌑"
    },
    {
        id: "farcaster",
        name: "Farcaster",
        category: "Social",
        description: "Sufficiently decentralized social network.",
        trustScore: 99.9,
        triggerReason: "NETWORK: The social layer of the ecosystem.",
        metric: "DAU",
        metricValue: "65k",
        url: "https://warpcast.com",
        icon: "🦄"
    },
    {
        id: "highlight",
        name: "Highlight",
        category: "Gen Art",
        description: "Tools for generative art on Ethereum and Base.",
        trustScore: 97.8,
        triggerReason: "CREATIVE: Zero tooling exploits. High volume.",
        metric: "Artworks",
        metricValue: "2.5M",
        url: "https://highlight.xyz",
        icon: "🖌️"
    },
    {
        id: "bountycaster",
        name: "Bountycaster",
        category: "Work",
        description: "Service to post and discover bounties on Farcaster.",
        trustScore: 97.0,
        triggerReason: "PAYOUTS: High fulfillment rate verified on-chain.",
        metric: "Bounties Paid",
        metricValue: "$500k+",
        url: "https://bountycaster.xyz",
        icon: "💰"
    }
];

// SIMULATE DISCOVERY FETCH
export async function fetchRegistry(): Promise<BaseApp[]> {
    // In a real app, this scans a DB or API.
    // We simulate a delay to feel like "Querying Network"
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(REGISTRY_DATA);
        }, 800);
    });
}
