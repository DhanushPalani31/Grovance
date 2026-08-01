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

- **Phase 6 (maintenance/trust layer):** complete — `/api/health` status, a real
  changelog widget pulling live commit history from the GitHub API, and a real
  ticketing system (`GET/POST /api/tickets`, `PATCH /api/tickets/:id/status`) —
  tickets can be opened and their status advanced live, with every action logged
  to the shared activity feed.
- **Phase 7 (real dashboard data):** complete — Dashboard stats come from a live
  `/api/automation/stats` endpoint, auto-refreshing every minute, with a cron job
  simulating new orders every ~10 minutes so the numbers genuinely move.
- **Auth:** complete — JWT-based register/login/me (`/api/auth/*`), bcrypt password
  hashing, `/portal/*` routes gated behind a real login (`RequireAuth` guard on the
  frontend).
- **Missing pages filled in:** Login, Signup, 404, Terms, Privacy, About, and a
  Settings page (profile + logout) inside the portal.
- **Polish:** framer-motion animations across the marketing site and auth pages
  (fade/slide-ins, scroll-triggered reveals, hover lift), a testimonials section,
  and a shared footer with legal/about links.
- **New logo:** replaced with a cleaner, more enterprise/corporate mark (navy icon +
  bold wordmark) — closer to the Zoho/Oracle end of the spectrum than the earlier
  gradient badge.

**Known placeholder content to swap before a real launch:**
- Landing page testimonials are clearly-labeled illustrative quotes, not real
  customers (see comment in `Testimonials.tsx`)
- Terms/Privacy pages are full realistic drafts but still need attorney review
  and jurisdiction-specific details filled in (flagged inline)
- `JWT_SECRET` in `.env.example` must be replaced with a real secret in production

**Latest polish pass:**
- All "shop"/"store" language replaced with "brand"/"business" throughout the
  app and AI system prompts; demo entity renamed to "Aurora & Co."
- New consistent design system: semantic color tokens (`success` = green,
  `warning` = amber, `danger` = red, `info` = blue, `brand` = navy) used the
  same way everywhere instead of scattered teal/indigo; Inter font for
  premium typography; framer-motion animations across stats, cards, and
  page transitions
- Automation Center now has a **Run Now** button per rule with `lastTriggeredAt`
  / `runCount` tracking and toast confirmation — click it, then check the
  Dashboard's Activity Feed to see the same event land there live
- Added a 4th service, **Custom App Development**, to the Landing and
  Services pages — bespoke builds around client requirements, with Claude
  integrated only where it adds real value

**Google Sign-In, header/footer, and content additions:**
- Google OAuth login added (`POST /api/auth/google`, verified server-side with
  `google-auth-library`) alongside existing email/password auth. Needs a real
  Google OAuth Client ID — see `GOOGLE_CLIENT_ID` / `VITE_GOOGLE_CLIENT_ID` in
  the `.env.example` files. The button renders (disabled, with an explanatory
  tooltip) if not configured, rather than breaking the page.
- Navbar rebuilt: added Home/Careers links, scroll-aware shadow, cleaner spacing
- Footer rebuilt as a proper multi-column professional footer (Company/Product/
  Legal columns, contact info)
- Services page reordered — **Custom App Development listed first**, followed
  by Automation, AI, Maintenance
- Added a named list of automation "tools" (Auto-Reply, Order Taken, Abandoned
  Cart Recovery, Low-Stock Alerts, Review Requests, Daily/Weekly Summaries) to
  the Services page, making automation concrete rather than a vague promise
- Added an "Our Work" section on Services listing the one completed project so
  far: Naya Builders (nayabuilders.com), a construction company in Chennai
- New Careers page (openings are clearly-flagged illustrative placeholders,
  same pattern as the testimonials — replace before real hiring use)

**Google Sign-In fix + final premium polish pass:**
- Fixed a real bug found during live testing: the Google OAuth client was being
  constructed at module-import time, before `dotenv.config()` ran, so
  `GOOGLE_CLIENT_ID` was always read as undefined. Switched to the same lazy
  singleton pattern already used for the Anthropic client — verified live that
  the endpoint now genuinely attempts token verification instead of always
  reporting "not configured"
- Verified the real Google Client ID loads correctly end-to-end: confirmed it's
  embedded in the frontend build output, and confirmed the backend attempts
  real verification against Google's servers (the only remaining error in
  testing was this sandbox's own network egress allowlist blocking
  `www.googleapis.com` — not an app bug; your real deployment won't have that
  restriction)
- Added consistent fade-in entrance animations (framer-motion) and shadow/hover
  polish to every remaining page: AI Assistant, Content Studio, Insights,
  Maintenance, Settings, Pricing, Contact, Terms, Privacy — matching the
  treatment already on Dashboard, Automation Center, and the marketing pages

**Content fixes + final local verification:**
- Testimonials section replaced entirely: removed the two fabricated illustrative
  quotes and rewrote it as a factual "Our Work" project spotlight for Naya
  Builders instead — deliberately not inventing a first-person quote attributed
  to a real, identifiable business without their input
- About page's "Approach" stat now reads "Custom Apps + Automation + AI +
  Maintenance", reflecting all four services
- Removed the "This isn't a mockup" section from the Landing page per request
- Final local verification pass: ran the actual production build (`vite preview`)
  alongside the backend simultaneously and confirmed every route returns
  HTTP 200 (`/`, `/services`, `/about`, `/careers`, `/login`), confirmed the
  page title renders correctly, and confirmed `/api/health` responds — a real
  end-to-end check of the built app, not just `tsc`/`vite build` passing

See `PROJECT-PLAN.md` for what's next.
