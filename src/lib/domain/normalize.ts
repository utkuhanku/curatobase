
export type EngagementSnapshot = {
    likes: number;
    recasts: number;
    replies: number;
};

export type NormalizedCast = {
    castHash: string;
    authorFid: number | undefined;
    authorUsername: string | undefined;
    authorProfileUrl: string;

    // Neynar Q (Truthful)
    neynarQ?: number; // Raw score if present
    neynarQStatus: "OK" | "UNAVAILABLE";

    timestamp: Date;
    text: string;
    embeds: string[];
    mentions: string[];
    channelId?: string;
    source: string;

    // Source URL (Bulletproof)
    sourceUrl?: string;
    // Granular Status
    sourceUrlStatus: "OK" | "FIELD_ABSENT" | "FALLBACK_USED" | "MISSING_CAST_HASH" | "MISSING_USERNAME" | "MISSING_KEYS";

    engagementSnapshot?: EngagementSnapshot;
};

export class CastNormalizer {
    static normalize(neynarCast: any, sourceTag: string = "feed"): NormalizedCast {
        const embeds: string[] = [];
        if (neynarCast.embeds) {
            neynarCast.embeds.forEach((e: any) => {
                if (e.url) embeds.push(e.url);
            });
        }

        // 1. Strict Primitive Extraction
        const rawHash = neynarCast.hash || neynarCast.castHash || undefined;
        const author = neynarCast.author || {};
        const rawUsername = author.username || neynarCast.authorUsername || undefined;
        // Note: rawUsername might be explicitly null/undefined if absent
        const rawFid = author.fid || neynarCast.authorFid || undefined;

        // 2. Canonical URL Logic & Status
        let sourceUrl: string | undefined = undefined;
        let sourceUrlStatus: "OK" | "FIELD_ABSENT" | "FALLBACK_USED" | "MISSING_CAST_HASH" | "MISSING_USERNAME" | "MISSING_KEYS" = "FIELD_ABSENT";

        if (neynarCast.warpcast_url || neynarCast.sourceUrl) {
            sourceUrl = neynarCast.warpcast_url || neynarCast.sourceUrl;
            sourceUrlStatus = "OK";
        } else {
            // Check Primitives for Fallback
            if (rawHash) {
                if (rawUsername && rawUsername !== "unknown" && !rawUsername.includes("undefined")) {
                    // Have Hash + Username -> Build Fallback
                    const hashPrefix = rawHash.startsWith('0x') ? rawHash.slice(0, 10) : rawHash.slice(0, 10);
                    // Use 10 chars (0x + 8 hex) or just First 10. Warpcast uses 0x + 8 usually?
                    // Actually standard is full hash or prefix. Let's use what we have.
                    sourceUrl = `https://warpcast.com/${rawUsername}/${hashPrefix}`;
                    sourceUrlStatus = "FALLBACK_USED";
                } else {
                    // Have Hash, Missing Username
                    sourceUrlStatus = "MISSING_USERNAME";
                }
            } else {
                // Missing Hash entirely
                if (!rawUsername) sourceUrlStatus = "MISSING_KEYS"; // Both missing
                else sourceUrlStatus = "MISSING_CAST_HASH"; // Username exists, hash missing
            }
        }

        // Neynar Score Extraction (Truthful)
        const rawScore = author.experimental?.neynar_user_score ??
            author.score ??
            undefined;

        let neynarQ: number | undefined = undefined;
        let neynarQStatus: "OK" | "UNAVAILABLE" = "UNAVAILABLE";

        if (typeof rawScore === 'number') {
            neynarQ = rawScore;
            if (neynarQ > 1.0 && neynarQ <= 100) neynarQ = neynarQ / 100.0;
            neynarQStatus = "OK";
        } else if (neynarCast.neynarQ !== undefined) {
            neynarQ = neynarCast.neynarQ;
            neynarQStatus = neynarCast.neynarQStatus || "OK";
        }

        return {
            castHash: rawHash || "", // Return empty string status logic handled above
            authorFid: rawFid,
            authorUsername: rawUsername,
            authorProfileUrl: rawUsername ? `https://warpcast.com/${rawUsername}` : "",

            neynarQ,
            neynarQStatus,

            timestamp: new Date(neynarCast.timestamp || Date.now()),
            text: neynarCast.text || "",
            embeds: embeds,
            mentions: neynarCast.mentioned_profiles?.map((p: any) => p.username) || [],
            channelId: neynarCast.channel?.id || neynarCast.parent_url,
            source: sourceTag,

            sourceUrl,
            sourceUrlStatus,

            engagementSnapshot: {
                likes: neynarCast.reactions?.likes_count ?? neynarCast.likes ?? 0,
                recasts: neynarCast.reactions?.recasts_count ?? neynarCast.recasts ?? 0,
                replies: neynarCast.replies?.count ?? neynarCast.replies ?? 0
            }
        };
    }
}
