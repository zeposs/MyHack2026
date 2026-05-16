# PRD — StartConnector

**Tagline:** AI-powered Relationship Operating System for startup and innovation ecosystems
**Version:** 1.0 (Hackathon)
**Date:** 2026-05-16
**Event:** Google / GCP Hackathon

---

## 1. Problem Statement

Every innovation ecosystem — accelerators, government programmes, Google for Startups cohorts — runs on relationships. But today those relationships are managed manually, forgotten between cohorts, and never monitored once made.

Three specific failures:

**No Memory** — When a programme ends, all relationship data disappears. The next cohort starts from zero. Mentors who were outstanding last cycle are never surfaced. Failed matches are repeated. The system has no institutional knowledge.

**Manual Matching** — Admins read dozens of profiles, copy-paste bios into spreadsheets, and guess at fit. This takes hours, introduces human bias, and scales to maybe 20 relationships before breaking. AI can evaluate every possible pairing in seconds — with evidence.

**No Monitoring** — Once a match is approved, the admin's job is considered done. Nobody tracks whether the relationship is actually working. Mentors go quiet. Startups get stuck. Problems surface only when it's too late to intervene.

**StartConnector** solves all three. It treats every mentor, startup, partner, programme, event, and outcome as a first-class data entity — building an ecosystem memory that grows smarter with every relationship recorded.

---

## 2. Product Pillars

### Pillar 1 — Relationship Graph Engine

The system is not a spreadsheet. Every entity is a node:

- **Actors:** Mentors, Startups, Partners, Organisations
- **Programmes:** Cohorts, accelerator batches, events
- **Relationships:** The edges between actors — with type, status, outcome, and history
- **Outcomes:** What was achieved, scored 1–5
- **Feedback:** What the admin and participants said about each relationship

This graph becomes the **data moat** — the system gets smarter with every cohort. Recommending Ahmad to PayFast is better the second time, because we know Ahmad scored 4.8 with a similar fintech startup last year.

### Pillar 2 — AI Matching & Coordination Layer

Admins describe what they need in natural language:

> *"Find 3 fintech mentors for Malaysian early-stage startups in our current cohort."*

The AI:

1. Parses the intent and extracts filters (domain, geography, stage)
2. Searches all mentor profiles and their relationship history
3. Ranks the best matches with a score (0–100)
4. Explains **why** each mentor fits — in plain English
5. Shows **evidence** — "Ahmad mentored 2 fintech startups before, both scored 4+ outcomes"
6. Lets the admin approve, reject, or request alternatives
7. Stores the admin's decision to improve future matching

### Pillar 3 — Ecosystem CRM with Intelligent Autopilot

Every relationship has a lifecycle:

```text
Proposed → Matched → Active → Check-in Due → Completed → Archived
```

The AI monitors each relationship and:

- Flags when a relationship has been quiet for 14+ days → "Check-in Due"
- Surfaces risk: "LoanEase has not logged any sessions in 3 weeks"
- Suggests next-best actions: "Schedule a mid-programme review"
- Recommends reusing past successful pairs when a new programme starts
- Identifies which startups or mentors are ready for the next cohort

---

## 3. Target Users

### Programme Owner (Admin)

- **Who:** Google for Startups Accelerator programme manager, ecosystem lead
- **Goal:** Run a high-quality mentorship programme without the admin burden
- **Pain:** Manual matching, no visibility into relationship health, starts every cohort from scratch
- **Value from StartConnector:** AI matches in seconds, dashboard shows health of every relationship, history carries forward

### Mentor

- **Who:** Experienced founder, corporate exec, domain expert
- **Goal:** Give focused mentorship where their expertise truly fits
- **Pain:** Matched to startups outside their domain; no advance context about the startup's challenge
- **Value from StartConnector:** Matched by AI based on actual expertise; sees why they were chosen; has session history in one place

### Startup Participant

- **Who:** Early-stage founder enrolled in an accelerator
- **Goal:** Get the right mentor for their specific challenge right now
- **Pain:** Generic assignment; no way to see who fits or why
- **Value from StartConnector:** Guided wizard asks about the challenge, AI surfaces ranked mentors with reasons, founder understands the recommendation before saying yes

---

## 4. Core Features

### Must Have — Hackathon Demo (Hours 1–3)

| # | Feature | Description |
| --- | --- | --- |
| M1 | Entity profiles | Mentor and startup profiles: bio, tags, domain, past outcomes |
| M2 | Natural language matching | Admin types a request → Gemini parses + ranks mentors |
| M3 | Match explanation + evidence | Each suggestion shows score, reason, and relevant past outcome |
| M4 | Approve / reject flow | Admin clicks to approve or reject; status updates to DB |
| M5 | Relationship lifecycle | Dashboard shows each relationship's current stage |
| M6 | Needs Attention flag | Auto-flag if `last_activity_at` > 14 days |

### Should Have — Stronger Demo (Hour 4)

| # | Feature | Description |
| --- | --- | --- |
| S1 | Dashboard stats | Live counts: participants, mentors, active relationships, risks |
| S2 | Programme creation | Admin creates a new cohort via the dashboard |
| S3 | Reuse suggestion | When starting a new programme, surface high-scoring past matches |
| S4 | Mentor view | Mentor sees their matches, Gemini reason, and session history |

### Nice to Have — Impress Judges (Hour 5, if time)

| # | Feature | Description |
| --- | --- | --- |
| N1 | Next-best action suggestions | Gemini suggests "Schedule mid-programme review" for at-risk relationships |
| N2 | Risk narrative | Dashboard card explaining *why* a relationship is at risk |
| N3 | Participant booking wizard | Startup-facing guided flow to request a mentor match |

### Out of Scope (Hackathon)

- Authentication (hardcode 3 personas)
- Email / push notifications
- Mobile app
- Multi-language support
- Payment / billing

---

## 5. User Stories

### Programme Owner

```text
As a Programme Owner,
I want to type "Find fintech mentors for PayFast"
So that Gemini instantly returns ranked mentors with scores, reasons,
and evidence from past outcomes — without me reading a single profile.

As a Programme Owner,
I want to see every relationship's current lifecycle stage on one dashboard
So that I always know what's active, what needs attention, and what's at risk.

As a Programme Owner,
I want the system to flag relationships that have gone quiet for 14 days
So that I can intervene before a mentorship silently fails.

As a Programme Owner,
I want to start a new programme and see suggestions to reuse past
high-performing mentor-startup pairs
So that the system gets smarter — and my job gets easier — every cohort.
```

### Mentor Stories

```text
As a Mentor,
I want to see which startups I am matched with and why Gemini chose me
So that I can prepare a session that addresses their actual challenge.
```

### Startup Participant Stories

```text
As a Startup Participant,
I want to go through a short wizard describing my challenge
So that the AI surfaces the top 3 mentors most relevant to me,
with a plain-English reason for each.
```

---

## 6. Technical Architecture

### Stack (Full Google)

| Layer | Technology | Why |
| --- | --- | --- |
| Frontend | Vanilla HTML/CSS/JS | Already built, no build step, fast to modify |
| Frontend hosting | Firebase Hosting | One-command deploy, Google CDN |
| Backend | Python FastAPI | Fast to write, async, great for AI integration |
| Backend hosting | Cloud Run | Serverless, auto-scale, `gcloud run deploy` in one command |
| Database | SQLite | Zero setup, file-based, perfect for hackathon |
| AI | Gemini API (`gemini-1.5-flash`) | Fast, cheap, great at structured JSON output |

### Request Flow

```text
Browser (Firebase)
  └── fetch POST /api/match
        └── Cloud Run (FastAPI)
              ├── reads mentor profiles from SQLite
              ├── builds structured prompt
              └── calls Gemini API
                    └── returns: [{mentor_id, score, reason, evidence}]
```

### API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/mentors` | All mentor profiles |
| GET | `/api/startups` | All startup profiles |
| GET | `/api/programmes` | All programmes |
| POST | `/api/programmes` | Create programme |
| POST | `/api/match` | Natural language or structured match request → Gemini |
| GET | `/api/relationships` | All relationships with stage + needs_attention |
| POST | `/api/relationships` | Create proposed relationship |
| PATCH | `/api/relationships/{id}` | Update status / record decision |
| GET | `/api/dashboard/stats` | Counts for stat cards |
| GET | `/api/relationships/suggestions` | Past high-scoring matches for reuse |

---

## 7. Data Model

```sql
-- Every person and organisation in the ecosystem
actors (
  id            INTEGER PRIMARY KEY,
  name          TEXT NOT NULL,
  type          TEXT NOT NULL,    -- 'mentor' | 'startup' | 'partner'
  bio           TEXT,
  tags          TEXT,             -- "fintech,payments,b2c,malaysia"
  domain        TEXT,             -- "fintech" | "logistics" | "hr-tech"
  stage         TEXT,             -- for startups: "pre-seed" | "seed" | "series-a"
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- Cohorts, batches, events
programmes (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  status      TEXT DEFAULT 'active',   -- 'active' | 'completed'
  start_date  DATE,
  end_date    DATE,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- The core entity: every relationship, with full history
relationships (
  id                INTEGER PRIMARY KEY,
  mentor_id         INTEGER REFERENCES actors(id),
  startup_id        INTEGER REFERENCES actors(id),
  programme_id      INTEGER REFERENCES programmes(id),
  status            TEXT DEFAULT 'proposed',
  -- lifecycle: proposed | matched | active | checkin_due | completed | archived | rejected
  outcome_score     REAL,           -- 1.0–5.0, filled on completion
  ai_match_reason   TEXT,           -- Gemini's explanation, stored permanently
  ai_match_score    INTEGER,        -- 0–100
  ai_evidence       TEXT,           -- past outcome evidence Gemini cited
  last_activity_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- Admin decisions — used to improve future matching
match_feedback (
  id              INTEGER PRIMARY KEY,
  relationship_id INTEGER REFERENCES relationships(id),
  decision        TEXT,             -- 'approved' | 'rejected'
  rejection_reason TEXT,            -- optional, captured to improve AI
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## 8. AI Matching Design

### Natural Language Flow

Admin input:

> *"Find 3 e-commerce mentors for Malaysian early-stage startups"*

System:

1. Passes raw input + all mentor profiles + relationship history to Gemini
2. Gemini extracts: `{ domain: "e-commerce", geography: "Malaysia", stage: "early-stage", count: 3 }`
3. Gemini ranks mentors against those filters AND past outcome data
4. Returns structured JSON with score, reason, and evidence

### Prompt Strategy

```python
MATCH_PROMPT = """
You are an AI coordinator for a Google for Startups Accelerator programme.
Your job is to match mentors to startups based on profile fit AND past relationship outcomes.

Admin request: "{admin_query}"

Startup context:
{startup_profile}

Available mentors (with past outcome history):
{mentor_list_with_history}

Return the top 3 mentor matches. For each, provide:
- mentor_id: integer
- score: 0–100 fit score
- reason: one plain-English sentence explaining the fit
- evidence: one sentence citing a relevant past outcome if available
  (e.g. "Ahmad mentored a payments startup in Batch 5 and scored 4.8/5")
  If no past data, write "No prior history — profile match only."

Return ONLY a JSON array. No markdown. No explanation outside the array.
[
  {{"mentor_id": 1, "score": 94, "reason": "...", "evidence": "..."}},
  ...
]
"""
```

### Evidence Design

Each mentor's entry in the prompt includes their past relationships:

```text
Name: Ahmad Razif
Tags: fintech, payments, B2C
Bio: Ex-Grab Payments lead, 12 years in financial infrastructure
Past outcomes:
  - Batch 3, PayNow (fintech): score 4.8/5 — "Helped us close Series A after restructuring our revenue model"
  - Batch 4, CashFlow (SME lending): score 4.2/5 — "Strong domain fit, sessions were highly structured"
```

This is the **data moat** — every completed relationship improves future recommendations.

---

## 9. Relationship Lifecycle & Autopilot

```text
Proposed → Matched → Active → Check-in Due → Completed → Archived
                                    ↑
                               (AI flag: 14 days quiet)
```

| Stage | Trigger | AI Action |
| --- | --- | --- |
| Proposed | Admin initiates match request | Gemini generates ranked suggestions |
| Matched | Admin approves | Relationship created, mentor + startup notified |
| Active | First session logged | Health monitoring begins |
| Check-in Due | No activity for 14 days | Flag on dashboard, suggested next action |
| Completed | Programme end | Admin rates outcome (1–5), stored as future evidence |
| Archived | 30 days post-completion | Moved to history, available for reuse |

---

## 10. Demo Flow (8-Step Judge Walkthrough)

```text
[1] Admin opens StartConnector dashboard (live Firebase URL)
    → Stat cards: 12 Participants | 8 Active Mentors | 3 At Risk | 24 Total Relationships

[2] Admin sees the relationship table — each row shows actor, stage, health badge

[3] Admin types: "Find fintech mentors for PayFast — they need help with payments infrastructure"
    → Natural language query triggers POST /api/match

[4] Gemini returns in ~2 seconds:
    ① Ahmad Razif   94%
       Reason: "Deep payments infrastructure experience directly matches PayFast's challenge"
       Evidence: "Mentored CashFlow in Batch 4 — outcome score 4.8/5"
    ② Sarah Chen    81%
       Reason: "B2C growth expertise fits PayFast's customer acquisition need"
       Evidence: "No prior fintech history — profile match only"
    ③ Raj Krishnan  67%
       Reason: "Fintech background is relevant, but his focus is B2B SaaS, not B2C payments"
       Evidence: "Mentored LendMe in Batch 2 — outcome score 3.9/5"

[5] Admin clicks ✓ Approve Ahmad → status: Matched → Active
    Admin clicks ✗ Reject Raj → captures reason "Wrong segment"

[6] Switch to Mentor view → Ahmad sees "PayFast" match, the Gemini reason, and session tab

[7] Back to dashboard → one row shows amber badge "Check-in Due"
    Tooltip: "No activity logged for 15 days — consider scheduling a mid-programme check-in"

[8] Admin clicks "New Programme" → system shows:
    "Ahmad Razif performed well last cohort (4.8/5 with a similar startup) — reuse?"

Closing pitch line:
"StartConnector — an AI-powered Relationship Operating System for ecosystems.
 Built on Gemini, Cloud Run, and Firebase. The more programmes you run, the smarter it gets."
```

---

## 11. Seed Data

### Mentors

| Name | Domain | Tags | Past Record |
| --- | --- | --- | --- |
| Ahmad Razif | Fintech | payments, B2C, infrastructure | Batch 3: PayNow 4.8/5, Batch 4: CashFlow 4.2/5 |
| Sarah Chen | Growth | B2C, marketing, SEA | Batch 2: ShopEasy 4.5/5 |
| Raj Krishnan | SaaS | B2B, enterprise sales, fintech | Batch 2: LendMe 3.9/5 |
| David Lim | Logistics | operations, supply chain, ASEAN | Batch 1: DeliverX 4.1/5 |
| Nurul Ain | HR Tech | talent, HR, angel | No prior history |

### Startups (Current Cohort)

| Name | Domain | Tags | Stage |
| --- | --- | --- | --- |
| PayFast | Fintech | payments, B2C, Malaysia | Seed |
| LoanEase | Lending | B2B, SME, AI | Pre-seed |
| TrackIt | Logistics | SaaS, last-mile, e-commerce | Seed |

### Seeded Relationships (For Demo)

| Mentor | Startup | Programme | Status | Last Activity |
| --- | --- | --- | --- | --- |
| Ahmad | PayNow (past) | Batch 3 | Completed | — |
| Ahmad | CashFlow (past) | Batch 4 | Completed | — |
| David | TrackIt | Current | Active | 15 days ago → Check-in Due |

---

## 12. Deployment

### Backend → Cloud Run

```bash
gcloud run deploy startconnector-api \
  --source ./backend \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY
```

### Frontend → Firebase Hosting

```bash
firebase init hosting   # public dir: version1/
firebase deploy
```

### Environment Variables

```text
GEMINI_API_KEY=...
FRONTEND_ORIGIN=https://[project].web.app
```

---

## 13. Success Criteria

A judge watching the demo should immediately be able to answer:

- [ ] What problem does this solve? → Manual ecosystem coordination — no memory, no matching, no monitoring
- [ ] How does the AI help? → Natural language → ranked matches with evidence from past outcomes
- [ ] What happens after the match? → Lifecycle tracked automatically, health monitored, risks flagged
- [ ] What makes it different? → It's a relationship memory — every outcome improves the next recommendation
- [ ] Why Google? → Gemini + Cloud Run + Firebase — full Google stack, scales without infrastructure work
- [ ] What's the long-term value? → Data moat: the more programmes you run, the smarter it gets
