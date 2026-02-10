# CuratoBase Mini App Publish Checklist


**🔍 Live Status Dashboard:** `https://curatobase.vercel.app/status` (Check this first!)

## 1. Vercel Configuration
- [ ] **Root Directory**: `.` (default)
- [ ] **Framework Preset**: `Next.js`
- [ ] **Build Command**: `prisma generate && next build`
    - ⚠️ **IMPORTANT**: Do NOT run `prisma migrate deploy` here for MVP. We use `/api/admin/db-init` instead.
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
    - **Action**: Replace the placeholder signature in `src/app/.well-known/farcaster.json/route.ts` with your real signature.
    - *Tip*: Use the [Farcaster Domain Verification Tool](https://warpcast.com/~/developers/domains).
    - **Payload to Sign**: `{"domain":"curatobase.vercel.app"}`
- [ ] **Manifest Verification (Critical)**:
    - Run: `curl -i https://curatobase.vercel.app/.well-known/farcaster.json`
    - Verify Status: `200 OK`
    - Verify Content-Type: `application/json`
    - Verify JSON contains `"miniapp"` and `"frame"` keys.

## 3. Env Manifest (Required)

| Variable | Required? | Description | Source |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | YES | Postgres Connection | Vercel Postgres (Auto-Injected) |
| `CRON_SECRET` | YES | Secures `/api/cron/*` | Generate Manually |
| `ADMIN_SECRET` | YES | Secures `/api/admin/*` | Generate Manually |
| `NEYNAR_API_KEY` | NO / OPT | For publishing to Farcaster | Neynar Dashboard |
| `NEYNAR_SIGNER_UUID` | NO / OPT | For publishing to Farcaster | Neynar Dashboard |

> **Note**: `DIRECT_URL` has been removed. Use `DATABASE_URL` for everything.

*Note: `NEXT_PUBLIC_*` variables are not strictly needed for the current read-only terminal.*

## 4. Verification & Admin
- [ ] **Status Page**: `https://curatobase.vercel.app/status`
- [ ] **Persistence Check**:
    - Go to `/admin` (Manually type URL).
    - Enter `ADMIN_SECRET`.
    - Click "Create Test Report".
    - Verify success message and check `/reports` to see the new log.

    - Verify success message and check `/reports` to see the new log.

## 5. Account Association (Signature)
If `/status` shows **"USING PLACEHOLDER SIGNATURE"**:
1.  Go to `https://warpcast.com/~/developers/domains` to generate signature for `curatobase.vercel.app`.
2.  **Go to**: `/admin/association` (requires `ADMIN_SECRET`).
3.  Paste the **Header**, **Payload**, and **Signature**.
4.  Click **Save Association**.
5.  Check `/status` (it should turn GREEN and say "Source: DB_MANAGED").

## 6. Base Build Verification
- **Meta Tag**: Ensure `base:app_id` is present on homepage (Added in layout).
- **Verify**: In Base Build portal, click "Verify". It should now find the tag.

## 6. Final Polish
- [ ] **Icon**: Replace `public/icon.png` and `public/splash.png` with real assets (512x512).
- [ ] **Metadata**: Update `src/app/layout.tsx` title/description if desired.
