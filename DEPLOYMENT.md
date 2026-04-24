# Vetra Deployment Guide

## Overview

Vetra is deployed on two free-tier platforms:

| Platform | Service | URL | Status |
|----------|---------|-----|--------|
| **Render** | API server (Next.js standalone) | https://cloudgptapi.onrender.com | Free plan, Oregon |
| **Vercel** | Landing page / docs (Next.js) | https://vetraapi-two.vercel.app | Hobby tier |

Both auto-deploy from the `main` branch of `CloudCompile/vetraaiapi`.

---

## Render (API Server)

### Service Details
- **Name:** `cloudgptapi` (original name preserved for stability)
- **Plan:** Free
- **Region:** Oregon
- **Runtime:** Node.js 22.x
- **Build:** `npm install; npm run build`
- **Start:** `npm run start`
- **Health Check:** `/api/health`
- **Auto-deploy:** Enabled on every push to `main`

### Render Blueprint (`render.yaml`)
The repo includes a `render.yaml` blueprint that defines the service infrastructure as code. You can sync it in the Render dashboard under **Blueprints**.

### Environment Variables (Render Dashboard)
Navigate to [Render Dashboard → cloudgptapi → Environment](https://dashboard.render.com/web/srv-d5g33hc9c44c73dl445g).

**Required:**
- `NEXT_PUBLIC_APP_URL` = `https://cloudgptapi.onrender.com`
- `KINDE_CLIENT_ID`
- `KINDE_CLIENT_SECRET`
- `KINDE_ISSUER_URL`
- `KINDE_SITE_URL` = `https://cloudgptapi.onrender.com`
- `KINDE_POST_LOGOUT_REDIRECT_URL` = `https://cloudgptapi.onrender.com`
- `KINDE_POST_LOGIN_REDIRECT_URL` = `https://cloudgptapi.onrender.com/dashboard`

**AI Provider Keys (at least one recommended):**
- `POLLINATIONS_API_KEY`
- `OPENROUTER_API_KEY` / `OR_KEY`
- `KIVEST_API_KEY`
- `SHALOM_API_KEY`
- `GROQ_API_KEY`
- `CEREBRAS_API_KEY`

**Optional:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

---

## Vercel (Landing Page / Docs)

### Project Details
- **Name:** `vetraapi`
- **Framework:** Next.js
- **Node Version:** 24.x
- **Domains:**
  - `vetraapi-two.vercel.app` (primary)
  - `vetraapi-cloudcompiles-projects.vercel.app`

### Environment Variables (Vercel Dashboard)
Navigate to [Vercel Dashboard → vetraapi → Settings → Environment Variables](https://vercel.com/cloudcompiles-projects/vetraapi/settings/environment-variables).

Set the same variables as Render, but with `NEXT_PUBLIC_APP_URL` pointing to the Vercel domain (or keep Render if you want the API base there).

---

## CI/CD Pipeline

GitHub Actions workflow `.github/workflows/ci-cd.yml` runs on every push / PR to `main`:

1. **Build & Test**
   - `npm ci`
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm run build` (with dummy env vars)

2. **Smoke Tests** (only on `main` pushes)
   - Polls `https://cloudgptapi.onrender.com/api/health` until HTTP 200
   - Polls `https://vetraapi-two.vercel.app/api/health` until HTTP 200

---

## Health Checks

| Endpoint | Platform | Description |
|----------|----------|-------------|
| `GET /api/health` | Both | Lightweight Edge health check (200 + JSON) |
| `GET /api/status` | Both | Full provider status dashboard JSON |
| `GET /v1` | Both | API v1 info + available endpoints |
| `GET /v1/models` | Both | List all available models |

Example:
```bash
curl https://cloudgptapi.onrender.com/api/health
curl https://vetraapi-two.vercel.app/api/health
```

---

## Troubleshooting

### Render returns 500
1. Check Render logs: Dashboard → cloudgptapi → Logs
2. Verify env vars are set (especially `KINDE_*` and at least one AI provider key)
3. Ensure `NEXT_PUBLIC_APP_URL` matches the Render URL

### Vercel build fails
1. Check Vercel deployment logs
2. The `next.config.js` skips ESLint/TS during build (they run in GitHub Actions)
3. Ensure `NEXT_PUBLIC_APP_URL` is set

### Health check fails in CI
- The smoke-test job runs immediately after push; Render free-tier deploys can take 30–60s. The job retries 5 times with 10s delays.

---

## Free-tier Limits

| Platform | Limit |
|----------|-------|
| Render Free | Spins down after 15 min idle (cold start ~30s). 512 MB RAM. |
| Vercel Hobby | 100 GB bandwidth/mo, 10s serverless function timeout. |

No Supabase is required for basic API operation — the app gracefully degrades when Supabase env vars are missing.
