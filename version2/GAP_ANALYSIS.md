# Gap Analysis: New Frontend → Existing Backend
**Date:** 2026-05-16  
**Scope:** `frontend-mockup-with-nobackend` wired to `backend`  
**Reference working baseline:** `frontend-simple` ↔ `backend`

---

## 1. API Gap — Missing or New Endpoints

### 1.1 Already Working (No Change Needed)

These endpoints exist in the backend and are already tested by `frontend-simple`.  
The new frontend can call them as-is.

| Endpoint | Method | What it returns |
|---|---|---|
| `/auth/login` | POST | JWT token |
| `/auth/me` | GET | Logged-in user profile |
| `/dashboard/stats` | GET | Counts for dashboard cards |
| `/applications` | GET | All applications (enriched) |
| `/applications/{id}` | GET | Single application detail |
| `/applications/{id}/status` | PATCH | Update status |
| `/applications/{id}/generate-matches` | POST | Run Gemini AI matching |
| `/applications/{id}/matches` | GET | Stored match results |
| `/applications/{id}/matches/select` | POST | Select a mentor |
| `/mentors` | GET | All mentor profiles |
| `/mentors/{id}` | GET | Single mentor profile |
| `/startups/{startup_id}/milestones` | GET | Milestone list for a startup |
| `/health` | GET | API health check |

---

### 1.2 Missing Endpoints — Must Build

#### A. Application Submission (Participant Tab)

**`POST /applications`**  
Create a new application linked to an existing startup profile and programme.

```
Request body:
{
  "programme_id": "uuid",
  "startup_profile_id": "uuid",          // or create inline
  "application_title": "string",
  "application_summary": "string",
  "requested_amount": number
}

Response: ApplicationDetail (same shape as GET /applications/{id})
```

**`POST /startups`** *(or `POST /startups/profile`)*  
Register a startup profile before submitting an application. Currently there is no way to create a `StartupProfile` via API — records only exist via seed data.

```
Request body:
{
  "startup_name": "string",
  "business_summary": "string",
  "industry": "string",
  "business_stage": "idea|prototype|mvp|revenue|growth",
  "problem_statement": "string",
  "solution_summary": "string",
  "target_market": "string",
  "business_model": "string",
  "monthly_revenue": number,
  "funding_needed": number,
  "team_size": number
}

Response: { startup_profile_id, startup_name, ... }
```

---

#### B. Session Booking (Cradle Admin Tab — Mentor Assignment)

**`POST /applications/{id}/sessions`**  
Book a session between a founder and a selected mentor. The mock shows a date/time picker modal that results in a confirmation toast.

```
Request body:
{
  "mentor_profile_id": "uuid",
  "scheduled_at": "ISO 8601 datetime",
  "notes": "string (optional)"
}

Response:
{
  "session_id": "uuid",
  "scheduled_at": "ISO 8601 datetime",
  "mentor_name": "string",
  "status": "confirmed"
}
```

> **New table required:** `MentorSession` with fields: `id`, `application_id`, `mentor_profile_id`, `startup_profile_id`, `scheduled_at`, `status` (confirmed/cancelled/completed), `notes`, `created_at`.

**`GET /applications/{id}/sessions`**  
Retrieve all booked sessions for an application (for display in admin view).

---

#### C. Ecosystem / Network Graph (Ecosystem Tab)

**`GET /ecosystem/graph`**  
Return nodes and edges for the D3/canvas network graph. No such endpoint exists — the mock hardcodes node x/y positions and link arrays.

```
Response:
{
  "mentors": [
    {
      "id": "uuid",
      "name": "string",
      "sector": "string",
      "status": "active|inactive",
      "x": number,          // optional: backend can omit, frontend assigns layout
      "y": number
    }
  ],
  "participants": [
    {
      "id": "uuid",
      "name": "string",
      "project": "string",
      "sector": "string",
      "status": "string"
    }
  ],
  "links": [
    {
      "mentor_id": "uuid",
      "participant_id": "uuid",
      "strength": number    // optional: derived from match_score
    }
  ]
}
```

> This can be derived from existing `MatchingResult` + `StartupProfile` + `MentorProfile` tables — no new table needed. Build a query that joins them.

---

#### D. Project Monitoring (Monitoring Tab)

**`GET /startups/{startup_id}/health`**  
Consolidated health view for a startup. The mock shows runway, burn rate, next review date, current milestone index, and a highlights feed — none of this is returned by existing endpoints.

```
Response:
{
  "startup_name": "string",
  "owner": "string",
  "status": "on_track|at_risk|delayed",
  "mentor": "string",
  "current_milestone_index": number,
  "runway": "string",          // e.g. "6 months"
  "burn": "string",            // e.g. "RM 45K/mo"
  "next_review": "ISO date",
  "highlights": ["string"]
}
```

> `runway` and `burn` are not stored in the current schema. Two options:  
> (a) Add `runway_months` and `monthly_burn` fields to `StartupProfile` — simplest for hackathon.  
> (b) Compute from existing `monthly_revenue` and `funding_needed` fields.

**`GET /startups/{startup_id}/financials`**  
Quarterly P&L data for the bar chart shown in the Monitoring tab.

```
Response:
[
  { "quarter": "Q1 2025", "revenue": number, "profit": number },
  { "quarter": "Q2 2025", "revenue": number, "profit": number },
  ...
]
```

> **New table required:** `FinancialRecord` with fields: `id`, `startup_profile_id`, `quarter`, `revenue`, `profit`, `created_at`.  
> For hackathon: can return hardcoded seed data from the endpoint instead of building a full table.

---

#### E. Programme Listing

**`GET /programmes`**  
The Participant tab lets a user choose which programme to apply to. Currently no endpoint lists available programmes.

```
Response:
[
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "programme_type": "funding|accelerator|bootcamp|grant|mentorship",
    "start_date": "date",
    "end_date": "date",
    "status": "open|reviewing|active"
  }
]
```

> The `Programme` model already exists in the database — this is just a missing router, not a missing table.

---

### 1.3 Missing Endpoints — Nice to Have (Non-Blocking)

| Endpoint | Why needed | Priority |
|---|---|---|
| `POST /mentors` | Register a mentor profile via API (currently seed-only) | Low |
| `POST /auth/register` | Self-service user registration | Low |
| `POST /applications/{id}/sessions/{sid}/feedback` | Post-session feedback | Low |
| `GET /applications/{id}/sessions/{sid}` | Session detail | Low |
| `PATCH /startups/{id}/profile` | Update startup profile fields | Low |

---

## 2. Data Structure Mismatches

These are cases where an endpoint already exists but the shape of data it returns does not match what the new frontend mock expects.

### 2.1 Mentor Availability Format

| | Format |
|---|---|
| **Backend** | Enum string: `available` / `limited` / `unavailable` |
| **Mock expects** | Free text: `"Tue 10:30 AM, Thu 2:00 PM"` |

**Fix:** The new frontend should map the enum to a human-readable label, or the backend can add an optional `availability_notes` text field to `MentorProfile`. The availability enum is already correct for status badges — only the slot text is missing.

---

### 2.2 Mentor Match Result — Extra Fields

The mock renders `pastMatches` (array of strings) and a `stat` label per mentor. The backend `MatchingResultOut` schema does not include these.

| Mock field | Backend equivalent | Action |
|---|---|---|
| `pastMatches: ["Startup A", "Startup B"]` | Not in `MatchingResult` | Query past matched startups and inject into `/matches` response |
| `stat` (e.g. "4.7 ★ · 12 sessions") | `average_rating`, `total_sessions` on `MentorProfile` | Add `mentor_rating` and `mentor_total_sessions` to `MatchingResultOut` schema |
| `initials` | Not stored | Derive client-side from mentor name |
| `tags` | Maps to `skills` and `industries` arrays | Rename or merge in response |

---

### 2.3 Application Monitoring Fields

The Monitoring tab references `runway`, `burn`, `nextReview` — none are in the current `StartupProfile` model.

**Recommended fix for hackathon:** Add three optional fields to `StartupProfile`:
```python
runway_months: Optional[int]
monthly_burn: Optional[Numeric]
next_review_date: Optional[date]
```
Then expose them via the new `GET /startups/{id}/health` endpoint.

---

### 2.4 Application Status — `draft` and `pending_review`

| Mock flow | Backend status values |
|---|---|
| `draft` | Not in backend — handle client-side only |
| `pending_review` | Maps to `submitted` in backend |

**Fix:** No backend change needed. The new frontend should treat `submitted` as `pending_review` when displaying. Do not add `draft` to the backend status enum.

---

### 2.5 Milestone Shape

The mock's milestone display is simpler than the backend's full `MilestoneOut`:

| Mock field | Backend field | Notes |
|---|---|---|
| `label` | `title` | Rename on frontend |
| `date` | `target_date` | Already in schema |
| *(no status color)* | `status`, `ai_risk_signal` | Use these for color coding |

**Fix:** Frontend should map `title` → display label and use `status` + `ai_risk_signal` for the visual state.

---

## 3. Other Parts Needed for the New Frontend to Work Well

### 3.1 CORS Configuration

The new frontend is a Vite/React app (likely running on `localhost:5173`). The backend's `CORS_ORIGINS` environment variable must include this origin.

```
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Check `backend/main.py` — `CORSMiddleware` reads from `settings.CORS_ORIGINS`. Update `.env` or `docker-compose.yml`.

---

### 3.2 Auth Token Handling in React

`frontend-simple` stores the JWT in a `let token` variable and reads it via closure. The React mockup has **no auth layer at all**.

The new frontend needs:
- Store JWT in `localStorage` or React context after login
- Pass `Authorization: Bearer <token>` header on every API call
- Redirect to login if a 401 is returned
- Clear token on logout

Suggested: create an `api.js` utility (axios instance or fetch wrapper) with an interceptor that injects the header automatically.

---

### 3.3 API Base URL Configuration

The mock has no `API_BASE` — all data comes from `mockData.js`. When wiring to the backend, define a single config point:

```js
// src/config.js
export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";
```

All fetch/axios calls use `${API_BASE}/endpoint`. Set `VITE_API_BASE` in `.env.local` for local dev and in the deployment environment for production.

---

### 3.4 Seed Data Must Cover the Demo Flow

The backend currently relies on seed data for all `StartupProfile`, `MentorProfile`, `Organisation`, and `Programme` records. The new frontend's demo flow requires specific records to exist:

- At least 1 `Programme` with status `open`
- At least 1 `StartupProfile` and its linked `Application`
- At least 3 `MentorProfile` records (the mock shows exactly 3 matches)
- At least 1 set of `ProjectMilestone` records for the monitoring view

Verify `backend/seed.py` (or equivalent) creates all these. If the Ecosystem tab is demoed, seed data must also have `MatchingResult` rows linking mentors to startups.

---

### 3.5 Role-Based UI Rendering

The mock has 4 tabs (Participant, Cradle Admin, Ecosystem, Monitoring) — each represents a different role's view. The backend's `User` model has a `role` field (`founder`, `cradle_admin`, `cradle_staff`, `mentor`).

The new frontend should:
1. Call `GET /auth/me` after login to get `role`
2. Show only the tab(s) relevant to that role
3. For hackathon demo: allow tab switching freely (no enforcement) but read `role` to set a default active tab

Currently the backend endpoints do **not** enforce role-based access (any authenticated user can call any endpoint). This is acceptable for a hackathon but should be noted.

---

### 3.6 Error Handling & Loading States

The mock has UI states simulated with `setTimeout` (e.g., the 3-second AI review spinner). When wired to a real backend:

- The Gemini matching call (`POST /generate-matches`) takes 3–8 seconds — keep the loading overlay, but trigger it on the real API call instead of a timer
- Show proper error toasts if any API call returns non-2xx
- Handle the case where `GET /applications/{id}/matches` returns an empty array (matches not yet generated)

---

### 3.7 D3 / Ecosystem Graph — Data Binding

The mock's `EcosystemGraph.jsx` renders nodes from hardcoded `ecosystemMentors` and `ecosystemParticipants` arrays with pre-set `x/y` coordinates. When using real data from `GET /ecosystem/graph`:

- The backend will not return `x/y` positions — the frontend must assign them using a D3 force simulation (`d3.forceSimulation`)
- Node IDs will be UUIDs, not small integers — ensure the link array's `mentor_id` / `participant_id` values match node `id` fields exactly
- Status colors must map from backend enum values (`active/inactive`) to the CSS classes used in the component

---

### 3.8 Docker / Deployment Wiring

The repo already has a `docker-compose.yml` that runs `backend` and `frontend-simple`. To add the new React frontend:

```yaml
frontend-v3:
  build: ./frontend-version3       # or frontend-mockup-with-nobackend
  ports:
    - "5173:80"
  environment:
    - VITE_API_BASE=http://backend:8000
  depends_on:
    - backend
```

The Vite build (`npm run build`) outputs to `dist/` — the Dockerfile should use `nginx:alpine` to serve it and proxy `/api` calls to the backend if needed.

---

## 4. Priority Order for Hackathon

| Priority | Item | Effort |
|---|---|---|
| P0 | Add auth token handling to React app | 1–2 hrs |
| P0 | Add `VITE_API_BASE` config + fetch wrapper | 30 min |
| P0 | Add `GET /programmes` endpoint (table exists) | 30 min |
| P0 | Add `POST /applications` endpoint | 1–2 hrs |
| P1 | Add `POST /applications/{id}/sessions` + `MentorSession` table | 2 hrs |
| P1 | Add `GET /ecosystem/graph` endpoint | 1–2 hrs |
| P1 | Add `GET /startups/{id}/health` endpoint | 1 hr |
| P1 | Add `mentor_rating`, `mentor_total_sessions` to `MatchingResultOut` | 30 min |
| P2 | Add `GET /startups/{id}/financials` + seed data | 1–2 hrs |
| P2 | D3 force simulation for Ecosystem graph | 1–2 hrs |
| P2 | Add `POST /startups` (startup registration) | 1–2 hrs |
| P3 | Role-based tab rendering | 1 hr |
| P3 | `availability_notes` free-text field on MentorProfile | 30 min |

**Total estimated effort for P0+P1:** ~8–10 hours  
**Total estimated effort for P0+P1+P2:** ~13–16 hours

---

## 5. Summary

```
Already works (call as-is):      12 endpoints
Missing — must build:             7 endpoints  (POST /applications, POST /startups,
                                               POST /sessions, GET /sessions,
                                               GET /ecosystem/graph,
                                               GET /startups/{id}/health,
                                               GET /startups/{id}/financials,
                                               GET /programmes)
Data shape fixes needed:          4 mismatches (availability text, match result fields,
                                               milestone field names, status labels)
Non-API work:                     5 items      (auth layer, API base config, CORS,
                                               seed data, D3 data binding)
```
