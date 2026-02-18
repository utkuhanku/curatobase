require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",
    networks: {
        base: {
            url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
            accounts: process.env.COMPUTE_PRIVATE_KEY ? [process.env.COMPUTE_PRIVATE_KEY] : [],
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        },
    },
    etherscan: {
        apiKey: {
            base: process.env.BASESCAN_API_KEY || "",
        },
        customChains: [
            {
                network: "base",
                chainId: 8453,
                urls: {
                    apiURL: "https://api.basescan.org/api",
                    browserURL: "https://basescan.org"
                }
            }
        ]
    },
    paths: {
        sources: "./src/contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
};
