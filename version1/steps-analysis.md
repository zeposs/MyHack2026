# StarsConnector — Hackathon Steps Analysis

## Confirmed Decisions

| Decision | Answer |
| --- | --- |
| Project name | **StarsConnector** |
| Backend | **Python FastAPI** |
| AI | **Gemini API** (gemini-1.5-flash) |
| Deployment | **Google Cloud** — Cloud Run (API) + Firebase Hosting (frontend) |
| Time budget | **5 hours** |
| Team split | **Frontend track + Backend track** |
| Event context | **Google / GCP event** — lean into the full Google stack |
| Branding | Keep existing design, rename MentorBridge → StarsConnector |
| Seed data | Keep existing names (Ahmad, Sarah, Raj, David, Nurul) |

---

## What We Have

**Current state:** `version1/index.html` — polished frontend-only mockup

- 3 role views: Program Owner, Mentor, Participant
- 7-step AI mentor matching wizard (UI only, hardcoded mock data)
- All data hardcoded — no API calls, no persistence

**What the HTML still says:** "MentorBridge" → must be renamed to "StarsConnector"

---

## Demo Story (What Judges Will See)

```text
1. Open StarsConnector (live on Firebase Hosting URL)
2. Create programme "Google for Startups — Fintech Cohort"
3. Add startup "PayFast" (payments, B2C)
4. Click "Find Mentors"
   → Gemini (on Cloud Run) returns: Ahmad 94%, Sarah 81%, Raj 67% + reasons
5. Approve Ahmad, reject Sarah → statuses update
6. Switch to Mentor view — Ahmad sees the match + Gemini reason
7. One relationship shows amber "Needs Attention" badge (quiet 15 days)
8. Closing line: "Built on Gemini + Cloud Run + Firebase. Full Google stack."
```

**Every build decision must serve this story.**

---

## Architecture

```text
Firebase Hosting               Cloud Run (FastAPI)          Google AI
────────────────               ───────────────────          ──────────
version1/index.html ── fetch ──▶  POST /api/match    ──────▶ Gemini API
(StarsConnector UI)               GET  /api/mentors           (gemini-1.5-flash)
                                  GET  /api/programmes
                                  POST /api/programmes
                                  POST /api/relationships
                                  PATCH /api/relationships/{id}

                               SQLite (in Cloud Run container)
                               tables: actors, programmes, relationships
```

---

## 5-Hour Timeline

### Hour 0 (Parallel setup — do immediately)

**Frontend track:**

- [ ] Get Gemini API key at aistudio.google.com
- [ ] Rename all "MentorBridge" → "StarsConnector" in `version1/index.html`
- [ ] Rename all "EcoLink" → "StarsConnector"

**Backend track:**

- [ ] Create `backend/` folder structure
- [ ] `pip install fastapi uvicorn google-generativeai python-dotenv`
- [ ] Set up `gcloud` CLI + Firebase CLI (if not done)

---

### Hour 1 — Backend foundation (Backend track)

- [ ] `database.py` — SQLite setup with 3 tables + seed data
- [ ] `main.py` — FastAPI app with CORS
- [ ] `GET /api/mentors` → list mentors
- [ ] `GET /api/startups` → list startups
- [ ] `GET /api/programmes` → list programmes
- [ ] `POST /api/programmes` → create programme
- [ ] Test: `uvicorn main:app --reload` returns data

### Hour 1 — Frontend scaffold (Frontend track)

- [ ] Add `const API_BASE = 'http://localhost:8000'` at top of script
- [ ] Replace static mentor sidebar list with live `fetch(API_BASE + '/api/mentors')`
- [ ] Replace static programme list with `fetch(API_BASE + '/api/programmes')`
- [ ] Verify renaming is complete — no "MentorBridge" left anywhere

---

### Hour 2 — Gemini AI matching (Backend track)

- [ ] `gemini.py` — Gemini client + prompt template
- [ ] `POST /api/match` — takes `{ startup_id, programme_id }`, calls Gemini, returns ranked list
- [ ] `POST /api/relationships` — creates proposed relationship
- [ ] `PATCH /api/relationships/{id}` — approve / reject (updates status)
- [ ] Test match endpoint with curl or Postman

### Hour 2 — Wire matching wizard (Frontend track)

- [ ] Step 4 (AI scanning): replace setTimeout with real `POST /api/match` call
- [ ] Step 5 (results): render live Gemini scores + reasons instead of hardcoded 97%/82%/74%
- [ ] "Approve" button → `POST /api/relationships` + `PATCH` to active
- [ ] "Reject" button → `PATCH` to rejected
- [ ] Show loading spinner while Gemini call is in flight

---

### Hour 3 — Relationship lifecycle + health (Backend track)

- [ ] `GET /api/relationships` — returns all with `needs_attention` flag
- [ ] Health rule: `last_activity_at` > 14 days ago → `needs_attention: true`
- [ ] `GET /api/dashboard/stats` — counts for stat cards
- [ ] Seed one relationship with `last_activity_at = 15 days ago` for demo
- [ ] Start writing `Dockerfile` for Cloud Run

### Hour 3 — Dashboard live data + flags (Frontend track)

- [ ] Stat cards fetch from `GET /api/dashboard/stats`
- [ ] Active relationships list fetches from `GET /api/relationships`
- [ ] Show amber "Needs Attention" badge on flagged rows
- [ ] "Start New Programme" button → modal → `POST /api/programmes`

---

### Hour 4 — Deployment (Both tracks)

**Backend track — Cloud Run:**

- [ ] Finish `Dockerfile`
- [ ] `gcloud run deploy StarsConnector-api --source ./backend --region asia-southeast1 --allow-unauthenticated`
- [ ] Set `GEMINI_API_KEY` as Cloud Run env var
- [ ] Note the deployed URL (e.g. `https://StarsConnector-api-xxxx-as.a.run.app`)

**Frontend track — Firebase Hosting:**

- [ ] Update `API_BASE` in `index.html` to Cloud Run URL
- [ ] `firebase init hosting` (public dir: `version1/`)
- [ ] `firebase deploy`
- [ ] Verify live URL works end-to-end

---

### Hour 5 — Reuse engine + polish (Both tracks)

**Backend track (if time):**

- [ ] `GET /api/relationships/suggestions` — completed with score ≥ 4
- [ ] Returns: `[{ mentor_name, startup_name, score, past_reason }]`

**Frontend track (if time):**

- [ ] After "Start New Programme", show suggestion cards: "Reuse Ahmad? (Past score: 4.8)"

**Both — demo rehearsal:**

- [ ] Run the full 8-step demo script twice
- [ ] Verify CORS between Firebase URL and Cloud Run URL
- [ ] Have localhost fallback ready if Cloud Run is slow
- [ ] Confirm closing line is in the pitch: "Full Google stack — Gemini, Cloud Run, Firebase"

---

## Gemini Prompt Template

```python
MATCH_PROMPT = """
You are a coordinator for a Google for Startups Accelerator programme.

Programme: {programme_name}
Startup: {startup_name}
Startup profile: {startup_profile}
Startup needs (tags): {startup_tags}

Available mentors:
{mentor_list}

Rank the top 3 mentors for this startup. For each, give:
- A match score from 0 to 100
- A 1-sentence plain-English reason why they fit this startup

Respond in this exact JSON format only:
[
  {{"mentor_id": 1, "score": 94, "reason": "..."}},
  {{"mentor_id": 3, "score": 81, "reason": "..."}},
  {{"mentor_id": 5, "score": 67, "reason": "..."}}
]

Return only the JSON array. No explanation, no markdown, no code fences.
"""
```

---

## File Structure to Create

```text
MyHack2026/
├── PRD.md
├── steps-analysis.md
├── version1/
│   └── index.html              ← frontend (rename + wire up)
└── backend/
    ├── main.py                 ← FastAPI routes
    ├── models.py               ← Pydantic schemas
    ├── database.py             ← SQLite setup + seed data
    ├── gemini.py               ← Gemini API integration
    ├── requirements.txt
    ├── Dockerfile
    └── .env                    ← GEMINI_API_KEY (never committed)
```

---

## Environment Variables

```text
GEMINI_API_KEY=...
FRONTEND_ORIGIN=https://[firebase-project-id].web.app
```

---

## Cut List (If Behind Schedule)

Drop without hurting core demo:

- Reuse engine (N1) → hardcode one suggestion card as fallback
- Mentor view live data → keep static, it still looks good
- "Start New Programme" modal → skip, demo the matching directly
- Cloud Run deploy → fall back to localhost demo if deploy takes too long

---

## Deployment Commands (Quick Reference)

```bash
# Backend → Cloud Run
gcloud run deploy StarsConnector-api \
  --source ./backend \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY_HERE

# Frontend → Firebase Hosting
firebase init hosting
firebase deploy
```
