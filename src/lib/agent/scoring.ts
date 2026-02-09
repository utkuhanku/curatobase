import { App, Builder } from '@prisma/client';
import { CurationStatus } from '@/lib/types';

interface ScoreBreakdown {
    authenticity: number;
    effort: number;
    proof: number;
    traction: number;
    novelty: number;
}

interface ScoreResult {
    total: number;
    breakdown: ScoreBreakdown;
    status: string; // CurationStatus string
    reasons: string[];
}

export class CurationScoring {
    static calculateScore(app: App, builder: Builder, signalText: string): ScoreResult {
        let reasons: string[] = [];
        let breakdown: ScoreBreakdown = {
            authenticity: 0,
            effort: 0,
            proof: 0,
            traction: 0,
            novelty: 0
        };

        const appUrls = JSON.parse(app.urls) as { baseApp?: string, website?: string, repo?: string };
        const matches = (signalText || "").match(/http/g);
        const linkCount = matches ? matches.length : 0;

        // --- 1. Authenticity (0-30) ---
        // Builder trust is the baseline
        breakdown.authenticity = Math.min(30, builder.trustScore * 30);

        // Anti-spam: Duplicate check would happen before this or via DB query. 
        // Here we check for "low effort" patterns.
        // If text is extremely short (< 10 chars) and has links -> suspicious
        if (signalText.length < 15 && linkCount > 0) {
            breakdown.authenticity -= 10;
            reasons.push("Low effort text");
        }

        if (breakdown.authenticity > 20) reasons.push("Trusted Builder");

        // --- 2. Effort (0-20) ---
        // Length check
        if (signalText.length > 50) breakdown.effort += 5;
        if (signalText.length > 150) {
            breakdown.effort += 10;
            reasons.push("Detailed Description");
        }

        // Link count guardrail (Link farm check)
        if (linkCount >= 3 && signalText.length < 50) {
            breakdown.effort -= 10;
            reasons.push("Link Spam Detected");
        }

        // --- 3. Proof (0-40) ---
        if (appUrls.baseApp) {
            breakdown.proof += 40;
            reasons.push("Verified Base App");
        } else if (appUrls.website) {
            breakdown.proof += 20;
            reasons.push("Has Website/Demo");
        } else if (appUrls.repo) {
            breakdown.proof += 20;
            reasons.push("Open Source Repo");
        }

        // --- 4. Traction (0-10) --- (Placeholder for MVP)
        // In full version, we'd check likes/replies
        breakdown.traction = 0;

        // --- HARD GUARDRAILS ---
        let total = breakdown.authenticity + breakdown.effort + breakdown.proof + breakdown.traction + breakdown.novelty;

        // Guardrail 1: Ship event must have score >= 15
        if (total < 15) {
            total = 15;
            reasons.push("Baseline Ship Score");
        }

        // Guardrail 2: Links present -> min 35
        if ((appUrls.baseApp || appUrls.website || appUrls.repo) && total < 35) {
            total = 35;
            reasons.push("Link Bonus");
        }

        // Clamp total
        total = Math.min(100, Math.max(0, total));

        // Thresholds
        let status = CurationStatus.IGNORED;
        if (total >= 70) {
            status = CurationStatus.CURATED;
        } else if (total >= 35) { // Lowered watchlist threshold to capture new legitimate apps
            status = CurationStatus.WATCHLIST;
        }

        return { total, breakdown, status, reasons };
    }
}
