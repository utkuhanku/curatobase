import { Signal, Builder } from '@prisma/client';
import { prisma } from '@/lib/db';
import { CurationStatus } from '@/lib/types';
import { CurationScoring } from './scoring';
import { IdentityResolver, BuilderConfidence } from './identity';

export class DiscoveryAgent {
    private static SHIP_KEYWORDS = [
        /shipped/i, /launched/i, /live on base/i, /built on base/i,
        /just deployed/i, /new app/i, /v1 is live/i, /major update/i,
        /check out my/i
    ];

    static calculateIntentScore(text: string): number {
        let score = 0;
        for (const regex of this.SHIP_KEYWORDS) {
            if (regex.test(text)) score += 30;
        }
        const urlCount = (text.match(/https?:\/\/[^\s]+/g) || []).length;
        if (urlCount > 0) score += 20;
        return Math.max(0, Math.min(100, score));
    }

    // CORE LOGIC: Curator Verdict Generation (Aligned)
    static generateCuratorVerdict(
        scoreResult: any,
        appUrls: any,
        builder: Builder,
        verifiedRewardsCount: number
    ): string {
        const breakdown = scoreResult.breakdown;
        const confidence = builder.confidenceLevel;

        const hasBaseApp = !!appUrls.baseApp;
        const hasRepo = !!appUrls.repo;
        const hasWebsite = !!appUrls.website;
        const isHighEffort = breakdown.effort > 15;

        // Evidence string
        let evidence = "";
        if (hasBaseApp) evidence = "a live Base App";
        else if (hasRepo) evidence = "open source code";
        else if (hasWebsite) evidence = "a functional demo";
        else evidence = "shipping intent";

        // 1. PROVEN BUILDER Logic
        if (confidence === BuilderConfidence.PROVEN_BUILDER) {
            if (verifiedRewardsCount > 0) {
                return `Proven builder reinforcing the ecosystem with on-chain rewards and ${evidence}.`;
            }
            return `Consistent shipper demonstrating sustained commitment with ${evidence}.`;
        }

        // 2. ACTIVE BUILDER Logic
        if (confidence === BuilderConfidence.ACTIVE_BUILDER) {
            if (hasBaseApp) {
                return `Building momentum with repeated shipping. Just deployed ${evidence} showing credible iteration.`;
            }
            return `Active builder consistently shipping updates. Latest signal is ${evidence}.`;
        }

        // 3. NEW BUILDER (First Signal) Logic
        if (confidence === BuilderConfidence.NEW_BUILDER || confidence === BuilderConfidence.UNKNOWN) {
            if (hasBaseApp || hasRepo) {
                return `First strong proof detected. New builder shipping ${evidence}. Worth watching.`;
            }
            return `Early signal detected. emerging builder showing ${evidence}.`;
        }

        return "Signal detected.";
    }

    static async processSignal(signalData: {
        source: string;
        type: string;
        rawText: string;
        authorHandle: string;
        timestamp: Date;
        urls: string[];
    }) {
        const intentScore = this.calculateIntentScore(signalData.rawText);
        if (intentScore < 20) return null;

        if (!signalData.authorHandle) return null;
        const builder = await IdentityResolver.resolveBuilder(signalData.authorHandle);

        let app = await prisma.app.findFirst({
            where: { builderId: builder.id }
        });

        if (!app) {
            app = await prisma.app.create({
                data: {
                    builderId: builder.id,
                    name: `Project by @${signalData.authorHandle}`,
                    description: signalData.rawText.slice(0, 200),
                    urls: JSON.stringify({
                        website: signalData.urls[0] || undefined,
                    }),
                    status: CurationStatus.WATCHLIST,
                    curationScore: 0,
                }
            });
        }

        await prisma.signal.create({
            data: {
                ...signalData,
                urls: JSON.stringify(signalData.urls),
                linkedAppId: app.id
            }
        });

        // Recalculate context for verdict
        const verifiedRewardsCount = await prisma.rewardEvent.count({
            where: { builderId: builder.id, status: 'VERIFIED_PAID' }
        });

        const scoreResult = CurationScoring.calculateScore(app, builder, signalData.rawText);

        // Promote logic: If PROVEN builder + High Score -> Force CURATED?
        // User asked to promote high-proof drops from PROVEN builders.
        if (builder.confidenceLevel === BuilderConfidence.PROVEN_BUILDER && scoreResult.total > 30) {
            scoreResult.status = CurationStatus.CURATED;
        }

        const agentInsight = this.generateCuratorVerdict(scoreResult, JSON.parse(app.urls), builder, verifiedRewardsCount);

        await prisma.app.update({
            where: { id: app.id },
            data: {
                curationScore: scoreResult.total,
                scoreBreakdown: JSON.stringify(scoreResult.breakdown),
                status: scoreResult.status,
                reasons: JSON.stringify(scoreResult.reasons),
                lastEventAt: signalData.timestamp,
                agentInsight: agentInsight
            }
        });

        return { ...app, curationScore: scoreResult.total, status: scoreResult.status, reasons: scoreResult.reasons, agentInsight };
    }
}
