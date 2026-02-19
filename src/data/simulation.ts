export const SIMULATION_DATA = [
    {
        type: 'SOCIAL_SIGNAL',
        timestamp: 'Just now',
        handle: 'basepaint',
        action: 'MINT_DETECTED',
        message: 'Day 455: "Neon Horizons" is now live. 24h open edition.',
        url: 'https://warpcast.com/basepaint', // Profile is better than generic home
        sentiment: 'HIGH_VELOCITY',
        confidence: 99.2,
        hash: '0x71...3a'
    },
    {
        type: 'CONTRACT_EVENT',
        timestamp: '2s ago',
        handle: 'aerodrome',
        action: 'LIQUIDITY_ADD',
        message: 'New Pool Created: vAMM-USDC/DEGEN. TVL +$50k in 10m.',
        url: 'https://aerodrome.finance/liquidity', // Direct to liquidity page
        sentiment: 'YIELD_OPP',
        confidence: 97.5,
        hash: '0x82...1c'
    },
    {
        type: 'SOCIAL_SIGNAL',
        timestamp: '5s ago',
        handle: 'jessepollak',
        action: 'BUILDER_UPDATE',
        message: 'Base is for everyone. New builder grants program launching next week.',
        url: 'https://warpcast.com/jessepollak',
        sentiment: 'ECOSYSTEM_NEWS',
        confidence: 98.9,
        hash: '0x99...2f'
    },
    {
        type: 'ONCHAIN_TX',
        timestamp: '8s ago',
        handle: '0xDeployer',
        action: 'CONTRACT_DEPLOY',
        message: 'New verified contract "AgentRegistry_v2" deployed.',
        url: 'https://basescan.org/verifiedContracts', // Specific list
        sentiment: 'NEW_INFRA',
        confidence: 85.0,
        hash: '0xaa...bb'
    },
    {
        type: 'SOCIAL_SIGNAL',
        timestamp: '12s ago',
        handle: 'virtuals_io',
        action: 'AGENT_LAUNCH',
        message: 'Introducing @Luna: The first autonomous trading agent on Base.',
        url: 'https://app.virtuals.io', // App link
        sentiment: 'HIGH_RISK_HIGH_REWARD',
        confidence: 94.1,
        hash: '0xcc...dd'
    },
    {
        type: 'NFT_MINT',
        timestamp: '15s ago',
        handle: 'zora',
        action: 'TRENDING_MINT',
        message: '"Based Punks" #4021 minted. Volume increasing.',
        url: 'https://zora.co/collect/base:0x.../1', // Specific collection
        sentiment: 'MOMENTUM',
        confidence: 88.5,
        hash: '0xee...ff'
    },
    {
        type: 'DEFI_EVENT',
        timestamp: '22s ago',
        handle: 'moonwell',
        action: 'RATE_UPDATE',
        message: 'USDC Supply APY increased to 12.5%.',
        url: 'https://moonwell.fi/markets', // Markets page
        sentiment: 'YIELD_ALERT',
        confidence: 96.0,
        hash: '0x11...22'
    },
    {
        type: 'SOCIAL_SIGNAL',
        timestamp: '30s ago',
        handle: 'farcaster',
        action: 'PROTOCOL_GOV',
        message: 'FIP-18 Proposal: Reducing storage costs for heavy casters.',
        url: 'https://github.com/farcasterxyz/protocol',
        sentiment: 'GOVERNANCE',
        confidence: 91.0,
        hash: '0x33...44'
    },
    {
        type: 'CONTRACT_EVENT',
        timestamp: '45s ago',
        handle: 'friendtech',
        action: 'KEY_TRADE',
        message: 'Whale purchase: 10 keys of @racer bought for 5 ETH.',
        url: 'https://friend.tech',
        sentiment: 'SOCIAL_FI_PUMP',
        confidence: 89.2,
        hash: '0x55...66'
    },
    {
        type: 'SOCIAL_SIGNAL',
        timestamp: '1m ago',
        handle: 'base_god',
        action: 'COMMUNITY_POST',
        message: 'Thank you Based God. Tybg.',
        url: 'https://warpcast.com/basegod',
        sentiment: 'CULT_SIGNAL',
        confidence: 99.9,
        hash: '0x77...88'
    },
    {
        type: 'ONCHAIN_TX',
        timestamp: '1m ago',
        handle: 'blackbird',
        action: 'REWARD_CLAIM',
        message: '1,500 $FLY claimed by active users in NYC.',
        url: 'https://blackbird.xyz',
        sentiment: 'REAL_WORLD_TX',
        confidence: 95.5,
        hash: '0x99...00'
    },
    {
        type: 'SOCIAL_SIGNAL',
        timestamp: '2m ago',
        handle: 'brian_armstrong',
        action: 'MACRO_UPDATE',
        message: 'Crypto depends on freedom. Keep building.',
        url: 'https://warpcast.com/brian_armstrong',
        sentiment: 'MACRO_BULLISH',
        confidence: 98.0,
        hash: '0xab...cd'
    }
];

export const HERO_SIGNALS = [
    {
        title: "@basepaint: Day 455",
        subtitle: "\"Geometric Dreams\" Minting Live",
        sentiment: "HIGH_VELOCITY_MINT 🎨",
        confidence: "99.2%",
        reason: "Consistent daily mint volume > 2 ETH. Verified contract.",
        authorStats: "Top 5% Creator",
        signalUrl: "https://warpcast.com/basepaint",
        category: "ART"
    },
    {
        title: "@aerodrome: New Pool",
        subtitle: "vAMM-USDC/DEGEN Pool Created",
        sentiment: "YIELD_OPPORTUNITY 💰",
        confidence: "97.5%",
        reason: "Official protocol deployment. High TVL inflow detected.",
        authorStats: "Verified DeFi Protocol",
        signalUrl: "https://aerodrome.finance/liquidity",
        category: "DEFI"
    },
    {
        title: "@virtuals: Agent Launch",
        subtitle: "New AI Agent @Luna deployed",
        sentiment: "AI_NARRATIVE 🤖",
        confidence: "94.1%",
        reason: "High social engagement on launch post. Verified factory contract.",
        authorStats: "Top 1% Builder",
        signalUrl: "https://app.virtuals.io",
        category: "AI"
    }
]
