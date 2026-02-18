import { NextResponse } from 'next/server';
import { createPublicClient, http, formatEther, type Hex } from 'viem';
import { base } from 'viem/chains';
import { getLastRun, getHistory } from '@/lib/agent/history';

// Environment & Config
const REVENUE_CONTRACT = process.env.REVENUE_CONTRACT_ADDRESS as `0x${string}`;
const COMPUTE_WALLET = process.env.COMPUTE_WALLET_ADDRESS as `0x${string}`;
const BUILDER_CODE = process.env.BUILDER_CODE || 'curatobase'; // Default fallback

// Viem Client
const client = createPublicClient({
    chain: base,
    transport: http(process.env.BASE_RPC_URL)
});

export const dynamic = 'force-dynamic'; // Ensure no caching for real-time proof

export async function GET() {
    try {
        // 1. Fetch Chain Data (Parallel)
        const [
            blockNumber,
            revenueBal,
            computeBal,
            txCount
        ] = await Promise.all([
            client.getBlockNumber(),
            client.getBalance({ address: REVENUE_CONTRACT }),
            client.getBalance({ address: COMPUTE_WALLET }),
            client.getTransactionCount({ address: COMPUTE_WALLET })
        ]);

        // 2. Proof of Autonomy (Last Tx)
        // If txCount > 0, we try to find the last tx hash.
        // In a light setup without full history API, we can't easily get the *hash* of the last tx via simple RPC 
        // unless we built it or stored it. 
        // WE RELY on the `history.ts` (in-memory) OR we accept we might strictly need an external provider (Basescan API) for the hash if memory is cold.
        // Compliance Strategy: Return what we have in memory. If empty, return "Waiting for run".

        const lastRun = getLastRun();
        let lastTxHash = lastRun?.onchainTxHashes[0] || null;
        let builderCodeStatus = 'UNKNOWN';

        // 3. Builder Code Verification (if we have a hash)
        if (lastTxHash) {
            try {
                const tx = await client.getTransaction({ hash: lastTxHash as Hex });
                // Check input data for builder code. 
                // ERC-8021 / Base usually appends verification or we look for specific data frame.
                // Simple Check: Does input contain our Builder Code string (utf8)?
                const input = tx.input.toLowerCase();
                // This is a naive check; robust check depends on specific registry pattern.
                // For this bounty, we ensure our agent *puts* it there.
                builderCodeStatus = input.includes(Buffer.from(BUILDER_CODE).toString('hex')) ? 'VERIFIED ✅' : 'NOT_FOUND ❌';
            } catch (e) {
                console.warn("Failed to verify last tx", e);
                builderCodeStatus = 'CHECK_FAILED';
            }
        }

        const proof = {
            network: {
                name: 'Base Mainnet',
                chainId: base.id,
                blockNumber: Number(blockNumber),
                timestamp: new Date().toISOString(),
                rpcUrl: process.env.BASE_RPC_URL ? 'Configured (Private)' : 'Public Default'
            },
            financials: {
                revenueVault: {
                    address: REVENUE_CONTRACT,
                    balance: formatEther(revenueBal),
                    label: "The Vault 🏦"
                },
                computeBrain: {
                    address: COMPUTE_WALLET,
                    balance: formatEther(computeBal),
                    txCount: txCount,
                    label: "The Brain 🧠"
                }
            },
            autonomy: {
                status: lastRun ? lastRun.status : 'WAITING_FOR_FIRST_RUN',
                lastRunId: lastRun?.runId || null,
                lastRunTime: lastRun?.finishedAt || null,
                scannedBlocks: lastRun ? `${lastRun.scannedRange.from} -> ${lastRun.scannedRange.to}` : null,
                signalsFound: lastRun?.signalsFound || 0
            },
            verification: {
                lastTxHash: lastTxHash,
                explorerLink: lastTxHash ? `https://basescan.org/tx/${lastTxHash}` : null,
                builderCode: BUILDER_CODE,
                builderCodeCompliance: builderCodeStatus
            },
            history: getHistory().map(r => ({
                time: r.finishedAt,
                id: r.runId,
                txs: r.onchainTxHashes.length
            }))
        };

        return NextResponse.json(proof, { status: 200, headers: { 'Cache-Control': 'no-store' } });

    } catch (error: any) {
        return NextResponse.json({
            error: "Proof Generation Failed",
            details: error.message
        }, { status: 500 });
    }
}
