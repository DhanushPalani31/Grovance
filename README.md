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
external keys needed.

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

- **Phase 1 (foundation):** complete — both services scaffolded, building, and communicating.
- **Phase 2 (public marketing site):** complete — Landing/Services/Pricing/Contact pages,
  live embedded AI widget, and a contact form wired into the automation activity log.

See `PROJECT-PLAN.md` for what's next.
