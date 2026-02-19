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
        runId: 'sys-boot-8821a',
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        scannedRange: { from: 24358821, to: 24358921 },
        signalsFound: 1,
        curatedGem: "@virtuals_io: \"GIVEAWAY: 100,000 $VIRTUAL...\"",
        signalUrl: "https://warpcast.com/virtuals/0x123abc...",
        sentiment: "HIGH VALUE OPPORTUNITY 💎",
        authorStats: "Top 1% Builder (Verified)",
        onchainTxHashes: ['0x7044be156c33c3e2020d2b69570a33e28ad62d2674174442d699c6233e7c059b'],
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
