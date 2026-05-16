# MILESTONES — StarsConnector

Track progress here. Update checkboxes as each task is completed.
**Legend:** ✅ Done · 🔄 In Progress · ⬜ Not Started

---

## Phase 0 — Planning & Documentation
> Goal: Align the team on what we're building before writing any code.

- [x] Define product vision and three core pillars
- [x] Confirm tech stack (FastAPI + Gemini + Firebase + Cloud Run)
- [x] Confirm project name: StarsConnector
- [x] Write PRD.md — full product requirements
- [x] Write steps-analysis.md — 5-hour execution plan
- [x] Write API_CONTRACT.md — frontend ↔ backend JSON contract
- [x] Write SETUP.md — environment setup guide
- [x] Write PITCH.md — judge presentation script
- [x] Write MILESTONES.md — this file
- [ ] Get Gemini API key (aistudio.google.com)
- [ ] Verify gcloud CLI is installed and logged in
- [ ] Verify Firebase CLI is installed (`npm install -g firebase-tools`)

**Status: 🔄 In Progress**

---

## Phase 1 — Backend Foundation
> Goal: FastAPI server running locally with seed data. No AI yet.

- [ ] Create `backend/` folder structure
- [ ] Create `requirements.txt`
- [ ] Create `backend/.env` with `GEMINI_API_KEY`
- [ ] Create `database.py` — SQLite setup + 3 tables
- [ ] Seed mentors (Ahmad, Sarah, Raj, David, Nurul) with past outcomes
- [ ] Seed startups (PayFast, LoanEase, TrackIt)
- [ ] Seed programmes (Google for Startups — Fintech Cohort)
- [ ] Seed 1 relationship with `last_activity_at = 15 days ago` (for demo flag)
- [ ] Create `models.py` — Pydantic schemas
- [ ] Create `main.py` — FastAPI app with CORS
- [ ] `GET /api/mentors` working
- [ ] `GET /api/startups` working
- [ ] `GET /api/programmes` working
- [ ] `POST /api/programmes` working
- [ ] `GET /api/dashboard/stats` working
- [ ] Verify at `http://localhost:8000/docs`

**Status: ⬜ Not Started**

---

## Phase 2 — AI Matching (Core Feature)
> Goal: Gemini returns real ranked mentor matches from a natural language query.

- [ ] Create `gemini.py` — Gemini client + prompt builder
- [ ] Build prompt with mentor profiles + past outcome evidence
- [ ] `POST /api/match` endpoint — calls Gemini, returns ranked results
- [ ] Response matches API_CONTRACT.md exactly (mentor_id, score, reason, evidence)
- [ ] `POST /api/relationships` — creates relationship record
- [ ] `PATCH /api/relationships/{id}` — approve / reject / complete
- [ ] `GET /api/relationships` — returns all with `needs_attention` flag
- [ ] Test end-to-end with curl: query → Gemini response → stored relationship
- [ ] `GET /api/relationships/suggestions` — past high-scoring matches for reuse

**Status: ⬜ Not Started**

---

## Phase 3 — Frontend Wiring
> Goal: index.html talks to the real backend. No more hardcoded data.

- [ ] Rename all "MentorBridge" → "StarsConnector" in index.html
- [ ] Rename all "EcoLink" → "StarsConnector"
- [ ] Add `const API_BASE = 'http://localhost:8000'` at top of script
- [ ] Mentor sidebar loads from `GET /api/mentors`
- [ ] Programme list loads from `GET /api/programmes`
- [ ] Stat cards load from `GET /api/dashboard/stats`
- [ ] Relationship table loads from `GET /api/relationships`
- [ ] Amber "Needs Attention" badge renders for `needs_attention: true`
- [ ] Natural language query input wired to `POST /api/match`
- [ ] AI scanning animation shown while Gemini call is in flight
- [ ] Match result cards render live score + reason + evidence from API
- [ ] Approve button → `POST /api/relationships` + `PATCH` to active
- [ ] Reject button → `PATCH` to rejected (with optional reason)
- [ ] "Start New Programme" modal → `POST /api/programmes`
- [ ] Reuse suggestion cards load from `GET /api/relationships/suggestions`
- [ ] Mentor view shows active matches fetched from API

**Status: ⬜ Not Started**

---

## Phase 4 — Deployment
> Goal: Live on Firebase Hosting + Cloud Run. Demo-ready URL.

- [ ] Create `backend/Dockerfile`
- [ ] Deploy backend to Cloud Run (`gcloud run deploy`)
- [ ] Set `GEMINI_API_KEY` as Cloud Run environment variable
- [ ] Note the Cloud Run URL
- [ ] Update `API_BASE` in `index.html` to Cloud Run URL
- [ ] `firebase init hosting` (public dir: `version1/`)
- [ ] `firebase deploy --only hosting`
- [ ] Note the Firebase Hosting URL
- [ ] Update `FRONTEND_ORIGIN` in Cloud Run env vars to Firebase URL
- [ ] Verify CORS: no errors in browser console on the live URL
- [ ] Run full demo script against the live deployed URL

**Status: ⬜ Not Started**

---

## Phase 5 — Demo Polish
> Goal: The 8-step demo runs without a single error. Team is confident.

- [ ] Run full 8-step judge demo script from PITCH.md start to finish
- [ ] All stat card numbers look realistic (not 0 or null)
- [ ] Gemini response takes < 3 seconds on the live URL
- [ ] Loading spinner shows while AI call is in flight
- [ ] Approve + reject flow updates the dashboard without a page reload
- [ ] "Needs Attention" badge appears on David / TrackIt row
- [ ] Reuse suggestion appears when "New Programme" is clicked
- [ ] Mentor view (Ahmad) shows PayFast match + Gemini reason
- [ ] No console errors in browser DevTools
- [ ] Demo rehearsed at least 2 times by the presenter
- [ ] Fallback plan ready if Cloud Run is slow (localhost demo)
- [ ] Slide deck matches live demo UI

**Status: ⬜ Not Started**

---

## Quick Status Overview

| Phase | Description | Status |
| --- | --- | --- |
| 0 | Planning & Documentation | 🔄 In Progress |
| 1 | Backend Foundation | ⬜ Not Started |
| 2 | AI Matching | ⬜ Not Started |
| 3 | Frontend Wiring | ⬜ Not Started |
| 4 | Deployment | ⬜ Not Started |
| 5 | Demo Polish | ⬜ Not Started |

---

## Minimum to Demo

If time runs out, these are the **non-negotiable** items that must be done:

1. `POST /api/match` returns real Gemini results ← the core wow moment
2. Match cards show score + reason + evidence in the UI
3. Approve button works and updates the dashboard
4. "Needs Attention" badge is visible on at least one relationship
5. All "MentorBridge" renamed to "StarsConnector"
