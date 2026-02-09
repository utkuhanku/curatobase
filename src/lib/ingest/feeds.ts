import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";

const apiKey = process.env.NEYNAR_API_KEY || "INVALID_KEY";
const client = new NeynarAPIClient(apiKey);

export class FeedIngest {
    static async fetchChannelFeed(channelId: string = "base", limit: number = 25) {
        if (apiKey === "INVALID_KEY") {
            console.warn("Neynar API Key missing. Returning empty feed.");
            return [];
        }

        try {
            const feed = await client.fetchFeed(FeedType.Filter, {
                filterType: FilterType.ChannelId,
                channelId: channelId,
                limit: limit,
            });
            return feed.casts || [];
        } catch (error) {
            console.error(`Feed Fetch Error (channel: ${channelId}):`, error);
            return [];
        }
    }

    static async fetchEmbedFeed(embedUrl: string, limit: number = 25) {
        if (apiKey === "INVALID_KEY") return [];
        try {
            const feed = await client.fetchFeed(FeedType.Filter, {
                filterType: FilterType.EmbedUrl,
                embedUrl: embedUrl,
                limit: limit,
            });
            return feed.casts || [];
        } catch (error) {
            console.error(`Feed Fetch Error (embed: ${embedUrl}):`, error);
            return [];
        }
    }
}
