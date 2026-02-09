# CuratoBase v6: Editorial Curation Terminal

CuratoBase is a fully autonomous curator agent. We have replaced the "Social Feed" UI with a **Professional Editorial Terminal**.

**Version**: `v6.0-terminal` (Locked)

## 🖥️ The Terminal Interface
This is NOT a consumer app. It is a decision-support system for observing the agent's brain.
- **Read-Only**: No likes, no follows, no submits.
- **Deterministic**: The agent's judgment is final.
- **Data-Dense**: Maximum information density, zero fluff.

## 🧭 Navigation
1.  **Radar**: Real-time view of all incoming candidates, sorted by Agent Priority `(Relevance Score)`.
2.  **Promotion Queue**: Items blocked from promotion (`Ready: NO`). The waiting room.
3.  **Prestige Picks**: The Gold Standard. Items that achieved `PRESTIGE` status.
4.  **Silence Pool**: High-quality builds with zero engagement (`Status: SILENCE`).
5.  **Full Audit Log**: Chronological feed of every decision.

## 🧠 Decision Explainer (Detail Pane)
Select any row to inspect the "Why":
- **Identity**: Who built it? How confident are we in them?
- **Engagement**: Is the buzz real (Unique Repliers) or fake (Likes)?
- **Proof**: Is there a Repo? Demo? Verified Reward?
- **Promotion Decision**: EXACTLY which Promotion Blocks were satisfied, and which were missed.

## 🤖 Zero Human-in-the-Loop
The Terminal reflects the autonomous state.
- **Ingest**: Direct Neynar feed `channel:base`.
- **Logic**: `PromotionEngine` (4-Block Logic).
- **Publish**: Auto-tweets from `@CuratoBase`.

---
*Built for the Agentic Coding Challenge.* [Launch Terminal](/audit)
