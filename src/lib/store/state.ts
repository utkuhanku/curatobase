import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'agent_state.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

type AuthorStats = {
    shipCount: number;
    lastShipTs: number;
    shipHistory: number[]; // Array of timestamps
};

// NEW: App Context Memory
type AppStats = {
    seenCount: number;
    lastSeenAt: number;
    lastCastHash?: string;
};

type AgentState = {
    seenCasts: Record<string, boolean>;
    anchoredCasts: Record<string, string>; // castHash -> txHash
    publishedCycles: Record<string, string>; // dateKey -> status
    authorStats: Record<string, AuthorStats>;
    appStats: Record<string, AppStats>; // appKey -> stats
};

export class StateStore {
    private static state: AgentState = {
        seenCasts: {},
        anchoredCasts: {},
        publishedCycles: {},
        authorStats: {},
        appStats: {}
    };

    static load() {
        if (fs.existsSync(STATE_FILE)) {
            const raw = fs.readFileSync(STATE_FILE, 'utf-8');
            this.state = JSON.parse(raw);
            // Migration for old state if needed (ensure fields exist)
            if (!this.state.authorStats) this.state.authorStats = {};
            if (!this.state.appStats) this.state.appStats = {};
        }
    }

    static save() {
        fs.writeFileSync(STATE_FILE, JSON.stringify(this.state, null, 2));
    }

    // --- Casts ---
    static hasSeenCast(hash: string): boolean {
        this.load();
        return !!this.state.seenCasts[hash];
    }

    static markSeenCast(hash: string) {
        this.load();
        this.state.seenCasts[hash] = true;
        this.save();
    }

    // --- Anchors ---
    static hasAnchored(hash: string): boolean {
        this.load();
        return !!this.state.anchoredCasts[hash];
    }

    static markAnchored(hash: string, txHash: string) {
        this.load();
        this.state.anchoredCasts[hash] = txHash;
        this.save();
    }

    // --- Cycles ---
    static hasPublishedCycle(dateKey: string): boolean {
        this.load();
        return !!this.state.publishedCycles[dateKey];
    }

    static markPublishedCycle(dateKey: string, status: string) {
        this.load();
        this.state.publishedCycles[dateKey] = status;
        this.save();
    }

    // --- Author Stats ---
    static getAuthorStats(username: string): AuthorStats {
        this.load();
        return this.state.authorStats[username] || { shipCount: 0, lastShipTs: 0, shipHistory: [] };
    }

    static incrementAuthorShip(username: string, timestamp: number) {
        this.load();
        const stats = this.state.authorStats[username] || { shipCount: 0, lastShipTs: 0, shipHistory: [] };
        stats.shipCount += 1;
        stats.lastShipTs = timestamp;
        if (!stats.shipHistory) stats.shipHistory = [];
        stats.shipHistory.push(timestamp);
        this.state.authorStats[username] = stats;
        this.save();
    }

    // --- App Stats (Facts) ---
    static getAppStats(appKey: string): AppStats {
        this.load();
        return this.state.appStats[appKey] || { seenCount: 0, lastSeenAt: 0 };
    }

    static updateAppStats(appKey: string, timestamp: number, castHash: string) {
        this.load();
        const stats = this.state.appStats[appKey] || { seenCount: 0, lastSeenAt: 0 };
        stats.seenCount += 1;
        stats.lastSeenAt = timestamp;
        stats.lastCastHash = castHash;
        this.state.appStats[appKey] = stats;
        this.save();
    }
}
