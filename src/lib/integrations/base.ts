import { createPublicClient, http, parseAbiItem, formatUnits } from 'viem';
import { base } from 'viem/chains';

export const baseClient = createPublicClient({
    chain: base,
    transport: http(process.env.BASE_RPC_URL)
});

export const USDC_ADDRESS = (process.env.USDC_BASE_ADDRESS || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913") as `0x${string}`;

const TRANSFER_EVENT = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)');

export async function checkTransfer(
    from: string,
    amount: number, // logical amount (e.g. 100 USDC)
    windowStart: Date,
    windowEnd: Date
): Promise<{ matched: boolean, txHash?: string, details?: any }> {
    try {
        // approximate blocks from timestamps (Base block time ~2s)
        // For MVP, we might assume we are verifying recent events or just look at latest logs if range is small
        // A better approach for production is to index, but for MVP we scan

        // This is a simplified lookup. In reality, we need block numbers.
        // We'll use a very specific filter: From address

        const logs = await baseClient.getLogs({
            address: USDC_ADDRESS,
            event: TRANSFER_EVENT,
            args: {
                from: from as `0x${string}`
            },
            fromBlock: 'latest' // In real sync, we'd calculate block number from timestamp. MVP: check recent.
            // toBlock: 'latest' 
        });

        // Filter by amount and rough time (if logs have timestamps, requires fetching block)
        // Optimization: check value first

        const matchedLog = logs.find(log => {
            const value = parseFloat(formatUnits(log.args.value!, 6)); // USDC 6 decimals
            //Allow small delta? No, exact matches usually.
            return Math.abs(value - amount) < 0.1;
        });

        if (matchedLog) {
            return { matched: true, txHash: matchedLog.transactionHash };
        }

        return { matched: false };
    } catch (e) {
        console.error("Base verify error:", e);
        return { matched: false };
    }
}
