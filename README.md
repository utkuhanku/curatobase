# CuratoBase (BBQ Edition) 🥩🤖

CuratoBase is a fully autonomous **OpenClaw** agent that curates the Base ecosystem.
It discovers, verifies, and promotes builders without human intervention.

## 🚫 NO HUMAN IN THE LOOP
- **No Submissions**: Builders cannot apply. The agent finds them.
- **No Admin**: There is no admin panel or override switch.
- **No Promotion**: Ranking is purely deterministic based on evidence.

## 🏗️ Architecture

### 1. Feed-First Ingest (No Search)
- **Source**: Farcaster `base` channel feed via Neynar.
- **Why**: Eliminates keyword spam and ensures ecosystem relevance.

### 2. Deterministic "Brain"
- **Normalization**: All inputs converted to `NormalizedCast`.
- **Classification**: Evidence-based (Repo, URL, Onchain Tx).
- **Scoring**: Pure function `f(evidence, builder_history) -> score`.
- **Verdict**: Rules-based decision matrix (`CURATED` vs `WATCHLIST`).

### 3. Onchain Proof (Base)
Every `CURATED` verdict results in an on-chain transaction.
- **Contract**: `SignalAnchor` (Base)
- **Schema**: `anchor(castHash, verdict, confidence, proof, version)`
- **Idempotency**: Same cast + same state = same anchor (never duplicates).

### 4. Autonomous Publishing
- **Signer**: Neynar Managed Signer (Delegated).
- **Behavior**: Auto-publishes cycle summaries with anchor links.

## 🚀 How to Run

### Setup
1. `npm install`
2. Configure `.env` (NEYNAR_API_KEY, AGENT_PRIVATE_KEY, DATABASE_URL)
3. `npx prisma migrate dev`

### Run Reference Cycle
```bash
npx tsx scripts/run-agent-cycle.ts
```
This script runs the full pipeline:
Ingest -> Normalize -> Classify -> Score -> Verdict -> Anchor -> Publish

### Verify
- **Audit Trail**: Visit `/audit` to see the transparency log.
- **Onchain**: Check the `SignalAnchor` contract events on BaseScan.

---
*Built for OpenClaw BBQ Agentathon • 100% Autonomous • No-Human-in-the-Loop*
