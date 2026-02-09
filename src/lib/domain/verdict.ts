import { CurationScore } from './scoring';
import { Candidate } from './candidates';
import { BuilderConfidence } from '../agent/identity';
import { CurationStatus } from '../types';

export type Verdict = {
    status: CurationStatus;
    text: string;
    actionTags: string[];
};

export class VerdictEngine {
    static decide(candidate: Candidate, score: CurationScore, builderConfidence: string): Verdict {
        const actions: string[] = [];
        let status = CurationStatus.WATCHLIST;

        // --- PROOF STRINGS ---
        const hasDemo = candidate.evidence.demoUrls.length > 0 || candidate.evidence.tags.includes("BASEAPP_URL_DETECTED");
        const hasRepo = candidate.evidence.repoUrls.length > 0;
        const hasOnchain = candidate.evidence.contractAddrs.length > 0;
        const isRescue = score.reasonCodes.includes('HIGH_ENGAGEMENT_RESCUE');

        // Reward string is tricky here without cycle context (which has appFacts), 
        // but we can infer from candidate evidence.
        const isRewardClaim = /sent|pay|grant|reward/i.test(candidate.cast.text);
        let rewardStr = "NONE";
        if (isRewardClaim) {
            if (candidate.evidence.txHashes.length > 0) rewardStr = "CLAIM_TC_PRES"; // Tx Present (verified in cycle)
            else rewardStr = "CLAIM_NO_TX";
        }

        const proofSummary = `Proof summary: demo=${hasDemo ? 'YES' : 'NO'}, repo=${hasRepo ? 'YES' : 'NO'}, reward=${rewardStr}, onchain=${hasOnchain ? 'YES' : 'NO'}.`;

        // --- GATE 2: SHILL DEFENSE (Spam) ---
        if (score.shillRiskScore >= 80 && (score.evidenceGrade === 'C' || score.evidenceGrade === 'D')) {
            return {
                status: CurationStatus.IGNORED,
                text: `Ignored due to high shill risk (${score.shillRiskScore}).`,
                actionTags: []
            };
        }

        // --- GATE 1: PROOF & RESCUE ---
        const proofCount = candidate.evidence.externalProofCount;

        // Zero proof is IGNORED (unless viral rescue)
        if (proofCount === 0 && !isRescue) {
            return {
                status: CurationStatus.IGNORED,
                text: "Ignored. Zero external proof and no viral rescue signal.",
                actionTags: []
            };
        }

        // --- ENGAGEMENT GATES (SILENCE Logic) ---
        const eng = candidate.evidence.engagement;
        const totalEng = eng.likes + eng.recasts + eng.replies;
        const hasReplies = eng.replies > 0; // Organic signal proxy

        // --- CLASSIFICATION ---

        // REWARD Logic
        if (candidate.type === "REWARD" && candidate.evidence.txHashes.length > 0) {
            actions.push("VERIFY_ONCHAIN");
            status = CurationStatus.CURATED;
            // We return proof summary as text base? 
        }
        // SHIP Logic
        else if (candidate.type === "SHIP") {

            // SILENCE GATE: Valid proof but zero engagement
            if (totalEng === 0) {
                return {
                    status: CurationStatus.SILENCE,
                    text: `Valid signal detected (Silence). ${proofSummary}`,
                    actionTags: ["ZERO_ENGAGEMENT"]
                };
            }

            // At this point: Proof >= 1 (or Rescue) AND Engagement > 0

            // CURATED REQUIREMENTS 
            const isGradeA = score.evidenceGrade === 'A';
            const isStrongB = score.evidenceGrade === 'B' && proofCount >= 2;
            const passesRelevance = score.relevanceScore >= 75;

            if ((isGradeA || isStrongB) && passesRelevance && hasReplies) {
                status = CurationStatus.CURATED;
                actions.push("ANCHOR");
            } else {
                status = CurationStatus.WATCHLIST;

                // WATCHLIST TIERING
                if (score.relevanceScore >= 60 || isRescue) {
                    actions.push("WATCHLIST_TOP");
                } else if (!hasReplies) {
                    actions.push("LOW_ENGAGEMENT");
                }
            }
        }
        // FALLBACK
        else {
            if (candidate.confidenceScore > 30) {
                status = CurationStatus.WATCHLIST;
                actions.push("CLASSIFICATION_FALLBACK");
            } else {
                status = CurationStatus.IGNORED;
                return { status, text: "Ignored. Low confidence.", actionTags: [] };
            }
        }

        return { status, text: proofSummary, actionTags: actions };
    }
}
