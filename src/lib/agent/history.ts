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
    onchainTxHashes: string[];
    status: 'SUCCESS' | 'FAILED';
    error?: string;
}

// Global scope to survive hot-reloads in dev, though Vercel lambda isolation limits this.
const globalForHistory = global as unknown as { agentHistory: AgentRunProof[] };

export const agentHistory = globalForHistory.agentHistory || [];

if (process.env.NODE_ENV !== 'production') globalForHistory.agentHistory = agentHistory;

export function addRun(run: AgentRunProof) {
    // Keep last 10 runs
    if (agentHistory.length >= 10) {
        agentHistory.shift();
    }
    agentHistory.push(run);
}

export function getLastRun(): AgentRunProof | null {
    return agentHistory[agentHistory.length - 1] || null;
}

export function getHistory(): AgentRunProof[] {
    return [...agentHistory].reverse();
}
