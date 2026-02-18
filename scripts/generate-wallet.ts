import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log("Generating new Compute Wallet...");

    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    console.log(`Address: ${account.address}`);
    console.log(`Private Key: ${privateKey}`);

    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    if (!envContent.includes('COMPUTE_PRIVATE_KEY')) {
        envContent += `\nCOMPUTE_PRIVATE_KEY="${privateKey}"`;
        envContent += `\nCOMPUTE_WALLET_ADDRESS="${account.address}"`;
        fs.writeFileSync(envPath, envContent);
        console.log("✅ Added to .env");
    } else {
        console.log("⚠️ COMPUTE_PRIVATE_KEY already exists in .env. Skipping update.");
    }
}

main();
