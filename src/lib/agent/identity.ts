import { prisma } from '@/lib/db';
import { SocialHandles } from '@/lib/types';
import { Builder } from '@prisma/client';

export enum BuilderConfidence {
    UNKNOWN = "UNKNOWN",
    NEW_BUILDER = "NEW_BUILDER",       // First verified signal
    ACTIVE_BUILDER = "ACTIVE_BUILDER", // Multiple apps or sustained updates
    PROVEN_BUILDER = "PROVEN_BUILDER"  // Shipping + Verified Rewards
}

export class IdentityResolver {

    static async resolveBuilder(handle: string): Promise<Builder> {
        const candidates = await prisma.builder.findMany();
        let builder = candidates.find(b => {
            const handles = JSON.parse(b.handles) as SocialHandles;
            return handles.farcaster?.toLowerCase() === handle.toLowerCase() ||
                handles.x?.toLowerCase() === handle.toLowerCase();
        });

        if (!builder) {
            const handles: SocialHandles = { farcaster: handle };
            builder = await prisma.builder.create({
                data: {
                    handles: JSON.stringify(handles),
                    wallets: JSON.stringify([]),
                    trustScore: 0.1,
                    confidenceLevel: BuilderConfidence.UNKNOWN
                }
            });
        }

        // Call update logic
        return await this.updateConfidence(builder);
    }

    // Exposed for re-calc after signals/rewards added
    static async updateConfidence(builder: Builder): Promise<Builder> {
        let newConfidence = builder.confidenceLevel;
        const wallets = JSON.parse(builder.wallets) as string[];

        const appCount = await prisma.app.count({ where: { builderId: builder.id } });
        const verifiedRewards = await prisma.rewardEvent.count({
            where: { builderId: builder.id, status: 'VERIFIED_PAID' }
        });

        if (verifiedRewards > 0) {
            newConfidence = BuilderConfidence.PROVEN_BUILDER;
        } else if (appCount > 1) {
            newConfidence = BuilderConfidence.ACTIVE_BUILDER;
        } else if (appCount === 1) {
            newConfidence = BuilderConfidence.NEW_BUILDER;
        } else {
            newConfidence = BuilderConfidence.UNKNOWN;
        }

        if (newConfidence !== builder.confidenceLevel) {
            builder = await prisma.builder.update({
                where: { id: builder.id },
                data: { confidenceLevel: newConfidence }
            });
        }
        return builder;
    }

    static async linkWallet(builderId: string, walletAddress: string) {
        const builder = await prisma.builder.findUnique({ where: { id: builderId } });
        if (!builder) throw new Error("Builder not found");

        const wallets = JSON.parse(builder.wallets) as string[];
        if (!wallets.includes(walletAddress)) {
            wallets.push(walletAddress);
            await prisma.builder.update({
                where: { id: builderId },
                data: { wallets: JSON.stringify(wallets) }
            });
        }
    }
}
