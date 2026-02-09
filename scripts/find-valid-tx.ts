import { createPublicClient, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
    chain: base,
    transport: http("https://mainnet.base.org")
});

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

async function main() {
    console.log("Fetching recent USDC tx...");
    const logs = await client.getLogs({
        address: USDC_ADDRESS,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
        fromBlock: 'latest' // Default usually gets last block, might need range if empty
    });

    if (logs.length > 0) {
        const tx = logs[logs.length - 1].transactionHash;
        console.log(`FOUND_TX_HASH=${tx}`);
    } else {
        // Fallback: try looking back a few blocks if 'latest' is empty (unlikely for USDC)
        console.log("No logs in latest block, trying a range...");
        const block = await client.getBlockNumber();
        const logsRange = await client.getLogs({
            address: USDC_ADDRESS,
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
            fromBlock: block - BigInt(10),
            toBlock: block
        });
        if (logsRange.length > 0) {
            console.log(`FOUND_TX_HASH=${logsRange[logsRange.length - 1].transactionHash}`);
        } else {
            console.log("Could not find a recent tx.");
        }
    }
}

main().catch(console.error);
