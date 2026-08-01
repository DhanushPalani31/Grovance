# Grovance

Automation, AI, and end-to-end maintenance for local shops and brands —
demonstrated by an app that runs on its own services.

Every feature you see in this app (automation rules, the AI assistant, the
maintenance/status page) is a real Grovance service running live, not a
mockup. That's intentional — this app *is* the pitch.

![Grovance](./logo.svg)

## Architecture

A fully decoupled two-service architecture:

```
grovance/
├── frontend/   React + Vite + TypeScript + Tailwind
│   ├── /            Public marketing site (Landing, Services, Pricing, Contact)
│   └── /portal/*    Client portal — the live demo (Dashboard, Automation Center,
│                     AI Assistant, Content Studio, Insights, Maintenance)
├── backend/    Node.js + Express + TypeScript — API, automation jobs, AI routes, leads
└── PROJECT-PLAN.md   Full build plan, phases, and roadmap
```

The marketing site isn't just a brochure — it embeds a live chat widget backed by the
same Claude endpoint the portal uses, and the contact form writes straight into the
automation activity log, same as any other workflow rule.

See `PROJECT-PLAN.md` for the full plan, feature breakdown, and phased roadmap.

## Running locally

### Backend

```bash
cd backend
cp .env.example .env      # add your ANTHROPIC_API_KEY to enable AI features
npm install
npm run dev                # runs on http://localhost:4000
```

### Frontend

```bash
cd frontend
cp .env.example .env       # points to the backend URL
npm install
npm run dev                 # runs on http://localhost:5173
```

Without an `ANTHROPIC_API_KEY` set, the AI Assistant and Content Studio pages
will still render — they just show a friendly "not connected yet" message
instead of a live reply. Automation and Maintenance pages work with no
external keys needed, though the Maintenance page's changelog will hit
GitHub's public rate limit (60 req/hour) without a `GITHUB_TOKEN` — see
`backend/.env.example`.

## Tech stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS v4, React Router
- **Backend:** Node.js, Express, TypeScript, node-cron, `@anthropic-ai/sdk`
- **Data layer:** in-memory store today, designed to be swapped for
  PostgreSQL without touching route code (see `backend/src/lib/store.ts`)

## Deployment (suggested)

- Frontend → Vercel or Netlify (static build output from `npm run build`)
- Backend → Render, Railway, or Fly.io
- Set `VITE_API_URL` on the frontend to the deployed backend URL

## Status

- **Phase 1 (foundation):** complete
- **Phase 2 (public marketing site):** complete
- **Phase 4 (automation deepening):** complete — rule toggles now persist on the
  backend (`GET/POST /api/automation/rules`) instead of local React state, and every
  toggle logs to the same activity feed the dashboard reads from.
- **Phase 5 (AI insights):** complete — the Insights page calls a real
  `/api/ai/insights` endpoint that feeds Claude the shop's actual activity log and
  rule/lead stats, generating a genuine on-demand summary instead of static copy.

- **Phase 6 (maintenance/trust layer):** mostly complete — `/api/health` status,
  the Maintenance page UI, and a **real changelog widget pulling live commit history
  from the GitHub API** (`/api/changelog`, cached 5 min, gracefully degrades on
  rate-limit or network failure). Support tickets are still placeholder data —
  a real ticketing backend is the one piece left here.

See `PROJECT-PLAN.md` for what's next.
