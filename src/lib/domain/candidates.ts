import { NormalizedCast } from './normalize';

export enum CandidateType {
    SHIP = "SHIP",
    REWARD = "REWARD",
    OTHER = "OTHER"
}

export type Evidence = {
    repoUrls: string[];
    demoUrls: string[];
    txHashes: string[];
    contractAddrs: string[];
    threadDepth: number;
    engagement: { likes: number; recasts: number; replies: number; };
    authorSignals: { priorShips: number; priorRewards: number; };
    isAnnouncement: boolean;
    rewardAmount?: string;
    rewardToken?: string;
    externalProofCount: number;

    // BaseApp Context
    appKey?: string;
    appUrl?: string;

    // Explicit Tags for Debugging/Logic
    tags: string[];
};

export type Candidate = {
    cast: NormalizedCast;
    type: CandidateType;
    evidence: Evidence;
    confidenceScore: number;
};

export class CandidateClassifier {

    // Lists for Validation
    static LISTS = {
        REPO_HOSTS: ['github.com', 'gitlab.com', 'bitbucket.org', 'codeberg.org'],
        DEMO_DENY: [
            'imgur.com', 'giphy.com', 'tenor.com', 'cloudinary.com', 'amazonaws.com',
            'warpcast.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com', 't.me', 'telegram.org',
            'youtube.com', 'youtu.be', 'twitch.tv', 'tiktok.com', 'discord.gg', 'discord.com',
            'basescan.org', 'etherscan.io', 'optimistic.etherscan.io'
        ]
    };

    static PATTERNS = {
        TX_HASH: /0x[a-fA-F0-9]{64}/g,
        CONTRACT: /0x[a-fA-F0-9]{40}/g,
        URL: /https?:\/\/[^\s]+/g,
        SHIP_KEYWORDS: [/market/i, /shipped/i, /launch/i, /live/i, /check out/i, /built on base/i, /frame/i],
        REWARD_KEYWORDS: [/sent/i, /distributed/i, /pay/i, /usdc/i, /eth/i, /grant/i],
        // BaseApp Pattern: matches base.app/app/slug
        BASE_APP: /https?:\/\/([^/]*base\.app)\/app\/([a-zA-Z0-9-_]+)/i
    };

    static classify(cast: NormalizedCast): Candidate {
        const text = cast.text.toLowerCase();

        // 1. EXTRACT ALL URLs
        const embedUrls = (cast.embeds || []).map((e: any) => e.url).filter((u: any) => typeof u === 'string');
        const rawUrls = ((cast.text.match(this.PATTERNS.URL) || []) as string[]).concat(embedUrls);

        // 2. VALIDATE REPOS (Allowlist)
        const repoUrls = rawUrls.filter(u => {
            const lower = u.toLowerCase();
            return this.LISTS.REPO_HOSTS.some(host => lower.includes(host));
        });

        // 3. VALIDATE DEMOS (Everything else minus Denylist & Media)
        const demoUrls = rawUrls.filter(u => {
            const lower = u.toLowerCase();
            if (this.LISTS.REPO_HOSTS.some(host => lower.includes(host))) return false;
            if (this.LISTS.DEMO_DENY.some(host => lower.includes(host))) return false;
            if (u.match(/\.(jpg|png|gif|mp4|webp|svg|mov)$/i)) return false;
            return true;
        });

        // 4. ONCHAIN
        const txHashes = (cast.text.match(this.PATTERNS.TX_HASH) || []);
        const contractAddrs = (cast.text.match(this.PATTERNS.CONTRACT) || []);

        // 5. BASE APP DETECTION
        let appKey: string | undefined = undefined;
        let appUrl: string | undefined = undefined;
        const tags: string[] = [];

        // Scan raw URLs for pattern
        for (const u of rawUrls) {
            const match = u.match(this.PATTERNS.BASE_APP);
            if (match) {
                // match[1] = hostname (e.g. www.base.app)
                // match[2] = slug (e.g. cool-app)
                appUrl = u;
                tags.push("BASEAPP_URL_DETECTED");

                // Key = hostname + slug (normalized)
                const host = match[1].toLowerCase().replace('www.', ''); // strip www
                const slug = match[2].toLowerCase();
                appKey = `${host}/app/${slug}`;
                break; // Take first one found
            }
        }

        const evidence: Evidence = {
            repoUrls: [...new Set(repoUrls)],
            demoUrls: [...new Set(demoUrls)],
            txHashes: [...new Set(txHashes)],
            contractAddrs: [...new Set(contractAddrs)],
            threadDepth: 0,
            engagement: {
                likes: cast.engagementSnapshot?.likes || 0,
                recasts: cast.engagementSnapshot?.recasts || 0,
                replies: cast.engagementSnapshot?.replies || 0
            },
            authorSignals: { priorShips: 0, priorRewards: 0 },
            isAnnouncement: false,
            externalProofCount: 0,

            // App Context
            appKey,
            appUrl,
            tags
        };

        evidence.externalProofCount =
            evidence.repoUrls.length +
            evidence.demoUrls.length +
            evidence.txHashes.length +
            evidence.contractAddrs.length;

        // Determine Type
        let type = CandidateType.OTHER;
        let score = 0;

        // Reward Logic
        const isRewardText = this.PATTERNS.REWARD_KEYWORDS.some(r => r.test(text)) && /usdc|eth/.test(text);
        if (isRewardText || (text.includes("sent") && evidence.txHashes.length > 0)) {
            if (text.includes("sent") && evidence.txHashes.length > 0) {
                type = CandidateType.REWARD;
                evidence.isAnnouncement = true;
                score = 65;
                const amountMatch = text.match(/sent\s+(\d+)\s+(usdc|eth)/i);
                if (amountMatch) {
                    evidence.rewardAmount = amountMatch[1];
                    evidence.rewardToken = amountMatch[2].toUpperCase();
                }
            }
        }

        // Ship Logic
        if (type === CandidateType.OTHER) {
            const isShipText = this.PATTERNS.SHIP_KEYWORDS.some(k => k.test(text));
            const hasProof = evidence.repoUrls.length > 0 || evidence.demoUrls.length > 0;
            const hasBaseApp = tags.includes("BASEAPP_URL_DETECTED");

            // BaseApp presence is strong proof of Ship
            if (hasBaseApp) {
                type = CandidateType.SHIP;
                evidence.isAnnouncement = true;
                score = 60;
            } else if (hasProof || (isShipText && evidence.contractAddrs.length > 0)) {
                type = CandidateType.SHIP;
                evidence.isAnnouncement = true;
                score = 50;
            }
        }

        return {
            cast,
            type,
            evidence,
            confidenceScore: score
        };
    }
}
