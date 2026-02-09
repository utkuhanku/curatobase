import { CurationStatus } from '../types';
import { Candidate } from './candidates';
import { RewardStatus } from './rewards';

export interface PromotionContext {
    seenCount: number;
    uniqueRepliers: number;
    hasDemo: boolean;
    hasRepo: boolean;
    rewardStatus: RewardStatus;
    onchainProof?: boolean; // Added optional for Prestige calculation
    totalCandidates: number;
}

export interface PromotionResult {
    status: CurationStatus;
    ready: boolean;
    reasons: string[];
    missing: string[];
    score: number;
}

export class PromotionEngine {

    static enforceQuotas(inputs: { id: string, result: PromotionResult }[]): Map<string, CurationStatus> {
        const finalStatuses = new Map<string, CurationStatus>();
        let prestigeCount = 0;
        let topPickCount = 0;

        // Sort by score descending to prioritize best candidates
        const sorted = [...inputs].sort((a, b) => b.result.score - a.result.score);

        for (const item of sorted) {
            if (item.result.status === CurationStatus.CURATED && prestigeCount < 1) {
                finalStatuses.set(item.id, CurationStatus.CURATED);
                prestigeCount++;
            } else if ((item.result.status === CurationStatus.CURATED || item.result.status === CurationStatus.TOP_PICK) && topPickCount < 2) {
                finalStatuses.set(item.id, CurationStatus.TOP_PICK);
                topPickCount++;
            } else {
                // Downgrade overflow
                finalStatuses.set(item.id, CurationStatus.WATCHLIST);
            }
        }
        return finalStatuses;
    }

    static evaluate(candidate: Candidate, ctx: PromotionContext): PromotionResult {
        const reasons: string[] = [];
        const missing: string[] = [];
        let score = 0;

        // --- BLOCK 1: TIME (Age/Repetition) ---
        const isTimeReady = ctx.seenCount >= 3;
        if (isTimeReady) {
            reasons.push("DEEP_TIME");
            score += 30;
        } else {
            missing.push("TIME_MATURITY");
        }

        // --- BLOCK 2: ENGAGEMENT (Quality) ---
        const isEngagementReady = ctx.uniqueRepliers >= 3;
        if (isEngagementReady) {
            reasons.push("DEEP_ENGAGEMENT");
            score += 40;
        } else {
            missing.push("ENGAGEMENT_DEPTH");
        }

        // --- BLOCK 3: PROOF (Existence) ---
        const hasExternalProof = ctx.hasDemo || ctx.hasRepo || ctx.rewardStatus !== 'NONE';
        if (hasExternalProof) {
            reasons.push("EXTERNAL_PROOF");
            score += 30;
        } else {
            missing.push("PROOF_OF_WORK");
        }

        // --- BLOCK 4: VERIFIED PROOF (Truth) ---
        const isRewardVerified = ctx.rewardStatus === 'VERIFIED_ETH' || ctx.rewardStatus === 'VERIFIED_ERC20';
        const isBuilderVerified = ctx.hasRepo;
        const isVerified = isRewardVerified || isBuilderVerified;

        if (isVerified) {
            reasons.push("VERIFIED_SIGNAL");
            score += 50;
        }

        // --- DETERMINE STATUS ---
        // PRESTIGE Check (Strict)
        let prestigePoints = 0;
        if (isVerified) prestigePoints++;
        if (ctx.hasRepo) prestigePoints++;
        if (ctx.seenCount >= 5) prestigePoints++;
        if (ctx.uniqueRepliers >= 5) prestigePoints++;

        // Status Logic
        let status = CurationStatus.WATCHLIST; // Default baseline if proof exists
        let ready = false;

        // TOP PICK Requirements: (Time OR Engagement) AND Proof
        const isTopPick = (isTimeReady || isEngagementReady) && hasExternalProof;

        if (prestigePoints >= 2 && isTopPick) {
            status = CurationStatus.CURATED;
            ready = true;
        } else if (isTopPick) {
            status = CurationStatus.TOP_PICK;
            ready = true;
        } else if (!hasExternalProof) {
            status = CurationStatus.IGNORED;
        } else if (ctx.uniqueRepliers === 0) {
            status = CurationStatus.SILENCE;
        }

        return {
            status,
            ready,
            reasons,
            missing,
            score
        };
    }
}
