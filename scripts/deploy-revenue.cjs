const hre = require("hardhat");

async function main() {
    const computeWallet = process.env.COMPUTE_WALLET_ADDRESS;

    if (!computeWallet) {
        throw new Error("COMPUTE_WALLET_ADDRESS is not set in .env");
    }

    console.log(`Deploying RevenueContract with Compute Wallet: ${computeWallet}`);

    const RevenueContract = await hre.ethers.getContractFactory("CuratoRevenue");
    const contract = await RevenueContract.deploy(computeWallet);

    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log(`RevenueContract deployed to: ${address}`);

    console.log("Verify using:");
    console.log(`npx hardhat verify --network base ${address} ${computeWallet}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
