import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const apiKey = process.env.NEYNAR_API_KEY || "INVALID_KEY";
const client = new NeynarAPIClient(apiKey);

export class NeynarIntegration {
    // Search endpoint is deprecated/unreliable. Use FeedIngest.fetchChannelFeed instead.
    static async searchCasts(query: string, limit = 20) {
        console.warn("Deprecated: searchCasts called. Prefer FeedIngest.");
        return { result: { casts: [] } };
    }

    static async publishCast(text: string, signerUuid: string) {
        if (apiKey === "INVALID_KEY") {
            console.warn("Neynar API Key missing. Cannot publish.");
            return;
        }
        try {
            await client.publishCast(signerUuid, text);
        } catch (error) {
            console.error("Neynar Publish Error:", error);
        }
    }
}
