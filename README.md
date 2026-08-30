# NumberSmith

An adaptive math competition training platform for students from elementary school through high school.

The product is built around one question: **"What should this student practice next?"** Every feature — the placement test, the rating system, topic mastery tracking, the mistake queue, the study planner — exists to keep answering it.

**The entire training engine is deterministic. No AI is required for any core feature.**

---

## Quick start

```bash
npm install
```

```bash
npx prisma migrate dev
```

```bash
npm run db:seed
```

```bash
npm run dev
```

Then open http://localhost:3000.

### Seeded accounts

| Account | Email | Password | Notes |
| --- | --- | --- | --- |
| Admin | `admin@numbersmith.app` | `password123` | Full `/admin` access |
| Demo student | `demo@numbersmith.app` | `password123` | Fully onboarded, populated history |

Or click **Take the Free Assessment** to create a fresh account and go through the real funnel.

---

## The funnel

```
Visit → Create free account → Placement test → Discover your level
      → Choose competitions → Personalized training plan → Practice
      → Reach free limits → See what Pro unlocks → Upgrade if desired
```

The placement test is free and always available. Payment is never required to discover your level.

---

## How the adaptive engine works

All of it is deterministic and unit-testable. No model calls.

### Placement test — `src/lib/engine/placement.ts`

- Starting difficulty is derived from grade + self-reported prior experience.
- Correct → +1 difficulty; three in a row → +2. Incorrect → −1; two in a row → −2.
- Questions rotate through the eight topic domains so every domain gets sampled. Olympiad items only enter the rotation once a student reaches difficulty 8+.
- Stops between 20 and 30 questions: at 20+ it ends early once the served difficulty has settled into a band of ≤2 over the last six questions, otherwise it runs to 30.
- Final rating = `950 + 115 × (mean difficulty of last 6)` adjusted by accuracy, clamped to 800–2300.
- **Only domains actually tested appear in the skill breakdown.** Untested topics are omitted rather than given an invented score.

Verified against simulated students: a weak profile lands ~1245 (Developing), a mixed profile ~1534 (Intermediate), a strong profile ~1701 (Advanced).

### Practice selection — `src/lib/engine/practice.ts`

`rankTopicsByPriority` scores every domain as **competition weight × mastery gap**. Because weight comes from the student's *selected competitions*, an AMC 8 student and an AIME student with identical mastery get genuinely different plans:

| | AMC 8 student | AIME student |
| --- | --- | --- |
| Priority order | Arithmetic → Logic → Geometry → Number Theory | Algebra → Geometry → Number Theory → Combinatorics |

An AMC 8 student is never steered into olympiad material just because their olympiad mastery is low.

Difficulty then adapts to recent behavior:

| Signal | Response |
| --- | --- |
| Acing everything at current level | Raise difficulty |
| Repeatedly missing harder problems | Step back to medium |
| Accurate but slow | Timed practice (shorter problems) |
| Fast but inaccurate | Accuracy practice (slightly easier) |

### Rating — `src/lib/engine/rating.ts`

Elo-inspired. A problem's implied rating is `900 + 120 × difficulty`; the delta is `24 × (actual − expected)`. Students carry an overall rating plus competition-family ratings (AMC / MATHCOUNTS / OLYMPIAD), with full history for charting.

Tiers: 1000 Beginner · 1200 Developing · 1400 Intermediate · 1600 Advanced · 1800 Expert · 2000 Master · 2200+ Elite

### Topic mastery — `src/lib/engine/mastery.ts`

Exponential moving average (α = 0.25) so recent work dominates without single-problem whiplash. Subtopic practice also nudges the parent domain at α = 0.15.

### Daily challenge — `src/lib/engine/daily-challenge.ts`

The track (Elementary → Olympiad) is chosen from grade and rating. The problem is picked by indexing the eligible pool with days-since-epoch, so every student on a track sees the same problem on a given day, generated on demand with no cron job.

---

## Free vs Pro

`src/lib/subscription.ts` is the single source of truth for gating.

| | Free | Pro |
| --- | --- | --- |
| Placement test, level, skill breakdown | ✓ | ✓ |
| Competition selection & training plan | ✓ | ✓ |
| XP, streaks, achievements, topic mastery | ✓ | ✓ |
| Daily problems | 15/day | Unlimited |
| Competition simulations | 2/week | Unlimited |
| Lessons | Intro only | Full library |
| Problem database | Difficulty ≤ 7 | All difficulties |
| Mistake review | 10 most urgent | Full + spaced repetition |
| Statistics | Basic | Advanced |

Pricing lives in `src/lib/pricing.ts` ($7.99/mo, $59.99/yr). Upgrade prompts appear only at meaningful moments — hitting the daily cap, hitting the weekly simulation cap, opening a Pro lesson, or viewing statistics — never as interrupting popups.

### Subscription & Stripe readiness

`Subscription` stores `status` (FREE / PRO / TRIAL / CANCELED), `plan`, `startDate`, `renewalDate`, `trialEndsAt`, `paymentProvider`, `externalCustomerId`, and `canceledAt`.

**This MVP does not process payments.** `activateProAction` writes exactly the fields a Stripe webhook would write, so adding Stripe means replacing that function body with a Checkout Session redirect and moving the same writes into a `checkout.session.completed` handler. No schema or UI changes needed.

Trials expire on read — `getSubscription` reverts an elapsed trial to FREE, so access stays correct without a background worker. No user is ever charged automatically.

---

## Content and licensing

All 109 seeded problems are **original NumberSmith content**, written and mathematically verified for this platform. Nothing is transcribed from copyrighted competition archives.

Every problem carries `source`, `license`, `year`, and `author`, all editable in the admin problem editor.

NumberSmith provides independent practice tracks modeled on published competition formats and is **not affiliated with, endorsed by, or sponsored by** MAA, MATHCOUNTS, Math Kangaroo, MOEMS, HMMT, PUMaC, ARML, or any other competition organization. This is stated in the footer and on the competition directory.

---

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma · Recharts · `jose` + `bcryptjs` auth

### Database

Runs on **Postgres** (Neon), both locally and in production — `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct, used by migrations) point at the same database. Fields that would be native Postgres enums are instead `String` columns with allowed values documented in `prisma/schema.prisma`, mirrored as TypeScript unions in `src/lib/types.ts`, and validated with Zod at every write boundary — upgrading them to real `enum` blocks is a low-risk change if ever wanted, not a requirement.

Indexes are in place on the hot paths (attempts by user+date, problems by topic/difficulty/competition) to scale to tens of thousands of users and problems.

### Layout

```
prisma/
  schema.prisma          # 25 models
  seed.ts                # idempotent seed
  seed-data/             # topics, competitions, problems, lessons, achievements
src/
  app/
    (app)/               # authenticated shell — dashboard, practice, stats, …
    admin/               # admin-only, role-guarded in layout
    onboarding/          # profile → competitions → plan
    placement-test/      # free adaptive assessment
    pricing/
  lib/
    engine/              # the deterministic training engine
    actions/             # server actions, Zod-validated
    subscription.ts      # feature gating
```

---

## What's built

**Onboarding** — multi-step profile, adaptive placement test, results with skill breakdown, competition selection with a #1 priority, generated training plan.

**Training** — personalized dashboard, 109-problem searchable database with filtering, adaptive practice sessions, progressive hints, full solutions, 26 lessons following Concept → Explanation → Worked Example → Strategy → Common Mistakes → Practice → Challenge.

**Competitions** — 20 competitions with format/grade/difficulty/topic metadata, detail pages with roadmaps and readiness scoring.

**Simulations** — realistic timed interface with countdown, question navigator, flagging, and scratch notes; answers hidden until submission. Official formats (AMC 8: 25q/40m, AIME: 15q/180m, MathCounts Sprint: 30q/40m, …) plus a custom competition builder. Proof-based competitions correctly reject timed simulations.

**Progress** — XP and levels, streaks, 15 achievements, ratings with history charts, topic mastery, mistake review with spaced repetition, detailed statistics.

**Admin** — live analytics (no placeholder numbers; MRR is derived from actual stored subscriptions), full problem CRUD with publish/draft, and user role/subscription management.

## Not yet built

Parent and teacher dashboards, classes and assignments, family/school plans, competition packs, premium courses, and optional AI tutoring all have database models or architectural hooks in place but no UI. They are deliberately out of scope for this MVP.
