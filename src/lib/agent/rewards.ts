import { prisma } from '@/lib/db';
import { RewardStatus } from '@/lib/types';
import { checkTransfer, baseClient } from '@/lib/integrations/base';
import { IdentityResolver } from './identity';

export class RewardAgent {
    private static REWARD_KEYWORDS = [
        /sent \$?(\d+) USDC/i,
        /reward pool/i,
        /winners/i,
        /distributed/i
    ];

    static async processAnnouncement(text: string, authorHandle: string, timestamp: Date) {
        // 1. Detect Intent
        let amount = 0;
        const match = text.match(/sent \$?(\d+)/i);
        if (match) {
            amount = parseInt(match[1]);
        } else if (!this.REWARD_KEYWORDS.some(r => r.test(text))) {
            return null;
        }

        // 2. Resolve Payer
        const builder = await IdentityResolver.resolveBuilder(authorHandle);

        // DEDUPLICATION: Check if this announcement (builder + text) already exists roughly same time
        // We'll limit "duplicate announcement" to exact text match for this MVP to keep it simple but effective for run-agent-once loop
        const existing = await prisma.rewardEvent.findFirst({
            where: {
                builderId: builder.id,
                announcedText: text
            }
        });

        if (existing) {
            console.log(`Creation skipped: Duplicate announcement found for ${authorHandle}`);
            return existing;
        }

        const wallets = JSON.parse(builder.wallets) as string[];
        const payerWallet = wallets.length > 0 ? wallets[0] : "UNKNOWN";

        // 3. Create Event
        return await prisma.rewardEvent.create({
            data: {
                builderId: builder.id,
                announcedText: text,
                token: "USDC",
                announcedAmount: amount > 0 ? amount : null,
                windowStart: timestamp,
                windowEnd: new Date(timestamp.getTime() + 24 * 60 * 60 * 1000), // 24h window
                payerWallet: payerWallet,
                status: RewardStatus.ANNOUNCED_PENDING,
            }
        });
    }

    static async verifyPendingRewards() {
        const pending = await prisma.rewardEvent.findMany({
            where: { status: RewardStatus.ANNOUNCED_PENDING }
        });

        for (const reward of pending) {
            // DEMO OVERRIDE LOGIC
            if (process.env.CURATO_DEMO_VERIFIED_TX_HASH) {
                const demoHash = process.env.CURATO_DEMO_VERIFIED_TX_HASH.trim();
                console.log("⚠️ DEMO MODE ACTIVE: Checking hash", demoHash);

                // 1. Check if hash is already used by ANOTHER event (Uniqueness)
                const duplicateCheck = await prisma.rewardEvent.findUnique({
                    where: { verificationTxHash: demoHash }
                });

                if (duplicateCheck && duplicateCheck.id !== reward.id) {
                    console.warn(`❌ Demo Hash ${demoHash} already used by another event. Skipping to prevent duplicates.`);
                    continue;
                }

                // 2. Validate Format
                if (!/^0x[a-fA-F0-9]{64}$/.test(demoHash)) {
                    console.warn(`❌ Invalid Demo Hash Format: ${demoHash}`);
                    continue;
                }

                // 3. Verify on Chain
                try {
                    const tx = await baseClient.getTransaction({ hash: demoHash as `0x${string}` });
                    if (tx) {
                        console.log("✅ Demo Hash confirmed on chain.");
                        await prisma.rewardEvent.update({
                            where: { id: reward.id },
                            data: {
                                status: RewardStatus.VERIFIED_PAID,
                                verificationTxHash: demoHash,
                                matchedTxs: JSON.stringify([{ hash: demoHash }])
                            }
                        });
                        continue;
                    } else {
                        console.warn(`❌ Demo Hash not found on Base: ${demoHash}`);
                    }
                } catch (error) {
                    console.error(`❌ Failed to fetch demo tx:`, error);
                    continue;
                }
            }

            // --- Standard Logic ---
            if (!reward.payerWallet || reward.payerWallet === "UNKNOWN") {
                const now = new Date();
                if (now > reward.windowEnd) {
                    await prisma.rewardEvent.update({
                        where: { id: reward.id },
                        data: { status: RewardStatus.ANNOUNCED_NOT_PAID }
                    });
                }
                continue;
            }

            if (!reward.announcedAmount) continue;

            const result = await checkTransfer(
                reward.payerWallet,
                reward.announcedAmount,
                reward.windowStart,
                reward.windowEnd
            );

            if (result.matched) {
                // Uniqueness check for real flow
                const duplicateCheck = await prisma.rewardEvent.findUnique({
                    where: { verificationTxHash: result.txHash }
                });
                if (duplicateCheck && duplicateCheck.id !== reward.id) {
                    console.warn("Real tx hash already linked. Skipping.");
                    continue;
                }

                await prisma.rewardEvent.update({
                    where: { id: reward.id },
                    data: {
                        status: RewardStatus.VERIFIED_PAID,
                        verificationTxHash: result.txHash,
                        matchedTxs: JSON.stringify([{ hash: result.txHash }])
                    }
                });
            } else {
                const now = new Date();
                if (now > reward.windowEnd) {
                    await prisma.rewardEvent.update({
                        where: { id: reward.id },
                        data: { status: RewardStatus.ANNOUNCED_NOT_PAID }
                    });
                }
            }
        }
    }
}
