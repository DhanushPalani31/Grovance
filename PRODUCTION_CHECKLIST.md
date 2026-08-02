# Grovance — Production Deployment Checklist

## 🔴 Critical — will break or lose data if skipped

### 1. Real database (the single biggest blocker)
Right now, **every piece of data lives only in memory** (`backend/src/lib/store.ts`):
users, tickets, leads, automation rules, activity log — all of it.
**Every server restart or redeploy wipes everything.** A real user could sign
up, and their account would vanish the next time the backend restarts.

- Move to PostgreSQL. Free options: **Supabase**, **Neon**, or **Railway Postgres**.
- Either use raw `pg` queries or add an ORM (Prisma is the natural fit given
  the existing TypeScript codebase).
- This is genuinely the most important thing on this list — everything else
  is secondary if data doesn't persist.

### 2. Environment variables on your hosting platform
None of your local `.env` files travel with you — you have to set these
directly in whatever hosting dashboard you use.

**Backend needs:**
| Variable | Notes |
|---|---|
| `DATABASE_URL` | Once you add a real database |
| `JWT_SECRET` | A real random secret — **not** the `dev-secret-for-local-testing-only` value |
| `ANTHROPIC_API_KEY` | Required for every AI feature (Assistant, Content Studio, Insights, Audit) |
| `GOOGLE_CLIENT_ID` | Same value as frontend's |
| `GITHUB_TOKEN`, `GITHUB_REPO` | Optional, avoids the changelog hitting GitHub's public rate limit |
| `NODE_ENV=production` | |

**Frontend needs:**
| Variable | Notes |
|---|---|
| `VITE_API_URL` | Your deployed backend's real URL, not `localhost:4000` |
| `VITE_GOOGLE_CLIENT_ID` | Same value as backend's `GOOGLE_CLIENT_ID` |

### 3. Google OAuth — add your real domain
In Google Cloud Console → your OAuth Client → **Authorized JavaScript origins**,
add your actual production domain (e.g. `https://grovance.app`). It currently
likely only has `localhost` — Google will silently reject sign-ins from any
origin not explicitly listed.

### 4. CORS is currently wide open
`backend/src/index.ts` uses `cors()` with no restriction — any website can
call your API right now. Before going live, restrict it to your actual
frontend domain.

---

## 🟠 Important — should do before real users show up

### 5. Rate limiting on auth endpoints
There's currently no limit on how many times someone can hit `/api/auth/register`
or `/api/auth/login` — worth adding `express-rate-limit` so the app isn't
trivially abusable.

### 6. Security headers
No `helmet` middleware yet — a one-line addition that sets sensible default
security headers.

### 7. Legal pages need real review
Terms of Service and Privacy Policy are complete, honest **drafts** — they
say so themselves in an on-page notice. Before real customers sign up, have
an actual lawyer review them (governing law, and GDPR/CCPA language if you'll
have customers outside India).

### 8. Domain + SSL
- Buy a domain if you don't have one (`grovance.app`-style, or similar)
- Point DNS at your hosting provider
- SSL is usually automatic on Vercel/Render/Railway — just confirm it's active

---

## 🟡 Recommended, not blocking

### 9. Error monitoring
No way to know if something breaks in production right now beyond checking
logs manually. **Sentry** has a workable free tier and is a quick add.

### 10. Uptime monitoring
The Maintenance page's health check is self-reported. An external monitor
(**UptimeRobot** or **Better Uptime**, both have free tiers) gives an
independent, more credible signal — especially since "live uptime" is part
of your actual pitch to clients.

### 11. Analytics
No visitor analytics currently. **Plausible** or **Google Analytics** if you
want to see real traffic/conversion data on the Audit tool.

### 12. SEO basics
No `sitemap.xml` or `robots.txt` yet. Quick to add, helps discoverability.

---

## Suggested hosting setup (all free-tier-friendly)

| Piece | Suggested host | Note |
|---|---|---|
| Frontend | Vercel or Netlify | Static build output from `npm run build` |
| Backend | Render or Railway | Note: free tiers often spin down after inactivity — first request after idle can be slow (10-30s) |
| Database | Supabase or Neon | Free tier Postgres |

## Before you flip the switch — a final smoke test
1. Register a real account through the actual deployed frontend
2. Confirm Google Sign-In works from the real domain (not localhost)
3. Toggle an automation rule, click "Run Now," confirm it shows in the
   Activity Feed
4. Try the AI Assistant and Content Studio (needs `ANTHROPIC_API_KEY` live)
5. Submit the Automation Audit tool and confirm a real lead is captured
6. Restart the backend and confirm your test account/data survives — this
   is the one test that catches the #1 issue above if the database migration
   isn't done yet
