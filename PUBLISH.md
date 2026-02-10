# CuratoBase Mini App Publish Checklist

## 1. Vercel Configuration
- [ ] **Root Directory**: `.` (default)
- [ ] **Framework Preset**: `Next.js`
- [ ] **Build Command**: `npm run build` (or `prisma generate && next build`)
- [ ] **Install Command**: `npm install`
- [ ] **Environment Variables**:
    - `DATABASE_URL`: (Set automatically by Neon integration)
    - `DIRECT_URL`: (Set automatically by Neon integration)
    - `CRON_SECRET`: Generate a strong secret (e.g., `openssl rand -hex 32`)
    - `Simple Access`: Ensure "Deployment Protection" is **OFF** (or configured to allow Farcaster scraper). *Critical for Manifest validation.*

## 2. Farcaster / Base Mini App Setup
- [ ] **Manifest Validation**:
    - Go to [Warpcast Developer Playground](https://warpcast.com/~/developers/frames) and test `https://your-domain.vercel.app`.
    - Ensure it loads the manifest found at `/.well-known/farcaster.json`.
- [ ] **Account Association**:
    - You need to generate a signature to prove ownership of the domain.
    - Use the [Farcaster Domain Verification Tool](https://warpcast.com/~/developers/domains) (or CLI).
    - **Action**: Replace the placeholder `accountAssociation` block in `public/.well-known/farcaster.json` with your real signature.
    - *Tip*: If you don't have a signature yet, the manifest validator will complain but the app might still load in some contexts. Strict requirement for official directory listing.
- [ ] **Manifest Verification (Critical)**:
    - Run: `curl -i https://curatobase.vercel.app/.well-known/farcaster.json`
    - Verify Status: `200 OK`
    - Verify Content-Type: `application/json`
    - Verify JSON contains `"miniapp"` and `"frame"` keys.

## 3. Env Manifest (Required)

| Variable | Required? | Description | Source |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | YES | Postgres Connection | Vercel Storage (Neon) |
| `DIRECT_URL` | YES | Postgres Direct Connection | Vercel Storage (Neon) |
| `CRON_SECRET` | YES | Secures `/api/cron/*` | Generate Manually |
| `ADMIN_SECRET` | YES | Secures `/api/admin/*` | Generate Manually |
| `NEYNAR_API_KEY` | NO / OPT | For publishing to Farcaster | Neynar Dashboard |
| `NEYNAR_SIGNER_UUID` | NO / OPT | For publishing to Farcaster | Neynar Dashboard |

*Note: `NEXT_PUBLIC_*` variables are not strictly needed for the current read-only terminal.*

## 4. Final Polish
- [ ] **Icon**: Replace `public/icon.png` and `public/splash.png` with real assets (512x512).
- [ ] **Metadata**: Update `src/app/layout.tsx` title/description if desired.
