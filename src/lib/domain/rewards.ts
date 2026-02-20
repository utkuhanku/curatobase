import { createPublicClient, http, Hash } from 'viem';
import { base } from 'viem/chains';

// Public Client for cleanup (read-only)
const client = createPublicClient({
    chain: base,
    transport: http()
});

export type RewardStatus =
    | 'NONE'
    | 'CLAIM_NO_TX'
    | 'UNVERIFIED'
    | 'VERIFIED_ETH'
    | 'VERIFIED_ERC20'
    | 'FAILED_TX';

export interface RewardCheckResult {
    status: RewardStatus;
    txHash?: string;
    details?: string;
}

export class RewardVerifier {

    /**
     * Extracts TX hash and verifies it on-chain.
     */
    static async verify(text: string): Promise<RewardCheckResult> {
        // 1. Detect Intent
        const hasClaimKeywords = /\b(prize|reward(s|ed)?|USDC|ETH|sent|payout|won)\b/i.test(text);

        // 2. Extract Hash
        const txMatch = text.match(/0x[a-fA-F0-9]{64}/);
        const txHash = txMatch ? txMatch[0] as Hash : null;

        if (!txHash) {
            return {
                status: hasClaimKeywords ? 'CLAIM_NO_TX' : 'NONE'
            };
        }

        try {
            // 3. Verify On-Chain
            const receipt = await client.getTransactionReceipt({ hash: txHash });

            if (receipt.status === 'reverted') {
                return { status: 'FAILED_TX', txHash, details: 'Transaction reverted' };
            }

            // check logs for ERC20 Transfer (topic0 = 0xddf252...)
            const hasTransferLogs = receipt.logs.some(l => l.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef');

            // We can also check tx value, but receipt doesn't have it conveniently without getTransaction.
            // For now, if success and logs -> likely ERC20. If success and no logs, maybe ETH transfer (need getTransaction to be sure, but we want to be fast).
            // Let's do getTransaction to be precise about ETH vs ERC20.

            const tx = await client.getTransaction({ hash: txHash });

            if (tx.value > 0n) {
                return { status: 'VERIFIED_ETH', txHash, details: `Value: ${tx.value.toString()} wei` };
            }

            if (hasTransferLogs) {
                return { status: 'VERIFIED_ERC20', txHash, details: 'ERC20 Transfer detected' };
            }

            // Success but no value/transfer? Logic execution only?
            // Allow it as valid interaction but maybe specific status if strictly reward? 
            // For now, if "sent reward" and tx success, we lean verified.
            return { status: 'UNVERIFIED', txHash, details: 'Tx successful but no value/transfer logs detected' };

        } catch (error: any) {
            // Likely not found or RPC error
            if (error.name === 'TransactionReceiptNotFoundError' || error.message?.includes('could not be found')) {
                console.log(`⚠️ Reward verification: Tx ${txHash} not yet mined or not found on Base.`);
            } else {
                console.log(`⚠️ Reward verification issue: ${error.message || 'Unknown RPC error'}`);
            }
            return { status: 'UNVERIFIED', txHash, details: 'RPC Error or Not Found' };
        }
    }
}
