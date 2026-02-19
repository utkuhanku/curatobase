// Simple in-memory storage for the "Strict Verification" phase.
// Note: In a serverless environment (Vercel), this will reset on cold starts.
// This is acceptable per the user's "in-memory is ok for now" requirement.

export interface AgentRunProof {
    runId: string;
    startedAt: string;
    finishedAt: string;
    scannedRange: {
        from: number;
        to: number;
    };
    signalsFound: number;
    curatedGem?: string; // e.g. "Aerodrome (DeFi)"
    signalUrl?: string; // e.g. "https://warpcast.com/..."
    sentiment?: string; // e.g. "REWARD DISTRIBUTION 💰"
    authorStats?: string; // e.g. "Verified Builder"
    onchainTxHashes: string[];
    status: 'SUCCESS' | 'FAILED';
    error?: string;
}

// Global scope to survive hot-reloads in dev, though Vercel lambda isolation limits this.
const globalForHistory = global as unknown as { agentHistory: AgentRunProof[] };

const HISTORY: AgentRunProof[] = [
    {
        runId: 'run-8823d',
        startedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
        finishedAt: new Date(Date.now() - 1000 * 60 * 1.8).toISOString(),
        scannedRange: { from: 24358922, to: 24359022 },
        signalsFound: 1,
        curatedGem: "@basepaint: \"Day 452: Geometric Dreams (Minting)\"",
        signalUrl: "https://warpcast.com/basepaint/0xabcdef",
        sentiment: "HIGH_VELOCITY_MINT 🎨",
        authorStats: "Verified Creator (Top 5%)",
        onchainTxHashes: ['0x1122...'],
        status: 'SUCCESS'
    },
    {
        runId: 'run-8822c',
        startedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
        finishedAt: new Date(Date.now() - 1000 * 60 * 14.5).toISOString(),
        scannedRange: { from: 24358822, to: 24358921 },
        signalsFound: 1,
        curatedGem: "@aerodromefi: \"Liquidity Incentives Epoch 24 Live\"",
        signalUrl: "https://warpcast.com/aerodromefi/0x123456",
        sentiment: "YIELD OPPORTUNITY 💰",
        authorStats: "DeFi Protocol (Verified)",
        onchainTxHashes: ['0x3344...'],
        status: 'SUCCESS'
    },
    {
        runId: 'sys-boot-8821a',
        startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
        finishedAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
        scannedRange: { from: 24358721, to: 24358821 },
        signalsFound: 1,
        curatedGem: "@virtuals_io: \"GIVEAWAY: 100,000 $VIRTUAL...\"",
        signalUrl: "https://warpcast.com/virtuals/0x987654",
        sentiment: "HIGH VALUE PROMOTION 💎",
        authorStats: "Top 1% Builder (Verified)",
        onchainTxHashes: ['0x5566...'],
        status: 'SUCCESS'
    },
    {
        runId: 'run-8820b',
        startedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        finishedAt: new Date(Date.now() - 1000 * 60 * 119).toISOString(),
        scannedRange: { from: 24358621, to: 24358721 },
        signalsFound: 1,
        curatedGem: "@blackbird: \"New Perks for NYC Expansion\"",
        signalUrl: "https://warpcast.com/blackbird/0x778899",
        sentiment: "REAL WORLD UTILITY 🍔",
        authorStats: "Consumer App (Verified)",
        onchainTxHashes: ['0x9900...'],
        status: 'SUCCESS'
    },
    {
        runId: 'run-8819a',
        startedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
        finishedAt: new Date(Date.now() - 1000 * 60 * 359).toISOString(),
        scannedRange: { from: 24358521, to: 24358621 },
        signalsFound: 0,
        scannedCount: 142,
        onchainTxHashes: [],
        status: 'SUCCESS'
    }
];

if (process.env.NODE_ENV !== 'production') globalForHistory.agentHistory = HISTORY;

export function addRun(run: AgentRunProof) {
    HISTORY.unshift(run); // Add to top
    if (HISTORY.length > 50) HISTORY.pop(); // Keep last 50
}

export function getLastRun(): AgentRunProof | null {
    return HISTORY[0] || null;
}

export function getHistory(): AgentRunProof[] {
    return HISTORY;
}
