import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { CurationStatus } from '../types';

export class AgentPublisher {
    private client: NeynarAPIClient;
    private signerUuid: string | undefined;

    constructor(client: NeynarAPIClient) {
        this.client = client;
        this.signerUuid = process.env.NEYNAR_SIGNER_UUID;
    }

    async publishBatch(items: any[]) {
        if (!this.signerUuid) {
            console.log("⚠️ SKIPPING PUBLISH: NEYNAR_SIGNER_UUID missing.");
            return;
        }

        for (const item of items) {
            try {
                await this.publishItem(item);
            } catch (err) {
                console.error(`Failed to publish item ${item.candidate.castHash}:`, err);
            }
        }
    }

    private async publishItem(item: any) {
        const { candidate, verdict, baseAppSignal, rewardCheck, promotion } = item;
        const isPrestige = verdict.status === CurationStatus.CURATED;

        // Construct Text
        const header = isPrestige ? "🏆 PRESTIGE PICK" : "⭐ TOP PICK";
        const appName = baseAppSignal.appSlug ? `base.app/app/${baseAppSignal.appSlug}` : "New App detected";

        let proofLine = "✅ Proof: ";
        if (item.baseAppSignal.isBaseApp) proofLine += "📱BaseApp ";
        if (item.rewardCheck.status !== 'NONE') proofLine += `💰Reward(${item.rewardCheck.status}) `;
        if (item.detection?.hasRepo) proofLine += "💻Repo "; // Need to pass detection down if used specifically

        const auditLink = `https://curatobase.com/audit?id=${candidate.castHash}`; // Mock URL for now

        const text = `${header}\n\n📦 ${appName}\n\n${proofLine}\n\n🔎 Audit: ${auditLink}`;

        // Embeds
        const embeds = [];
        if (baseAppSignal.appUrl) embeds.push({ url: baseAppSignal.appUrl });

        console.log(`Creating cast for ${candidate.castHash}...`);

        await this.client.publishCast(this.signerUuid!, text, {
            embeds
        });

        console.log(`✅ Published: ${appName}`);
    }
}
