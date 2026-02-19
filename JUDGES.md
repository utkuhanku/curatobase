# 🧑‍⚖️ Judge's Guide: CuratoBase Autonomous Agent

**Project:** CuratoBase
**Bounty:** Base Self-Sustaining Autonomous Agents ($10,000)

## 🏆 Core Value Proposition
CuratoBase is a **fully autonomous**, **self-sustaining** agent that curates the Base ecosystem. It sells premium "Trust Signals" to other agents and users via an **x402 Payment Gate**, using the revenue to pay for its own compute (gas) on Base Mainnet.

## ✅ Requirement Verification Map

| Bounty Requirement | Implementation | Proof Link |
| :--- | :--- | :--- |
| **1. Autonomous** | Automated Daily Loop (Cron) | [View Loop Code](src/lib/agent/autonomous-loop.ts) |
| **2. Self-Sustaining** | Revenue Vault + Brain Wallet Refill | [View Contract](src/contracts/RevenueContract.sol) |
| **3. Builder Codes** | Appends `curatobase` to **EVERY** Tx | [View Proof Logic](src/app/api/health/proof/route.ts) |
| **4. x402 Integ.** | Payment Required for Signal API | [Try Endpoint](https://curatobase.vercel.app/api/v1/signal/latest) |
| **5. Public URL** | Dashboard with metrics | [Live Dashboard](https://curatobase.vercel.app/dashboard) |
| **6. No Password** | Open access for judges | [Live Dashboard](https://curatobase.vercel.app/dashboard) |

## 🛡️ "Strict Verification" Dashboard
We built a custom dashboard specifically for this bounty to prove our autonomy without "trusting" the frontend.

-   **Live Chain Data**: Revenue & Gas balances fetch directly from Base RPC.
-   **Runway Metric**: Real-time calculation of "Survival Days" based on burn rate.
-   **Verification Engine**: Decodes the **last on-chain transaction** to verify the presence of the ERC-8021 Builder Code (`curatobase`).

## 🤖 Novelty: Agent-to-Agent Commerce
Distinguishing features that go beyond the basics:

1.  **AI Plugin Standard**: We implemented `/.well-known/ai-plugin.json` and `openapi.yaml`, making CuratoBase **discoverable and spendable** by other AI agents (e.g., ChatGPT, ELIZA).
    -   [View Manifest](https://curatobase.vercel.app/.well-known/ai-plugin.json)
2.  **Survival Runway**: A "Financial Health" metric that visualizes the agent's path to bankruptcy or infinite sustainability.

## 🔗 Quick Links
-   **Dashboard**: [https://curatobase.vercel.app/dashboard](https://curatobase.vercel.app/dashboard)
-   **Proof JSON**: [https://curatobase.vercel.app/api/health/proof](https://curatobase.vercel.app/api/health/proof)
-   **Revenue Vault**: [0x9eFb...EC36](https://basescan.org/address/0x9eFbEE5074442C3E77Ba77885739E56780DBEC36)
-   **Brain Wallet**: [0x18Ce...6495](https://basescan.org/address/0x18Cefc2f696dAAC10afBf28BBaCBF3a17C7D6495)
