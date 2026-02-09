import { Candidate } from './candidates';
import { BuilderConfidence } from '../agent/identity';

export type EvidenceGrade = 'A' | 'B' | 'C' | 'D';

export type CurationScore = {
    relevanceScore: number;    // 0-100: Ecosystem Value
    confidenceBps: number;     // 0-10000: Certainty
    shillRiskScore: number;    // 0-100: Spam Probability
    evidenceGrade: EvidenceGrade;
    reasonCodes: string[];
    passedLegacyThreshold: boolean;
    breakdown: {
        evidence: number;
        builder: number;
        content: number;
    };
};

export class ScoringEngine {
    static score(candidate: Candidate, builderConfidence: string): CurationScore {
        const reasons: string[] = [];
        const ev = candidate.evidence;

        // 1. Calculate Evidence Grade
        let grade: EvidenceGrade = 'D';
        const proofs = ev.externalProofCount;

        if (ev.repoUrls.length > 0 && (ev.demoUrls.length > 0 || ev.txHashes.length > 0)) {
            grade = 'A'; // Ultra Strong: Code + Live/Chain
        } else if (proofs >= 2) {
            grade = 'B'; // Strong: 2+ signals
        } else if (proofs >= 1) {
            grade = 'C'; // Weak: 1 signal
        }

        // Add Reason Codes
        if (ev.repoUrls.length > 0) reasons.push('HAS_REPO');
        if (ev.demoUrls.length > 0) reasons.push('HAS_DEMO_URL');
        if (ev.txHashes.length > 0 || ev.contractAddrs.length > 0) reasons.push('ONCHAIN_REF');
        if (candidate.type === 'REWARD') reasons.push('REWARD_CLAIM');

        // 2. Shill Risk (Heuristic)
        let shillRisk = 0;
        const textLen = candidate.cast.text.length;
        if (textLen < 50 && grade === 'C') shillRisk += 30;
        if (textLen < 50 && grade === 'D') shillRisk += 60;

        const emojis = (candidate.cast.text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) || []).length;
        if (emojis > 4) shillRisk += 20;
        if (textLen > 0 && (emojis / textLen) > 0.3) shillRisk += 40;

        if (shillRisk > 40) reasons.push('POSSIBLE_SHILL');
        if (grade === 'D') reasons.push('NO_EXTERNAL_PROOF');

        // 3. Relevance & Confidence - SOFT WEIGHTING
        let relevance = 0;
        let confidence = candidate.confidenceScore * 50;

        // Relevance based on Grade
        if (grade === 'A') relevance += 70;
        else if (grade === 'B') relevance += 50;
        else if (grade === 'C') relevance += 20;

        // Engagement Rescue
        const totalEng = ev.engagement.likes + ev.engagement.recasts + ev.engagement.replies;
        if (grade === 'D' && totalEng > 50) {
            relevance += 40;
            reasons.push('HIGH_ENGAGEMENT_RESCUE');
        } else if (grade === 'C' && totalEng > 30) {
            relevance += 15;
            reasons.push('ENGAGEMENT_BOOST');
        }

        // Builder Boosts
        if (builderConfidence === BuilderConfidence.PROVEN_BUILDER) {
            relevance += 25;
            confidence += 3000;
        } else if (builderConfidence === BuilderConfidence.ACTIVE_BUILDER) {
            relevance += 10;
            confidence += 1500;
        }

        // --- NEYNAR SCORE SOFT WEIGHTING (Truthful) ---
        const nScore = candidate.cast.neynarQ;
        const nStatus = candidate.cast.neynarQStatus;
        let multiplier = 1.0;

        if (nStatus === 'OK' && nScore !== undefined) {
            if (nScore >= 0.8) {
                multiplier = 1.05; // Boost
            } else if (nScore < 0.3) {
                multiplier = 0.90; // Dampen
                reasons.push('LOW_NEYNAR_SCORE');
            }
        }
        // If UNAVAILABLE, defaults to 1.0 (Neutral)

        relevance = relevance * multiplier;
        confidence = confidence * multiplier;

        // Penalties
        relevance -= (shillRisk * 1.0);

        // Normalize
        relevance = Math.max(0, Math.min(100, relevance));
        confidence = Math.max(0, Math.min(10000, confidence));
        shillRisk = Math.min(100, shillRisk);

        return {
            relevanceScore: Math.floor(relevance),
            confidenceBps: Math.floor(confidence),
            shillRiskScore: shillRisk,
            evidenceGrade: grade,
            reasonCodes: reasons,
            passedLegacyThreshold: relevance > 60,
            breakdown: {
                evidence: relevance,
                builder: builderConfidence === 'PROVEN' ? 25 : 0,
                content: 0
            }
        };
    }
}
