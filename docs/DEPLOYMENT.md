# Vetra Deployment Guide

## Render (API Server)

1. Connect GitHub repo to Render
2. Use `render.yaml` blueprint or manual settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
3. Set env vars:
   - `API_KEYS` — comma-separated list of valid API keys
   - `OPENROUTER_API_KEY` — optional, for authenticated OpenRouter access
4. Free tier: 512MB RAM, sleeps after 15 min inactivity

## Vercel (Landing Page)

1. Connect `landing-page/` folder to Vercel
2. Framework preset: Other (static)
3. Build command: none (static HTML)
4. Output directory: `./`

## URLs

- API: `https://vetra-api.onrender.com`
- Landing: `https://vetra-landing.vercel.app`
