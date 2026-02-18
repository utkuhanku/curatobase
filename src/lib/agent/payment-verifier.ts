import { createPublicClient, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';

const REVENUE_CONTRACT = process.env.REVENUE_CONTRACT_ADDRESS as `0x${string}`;
const SIGNAL_PRICE_ETH = 0.0001; // $0.30 - Low barrier to entry

if (!REVENUE_CONTRACT) {
    throw new Error("REVENUE_CONTRACT_ADDRESS not set");
}

const client = createPublicClient({
    chain: base,
    transport: http(process.env.BASE_RPC_URL)
});

export type PaymentStatus =
    | { status: 'PAID'; amount: number; sender: string }
    | { status: 'INVALID'; reason: string }
    | { status: 'PENDING' };

export async function verifyPayment(txHash: string): Promise<PaymentStatus> {
    try {
        const receipt = await client.getTransactionReceipt({
            hash: txHash as `0x${string}`
        });

        if (!receipt) return { status: 'INVALID', reason: 'Transaction not found' };
        if (receipt.status === 'reverted') return { status: 'INVALID', reason: 'Transaction reverted' };

        // 1. Direct Recipient Check
        const isDirectPayment = receipt.to?.toLowerCase() === REVENUE_CONTRACT.toLowerCase();

        // 2. Log Check (If verified via Event)
        // We look for PaymentReceived(address sender, uint256 amount)
        // Topic0 for PaymentReceived(address,uint256)
        // This is optional if direct check works, but better for internal txs

        const tx = await client.getTransaction({ hash: txHash as `0x${string}` });
        const valueInEth = Number(tx.value) / 1e18;

        if (isDirectPayment) {
            if (valueInEth >= SIGNAL_PRICE_ETH) {
                // Check TTL (24 hours)
                const currentBlock = await client.getBlock();
                const txBlock = await client.getBlock({ blockHash: receipt.blockHash });
                const ageSeconds = Number(currentBlock.timestamp) - Number(txBlock.timestamp);

                if (ageSeconds > 86400) {
                    return { status: 'INVALID', reason: 'Payment expired (>24h)' };
                }

                return { status: 'PAID', amount: valueInEth, sender: tx.from };
            } else {
                return { status: 'INVALID', reason: `Insufficient amount. Sent: ${valueInEth}, Required: ${SIGNAL_PRICE_ETH}` };
            }
        }

        return { status: 'INVALID', reason: 'Receiver mismatch' };

    } catch (error) {
        console.error("Payment verification failed:", error);
        return { status: 'INVALID', reason: 'Verification error' };
    }
}

export function getPaymentHeaders() {
    return {
        'X-Wallet-Address': REVENUE_CONTRACT,
        'X-Price': `${SIGNAL_PRICE_ETH} ETH`,
        'X-Builder-Code': 'curatobase.eth',
        'X-Payment-Instruction': `Send ${SIGNAL_PRICE_ETH} ETH to ${REVENUE_CONTRACT} on Base Mainnet. Retry request with 'x-payment-tx' header.`
    };
}
