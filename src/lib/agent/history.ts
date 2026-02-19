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
        runId: 'genesis-bounty-proof',
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        scannedRange: { from: 42358821, to: 42358921 },
        signalsFound: 1,
        curatedGem: "Aerodrome (DeFi)",
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
