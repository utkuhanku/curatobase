export type BuilderID = string;
export type AppID = string;

export enum CurationStatus {
    CURATED = "CURATED", // Prestige
    TOP_PICK = "TOP_PICK", // Promotion Ready
    WATCHLIST = "WATCHLIST",
    SILENCE = "SILENCE",
    IGNORED = "IGNORED",
    CANDIDATE = "CANDIDATE"
}

export enum RewardStatus {
    VERIFIED_PAID = "VERIFIED_PAID",
    ANNOUNCED_PENDING = "ANNOUNCED_PENDING",
    ANNOUNCED_NOT_PAID = "ANNOUNCED_NOT_PAID",
    CONSISTENT_PAYER = "CONSISTENT_PAYER"
}

export interface SocialHandles {
    farcaster?: string;
    x?: string;
}

export interface AppUrls {
    baseApp?: string;
    website?: string;
    repo?: string;
}
