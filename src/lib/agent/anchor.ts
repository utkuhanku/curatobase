import { createWalletClient, http, publicActions, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

const ANCHOR_ABI = parseAbi([
    'function anchor(string castHash, uint8 verdict, uint16 confidenceBps, string verificationHash, string version) external',
    'event SignalAnchored(string indexed castHash, uint8 verdict, uint16 confidenceBps, string verificationHash, string version, uint256 timestamp)'
]);

// Use a placeholder address if not deployed yet
const DEFAULT_CONTRACT = "0x0000000000000000000000000000000000000000";

export class SignalAnchor {
    static async anchorState(
        castHash: string,
        verdict: number, // 0=IGNORE, 1=WATCHLIST, 2=CURATED
        confidenceBps: number,
        verificationHash: string = "",
        version: string = "v1.0"
    ): Promise<string> {
        const pk = process.env.AGENT_PRIVATE_KEY;
        const contractAddr = process.env.NEXT_PUBLIC_ANCHOR_CONTRACT || DEFAULT_CONTRACT;

        if (!pk || !pk.startsWith('0x')) {
            console.log(`⚠️ Mock Anchor: Env var AGENT_PRIVATE_KEY not set or invalid.`);
            console.log(`   Would anchor cast: ${castHash.slice(0, 8)} verdict=${verdict} conf=${confidenceBps}`);
            return "0xMOCK_ANCHOR_HASH_" + Date.now();
        }

        try {
            const account = privateKeyToAccount(pk as `0x${string}`);
            const client = createWalletClient({
                account,
                chain: base,
                transport: http()
            }).extend(publicActions);

            console.log(`⚓ Anchoring signal on-chain...`);
            const hash = await client.writeContract({
                address: contractAddr as `0x${string}`,
                abi: ANCHOR_ABI,
                functionName: 'anchor',
                args: [castHash, verdict, confidenceBps, verificationHash, version]
            });

            console.log(`✅ Signal Anchored: ${hash}`);
            return hash;
        } catch (error) {
            console.error("❌ Anchor failed:", error);
            return "0xFAILED_ANCHOR_" + Date.now();
        }
    }
}
