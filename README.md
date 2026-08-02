# Grovance

Automation, AI, and end-to-end maintenance for brands and growing
businesses — demonstrated by a marketing site that proves it live instead
of just describing it.

![Grovance](./logo.svg)

## What this app actually is today

**Update:** the client portal/dashboard (Automation Center, AI Assistant
page, Content Studio, Insights, Maintenance, login/signup) was built,
fully working, then **deliberately removed**. It was a strong demo, but it
implied one fixed product every client gets, which isn't how Grovance
actually works — each engagement is custom. What's live now is leaner and
puts the proof where a real visitor actually is: the marketing site itself.

```
grovance/
├── frontend/   React + Vite + TypeScript + Tailwind — marketing site only
│                (Landing, Services, Pricing, About, Careers, Contact,
│                 Terms, Privacy, and the Free Automation Audit tool)
├── backend/    Node.js + Express + TypeScript — AI chat, leads, the
│                Audit tool's generation endpoint, and a health check
└── PROJECT-PLAN.md   Original build plan (historical — portal phases
                       described there were later removed, see below)
```

The site isn't just a brochure: a live chat widget (Gemini-powered) sits
on every page, the Contact form and Automation Audit both write real leads
into Supabase, and the Audit tool generates a genuine, on-demand analysis
of a visitor's own business — no login required for any of it.

## Running locally

### Backend
```bash
cd backend
cp .env.example .env      # add GEMINI_API_KEY + Supabase credentials
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

Without `GEMINI_API_KEY` set, the chat widget and Audit tool still render —
they just show a clear "not connected" message instead of crashing.

## Tech stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS v4, React Router
- **Backend:** Node.js, Express, TypeScript, `@google/generative-ai` (Gemini)
- **Data layer:** Supabase (Postgres) — just two tables now: `leads` and
  `activity_log` (see `backend/supabase/`)

## Deployment (suggested)

- Frontend → Vercel or Netlify (static build output from `npm run build`)
- Backend → Render, Railway, or Fly.io
- Set `VITE_API_URL` on the frontend to the deployed backend URL

## Status

- **Marketing site:** complete — Landing, Services, Pricing, About,
  Careers, Contact, Terms, Privacy, all with the premium dark-hero
  redesign, mobile nav, and accessibility pass described below
- **Free Automation Audit tool:** complete — the flagship live-proof piece;
  a visitor describes their business and gets an instant, Gemini-generated
  breakdown of relevant automation, no login needed
- **AI chat widget:** complete — same Gemini backend as the Audit tool,
  present on every page
- **Portal/dashboard/auth:** removed entirely (see above)

**Known placeholder content to swap before a real launch:**
- Landing page's "Our Work" project spotlight is the one completed real
  project (Naya Builders) — accurate, not fabricated
- Terms/Privacy pages are full realistic drafts but still need attorney
  review and jurisdiction-specific details filled in (flagged inline)
- Careers page openings are placeholders — currently says "no openings"

---

## Full build history

The sections below are a running log of everything built, in order,
including the portal/dashboard/auth system that was later removed. Kept
for context on decisions made along the way.

**Latest polish pass:**
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

**Full interactive/creative UI pass:**
- Company email updated to `grovanceco@gmail.com`; Careers page rewritten from
  fake job listings to an honest "no open positions right now" message
- New reusable components: `Skeleton` (loading states), `ConfettiBurst` (lightweight,
  no external dependency), `CommandPalette` (⌘K global search/navigation),
  `GuidedTour` (4-step first-visit walkthrough), `Sparkline`, `TypewriterText`,
  `UptimeRing`, `PasswordStrength`
- **Landing**: scroll progress bar, animated gradient-blob background, a live
  "X automation events fired today" counter pulling real backend data
- **Automation Center**: visual trigger→action flow diagram per rule, animated
  pulse traveling the arrow on "Run Now", confetti burst on enabling a rule
- **AI Assistant**: typewriter streaming reveal, quick-reply chips, animated
  pulsing "thinking" avatar
- **Content Studio & Insights**: typewriter reveal for generated content/summaries
- **Dashboard**: session-based sparkline trends on stat cards, new-activity-item
  flash highlight, skeleton loaders replacing plain "Loading…" text
- **Maintenance**: animated circular uptime gauge, changelog items slide in with
  git-commit icons, confetti burst when a ticket is marked Resolved
- **Contact**: live character counter on the message field
- **Login & Signup**: password strength meter (Signup), animated success
  checkmark before redirecting to the portal on both
- **Services**: automation tools are now clickable — each reveals an inline
  example of what it would actually send, instead of just describing it
- Verified: full `tsc`/`vite build` pass on both frontend and backend, plus a
  live smoke test running both servers together — every route (`/`, `/services`,
  `/pricing`, `/about`, `/careers`, `/contact`, `/login`, `/signup`) returns
  HTTP 200 and the backend's stats/rules/activity endpoints respond correctly

**Deliberately not attempted this pass** (flagged rather than silently skipped):
- A true dark-mode toggle — would require touching color classes across every
  page safely, better as its own dedicated pass than rushed here
- Real backend token-streaming for AI responses — the typewriter effect above
  achieves the same visual result client-side without a bigger SSE/streaming
  architecture change

**Marketing site redesign — bold dark hero + light product pages:**
- Direction chosen after reviewing Dribbble/Awwards references: bold, dark,
  glow-accented hero treatment for the *marketing* site (what needs to sell),
  while the *portal* stays light and clean (what people use daily for real
  data). Strictly the existing navy/teal brand + semantic system — no new
  colors introduced.
- New `DarkHeader` component: a dark navy header band (with animated glow
  accents and a subtle dot-grid texture) applied consistently across Services,
  Pricing, About, Careers, and Contact
- Landing page rebuilt with a full bold hero: large gradient headline, a
  live "everything below is real" badge, and **floating stat cards showing
  actual live numbers** (automation events fired today, active automation
  rules, system status) pulled from the real backend — replacing decorative
  icons with real proof, in keeping with the app's core "don't just say it,
  show it" principle
- Pillar cards now layer up over the hero's bottom edge for a premium
  overlapping-panel look
- Verified: full type-check + production build pass, plus a live smoke test
  with both servers running — every marketing route returns HTTP 200 and the
  two APIs the new hero depends on (`/api/health`, `/api/automation/stats`)
  both respond correctly

**Automation Audit tool (replaces the earlier outreach-tool experiment):**
- After working through a cold-outreach tool concept, we replaced it entirely
  with something better-aligned to Grovance's actual strengths: a free,
  instant, public **Automation Audit** at `/audit`. A visitor describes their
  business (name, category, what they currently have/lack) and gets a
  personalized breakdown — honest pain points, 3 matched Grovance automation
  tools with a concrete "When X → Then Y" workflow for each, generated live
  by Claude
- Zero legal/compliance risk (unlike cold outreach) since visitors opt in by
  showing up and asking; the tool is demoable live in front of a prospect,
  and every submission with an email becomes a real lead in the existing
  Contact/leads pipeline
- New `POST /api/audit` endpoint, grounded to only recommend tools that
  actually exist on the Services page (no invented tool names)
- Verified live: confirmed graceful 503 without an API key, 400 on missing
  required fields, and the `/audit` route serving correctly alongside the
  rest of the site
- The earlier `outreach/` folder (CSV-based cold-email tool) was removed
  entirely in favor of this approach

**Chat widget modernization + clarity pass on confusing wording:**
- The floating chat widget had never received the animation/polish pass the
  rest of the app got — no entrance animation, plain avatar, instant reply
  text. Rebuilt to match: entrance/exit animation, an "online now" status
  dot, typewriter-style reply reveal, per-message animation
- Renamed "Go to Portal" / "View Live Demo" to **"See a Working Example"**
  (visitors) / **"My Dashboard"** (logged-in users) everywhere it appeared
  (Navbar, Landing hero, Footer) — "Portal" is internal jargon a first-time
  visitor won't parse
- Added a hover tooltip on that button explaining exactly what it opens
  ("a real, working dashboard... not a screenshot"), same pattern as the
  Audit page's tooltip
- Automation Center: moved the "this is real, not a mockup" message from a
  buried footnote to a prominent pulsing banner at the top of the page,
  so it's the first thing anyone sees before they start clicking around

**Removed the "Portal" CTA + applied current UI/UX research broadly:**
- Removed the "See a Working Example"/"My Dashboard" portal CTA entirely
  from the Navbar, Landing hero, and Footer (was still causing confusion
  even after the earlier tooltip fix). The `/portal` route, login/signup,
  and the actual dashboard are untouched and fully functional — just no
  longer pushed as a generic marketing CTA. The **Free Audit** tool is now
  the primary CTA everywhere, since it's the one thing that's both
  self-explanatory and immediately demoable
- Researched current (2026) UI/UX guidance before making broader changes.
  The consistent signal across sources: motion should be purposeful (signal
  what happened, not decorate), accessibility is now treated as
  non-negotiable rather than optional, and modular "bento grid" layouts are
  replacing uniform grids
- **Accessibility, applied app-wide via one CSS change**: visible focus
  rings for keyboard navigation (`:focus-visible`) on every interactive
  element, and full `prefers-reduced-motion` support — every animation
  respects it automatically now
- **Bento-style grid** applied to the Services page's automation-tools
  section — the lead tool (Auto-Reply) now gets a wider, larger featured
  card instead of a uniform 6-up grid. (Deliberately did *not* force this
  same pattern onto the Landing page's 4-item pillar grid — the math
  doesn't tile cleanly there without leaving an awkward gap, so it stays a
  clean uniform grid rather than a forced, slightly-broken-looking bento)
- Verified: full tsc + build pass, live smoke test confirms every route
  still returns 200 after the removals and changes

**Full component audit — international-standard polish pass:**
- Did a systematic audit of every component before changing anything, rather
  than guessing what "Google/Zoho-level" means. Found two genuine functional
  bugs and three real polish gaps:
- **Critical bug fixed**: the marketing Navbar's nav links were simply
  `hidden` below the `md` breakpoint with no replacement — mobile visitors
  had no way to reach About/Services/Pricing/Careers/Contact at all. Added
  a real animated hamburger menu with a slide-down panel.
- **Critical bug fixed**: the portal's Sidebar had the identical bug
  (`hidden md:flex`, no mobile alternative) — the entire client portal was
  unusable on a phone. Added a proper slide-in mobile drawer with backdrop,
  matching the pattern used for the marketing nav.
- **User avatar added** (initials-in-a-circle, color derived from name) —
  a staple of every professional dashboard (Zoho, Google Workspace, etc.)
  that was completely missing. Now shown in the Sidebar's account footer
  and at the top of the Settings page.
- **Per-page browser tab titles** — every route previously showed the same
  static title; each page now sets its own via a small centralized
  `PageTitle` component (no per-page edits needed).
- **Smart route-transition fade** — pages now fade between each other on
  navigation, deliberately scoped so that navigating *within* the portal
  (Dashboard → Automation Center, etc.) does NOT retrigger the transition
  and remount the Sidebar — only top-level page changes (marketing ↔ auth
  ↔ portal) animate.
- Verified: full tsc + build pass, live smoke test with both servers
  running confirms every route (including `/login`, `/signup`) still
  returns 200 and the backend health check responds correctly.

**Deliberately deferred, flagged rather than silently skipped:** a full
empty-state redesign for lists that are genuinely empty (low priority since
the demo data means this rarely triggers), and dark mode (still its own
dedicated pass, as noted earlier in this log).

**Database migration — Supabase (Postgres)**
- Migrated off the in-memory store entirely. Every route (auth, rules,
  tickets, leads, activity log, dashboard stats) now reads/writes real
  Postgres via Supabase — the #1 item from the production checklist above
  is done.
- New `backend/supabase/schema.sql` — run this once in your Supabase
  project's SQL Editor before first use. Includes tables for users, rules,
  tickets, leads, activity_log, plus two small Postgres functions
  (`next_ticket_number`, `simulate_order`) for atomic counters that used to
  be plain in-memory variables.
- New `backend/src/lib/supabase.ts` — lazy-initialized client (same pattern
  as the Anthropic client), using the secret key server-side only.
- Every `store.*` function is now `async` — every route calling it was
  updated to `await` it, including the cron jobs in `index.ts`.
- Updated the Claude model string from `claude-sonnet-4-6` to `claude-sonnet-5`
  (the newer default) across `ai.ts` and `audit.ts`.
- **Important limitation**: this sandbox's network can't reach `supabase.co`
  (confirmed directly — a raw request returns `host_not_allowed`), so the
  live database connection itself is untested from here. The code compiles
  clean (`tsc` + `npm run build` both pass) and the server boots correctly —
  confirmed `/api/health` (no DB dependency) works and `/api/automation/rules`
  (needs DB) fails with a clean, expected network error rather than a code
  crash. **You'll need to run `schema.sql` in your Supabase project and do
  the final live connectivity test yourself.**

**Swapped Claude for Google Gemini — genuinely free, no card required**
- Researched current free AI API options rather than guessing. Anthropic's
  API has no free tier at all (confirmed current pricing: no free tier for
  direct API access, payment required from the first request). Google
  Gemini's free tier (Gemini 2.5 Flash, via Google AI Studio) needs no
  credit card and comfortably covers demo-scale traffic — and since the app
  already uses a Google Cloud project for OAuth, it's the same ecosystem.
- New `backend/src/lib/gemini.ts` replaces `anthropic.ts` entirely — same
  system prompts, same exported shape, but backed by the Gemini SDK.
  The Automation Audit tool now uses Gemini's native JSON response mode
  instead of manually stripping markdown fences from a text reply.
- Updated every route (`ai.ts`, `audit.ts`) and removed the unused
  `@anthropic-ai/sdk` dependency entirely.
- Swept the whole app for "Claude"/"Anthropic" copy that would now be
  inaccurate — Terms, Privacy, trust badges, error messages, and the
  onboarding tour all correctly say Gemini now.
- **Same sandbox limitation as Supabase**: this environment can't reach
  `generativelanguage.googleapis.com` either (confirmed directly). Code
  compiles clean and the server degrades gracefully (a clear 503) without
  a real key — the live AI response itself needs testing with a real
  `GEMINI_API_KEY` outside this sandbox.
- Env var renamed: `ANTHROPIC_API_KEY` → `GEMINI_API_KEY` (get one free at
  aistudio.google.com/apikey).

See `PROJECT-PLAN.md` for what's next.

---

## Portal/dashboard/auth removed entirely

After discussion, decided the client portal (Dashboard, Automation Center,
AI Assistant page, Content Studio, Insights, Maintenance, Settings) and the
whole login/signup/auth system should be removed completely, not just
unlinked from the nav as in the previous pass. Reasoning: a generic,
one-size-fits-all demo dashboard risked implying every client gets the same
fixed product, which contradicts Grovance's actual custom-build positioning.
The Free Automation Audit tool already does the "prove it live" job better —
no login needed, genuinely personalized per visitor, demoable in front of a
prospect on the spot.

**Frontend removed:** Login/Signup pages, Dashboard, Automation Center, AI
Assistant page, Content Studio, Insights, Maintenance, Settings, Sidebar,
Layout, RequireAuth, GuidedTour, CommandPalette, Avatar, GoogleAuthButton,
AuthContext, ToastContext, and utility components only they used
(ConfettiBurst, Skeleton, Sparkline, UptimeRing, PasswordStrength).
`App.tsx`/`main.tsx` rewritten as a pure marketing-site router with no auth
wrapping. Fixed every remaining page that referenced the portal (Landing's
floating stat cards depended on the now-removed automation stats endpoint;
Services' "see it live" links pointed to deleted portal routes; About and
ChatWidget copy mentioned the portal directly) — all repointed to the Audit
tool or removed. `api.ts` trimmed from 15 methods to 3 (health, chat, leads,
audit). Removed unused `@react-oauth/google` dependency. Frontend bundle
dropped from ~478KB to ~420KB as a direct result.

**Backend removed:** `auth.ts`, `automation.ts`, `tickets.ts`,
`changelog.ts`, `lib/auth.ts` deleted entirely. `ai.ts` trimmed to just the
`/chat` endpoint (used by the marketing ChatWidget) — `/generate` and
`/insights` deleted along with the pages that called them. `store.ts`
trimmed from ~15 exported functions covering users/rules/tickets/stats down
to 3: `logActivity`, `addLead`, `listLeads`. Removed now-unused dependencies
(`bcryptjs`, `jsonwebtoken`, `google-auth-library`, `node-cron`).

**Database schema trimmed too:** `schema.sql` now defines only two tables
(`leads`, `activity_log`) instead of seven. Added
`cleanup-legacy-portal-tables.sql` specifically to drop the old
`users`/`rules`/`tickets`/`ticket_counter`/`metrics` tables and their
Postgres functions from an **existing** Supabase project that was already
set up with the larger schema — run once, doesn't touch `leads`/`activity_log`.

**Verified:** full `tsc` + build pass on both frontend and backend (clean
on the first pass despite the scale of the removal). Live smoke test with
both servers running confirmed every remaining route returns 200, the
backend health check responds correctly, and the audit endpoint's error
handling still works as expected.
