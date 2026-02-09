import 'dotenv/config';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// Force load env if not loaded by runner
const apiKey = process.env.NEYNAR_API_KEY;

if (!apiKey) {
    console.error("❌ Error: NEYNAR_API_KEY is not set in .env");
    process.exit(1);
}

const client = new NeynarAPIClient(apiKey);

async function main() {
    console.log("🔐 Generating Neynar Managed Signer...");
    console.log("   (This creates a new signer keypair managed by Neynar)");

    try {
        const signer = await client.createSigner();

        console.log("\n✅ Signer Created Successfully!");
        console.log("------------------------------------------");
        console.log(`UUID: ${signer.signer_uuid}`);
        console.log(`Public Key: ${signer.public_key}`);
        console.log(`Status: ${signer.status}`);
        console.log("------------------------------------------");
        console.log("\n📲 AUTHORIZATION REQUIRED:");
        console.log("1. Open the following URL on the device logged into @curatobase on Warpcast:");
        console.log(`\n   ${(signer as any).link}\n`);
        console.log("2. Approve the signer in Warpcast.");
        console.log(`3. Once approved, add this line to your .env file:\n`);
        console.log(`   NEYNAR_SIGNER_UUID=${signer.signer_uuid}\n`);
        console.log("4. Then restart the agent.");

    } catch (error: any) {
        console.error("❌ Failed to create signer:", error.response?.data || error.message);
    }
}

main();
