# API Contract — StarsConnector

**This document is the single source of truth for frontend ↔ backend communication.**
Both tracks must follow this exactly. Any change needs to be agreed by both sides.

---

## Base URLs

| Environment | URL |
| --- | --- |
| Local dev | `http://localhost:8000` |
| Production | `https://StarsConnector-api-[hash]-as.a.run.app` |

Frontend stores this as:

```js
const API_BASE = 'http://localhost:8000'; // swap to Cloud Run URL before deploy
```

---

## Common Rules

- All requests and responses are `Content-Type: application/json`
- All timestamps are ISO 8601: `"2026-05-16T10:00:00Z"`
- All field names are `snake_case`
- Status codes: `200` success, `201` created, `400` bad input, `404` not found, `500` server error

### Standard Error Response

```json
{
  "detail": "Relationship not found"
}
```

### Relationship Status Enum

Valid values for the `status` field across all endpoints:

| Value | Meaning |
| --- | --- |
| `proposed` | AI suggested, awaiting admin decision |
| `matched` | Admin approved, not yet active |
| `active` | Relationship is ongoing |
| `checkin_due` | No activity for 14+ days — needs attention |
| `completed` | Programme ended, outcome scored |
| `archived` | 30+ days post-completion |
| `rejected` | Admin rejected the suggestion |

---

## Endpoints

---

### `GET /api/mentors`

Returns all mentor profiles including past outcome history.
Used by: frontend sidebar list, Gemini prompt builder.

**Response `200`**

```json
[
  {
    "id": 1,
    "name": "Ahmad Razif",
    "type": "mentor",
    "domain": "fintech",
    "bio": "Ex-Grab Payments lead, 12 years in financial infrastructure",
    "tags": ["fintech", "payments", "B2C"],
    "past_outcomes": [
      {
        "startup_name": "PayNow",
        "programme": "Batch 3",
        "score": 4.8,
        "note": "Helped us close Series A after restructuring our revenue model"
      },
      {
        "startup_name": "CashFlow",
        "programme": "Batch 4",
        "score": 4.2,
        "note": "Strong domain fit, sessions were highly structured"
      }
    ]
  },
  {
    "id": 2,
    "name": "Sarah Chen",
    "type": "mentor",
    "domain": "growth",
    "bio": "CMO at 3 successful Southeast Asian startups",
    "tags": ["growth", "B2C", "marketing"],
    "past_outcomes": [
      {
        "startup_name": "ShopEasy",
        "programme": "Batch 2",
        "score": 4.5,
        "note": "Doubled our user acquisition in 6 weeks"
      }
    ]
  }
]
```

---

### `GET /api/startups`

Returns all startup profiles.
Used by: programme owner dropdown, booking wizard step 1.

**Response `200`**

```json
[
  {
    "id": 1,
    "name": "PayFast",
    "type": "startup",
    "domain": "fintech",
    "bio": "QR payments solution targeting SMEs in Peninsular Malaysia",
    "tags": ["payments", "B2C", "Malaysia"],
    "stage": "seed"
  },
  {
    "id": 2,
    "name": "LoanEase",
    "type": "startup",
    "domain": "lending",
    "bio": "AI-driven SME loan decisioning platform",
    "tags": ["lending", "B2B", "SME"],
    "stage": "pre-seed"
  },
  {
    "id": 3,
    "name": "TrackIt",
    "type": "startup",
    "domain": "logistics",
    "bio": "Last-mile delivery tracking for e-commerce",
    "tags": ["logistics", "SaaS", "last-mile"],
    "stage": "seed"
  }
]
```

---

### `GET /api/programmes`

Returns all programmes.
Used by: programme sidebar list, dropdown selectors.

**Response `200`**

```json
[
  {
    "id": 1,
    "name": "Google for Startups — Fintech Cohort",
    "status": "active",
    "start_date": "2026-03-01",
    "end_date": "2026-06-30",
    "created_at": "2026-03-01T00:00:00Z"
  }
]
```

---

### `POST /api/programmes`

Creates a new programme.
Used by: "Start New Programme" modal.

**Request body**

```json
{
  "name": "Google for Startups — Fintech Cohort",
  "start_date": "2026-03-01",
  "end_date": "2026-06-30"
}
```

**Response `201`**

```json
{
  "id": 2,
  "name": "Google for Startups — Fintech Cohort",
  "status": "active",
  "start_date": "2026-03-01",
  "end_date": "2026-06-30",
  "created_at": "2026-05-16T10:00:00Z"
}
```

---

### `POST /api/match` ⭐ Core AI Endpoint

Sends a natural language query + startup context to Gemini.
Returns ranked mentor matches with score, reason, and evidence.
Used by: booking wizard step 4, admin "Find Mentors" button.

**Request body**

```json
{
  "query": "Find fintech mentors for PayFast — they need help with payments infrastructure",
  "startup_id": 1,
  "programme_id": 1
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `query` | Yes | Natural language from admin or participant |
| `startup_id` | Yes | Used to fetch startup profile for Gemini context |
| `programme_id` | Yes | Used to associate the resulting relationships |

**Response `200`**

```json
{
  "startup": {
    "id": 1,
    "name": "PayFast"
  },
  "matches": [
    {
      "mentor_id": 1,
      "mentor_name": "Ahmad Razif",
      "score": 94,
      "reason": "Deep payments infrastructure experience directly matches PayFast's challenge",
      "evidence": "Mentored CashFlow in Batch 4 — outcome score 4.8/5"
    },
    {
      "mentor_id": 2,
      "mentor_name": "Sarah Chen",
      "score": 81,
      "reason": "B2C growth expertise fits PayFast's customer acquisition need",
      "evidence": "No prior fintech history — profile match only"
    },
    {
      "mentor_id": 3,
      "mentor_name": "Raj Krishnan",
      "score": 67,
      "reason": "Fintech background is relevant, but focus is B2B SaaS not B2C payments",
      "evidence": "Mentored LendMe in Batch 2 — outcome score 3.9/5"
    }
  ]
}
```

**Frontend behaviour on this response:**

- While waiting → show the "AI scanning" animation (step 4 of wizard)
- On success → render the match cards (step 5 of wizard) with score bar, reason, evidence badge
- On error → show "AI matching failed, please try again"

**Response `500`** (Gemini failure)

```json
{
  "detail": "Gemini API error: quota exceeded"
}
```

---

### `GET /api/relationships`

Returns all relationships with their current lifecycle stage and attention flag.
Used by: programme owner dashboard relationship table.

**Response `200`**

```json
[
  {
    "id": 1,
    "mentor": {
      "id": 1,
      "name": "Ahmad Razif"
    },
    "startup": {
      "id": 1,
      "name": "PayFast"
    },
    "programme": {
      "id": 1,
      "name": "Google for Startups — Fintech Cohort"
    },
    "status": "active",
    "ai_match_score": 94,
    "ai_match_reason": "Deep payments infrastructure experience directly matches PayFast's challenge",
    "ai_evidence": "Mentored CashFlow in Batch 4 — outcome score 4.8/5",
    "needs_attention": false,
    "days_since_activity": 3,
    "outcome_score": null,
    "last_activity_at": "2026-05-13T10:00:00Z",
    "created_at": "2026-05-01T10:00:00Z"
  },
  {
    "id": 2,
    "mentor": {
      "id": 4,
      "name": "David Lim"
    },
    "startup": {
      "id": 3,
      "name": "TrackIt"
    },
    "programme": {
      "id": 1,
      "name": "Google for Startups — Fintech Cohort"
    },
    "status": "checkin_due",
    "ai_match_score": 88,
    "ai_match_reason": "Supply chain expertise perfectly fits TrackIt's last-mile challenge",
    "ai_evidence": "Mentored DeliverX in Batch 1 — outcome score 4.1/5",
    "needs_attention": true,
    "days_since_activity": 15,
    "outcome_score": null,
    "last_activity_at": "2026-05-01T10:00:00Z",
    "created_at": "2026-04-20T10:00:00Z"
  }
]
```

**Frontend badge logic based on `status`:**

| Status | Badge colour | Badge label |
| --- | --- | --- |
| `proposed` | Blue | Proposed |
| `matched` | Teal | Matched |
| `active` | Green | Active |
| `checkin_due` | Amber | Needs Attention |
| `completed` | Grey | Completed |
| `archived` | Grey (muted) | Archived |
| `rejected` | Red | Rejected |

---

### `POST /api/relationships`

Creates a proposed relationship record (called after `POST /api/match` returns results and admin clicks Approve).

**Request body**

```json
{
  "mentor_id": 1,
  "startup_id": 1,
  "programme_id": 1,
  "ai_match_score": 94,
  "ai_match_reason": "Deep payments infrastructure experience directly matches PayFast's challenge",
  "ai_evidence": "Mentored CashFlow in Batch 4 — outcome score 4.8/5"
}
```

**Response `201`**

```json
{
  "id": 3,
  "mentor_id": 1,
  "startup_id": 1,
  "programme_id": 1,
  "status": "matched",
  "ai_match_score": 94,
  "ai_match_reason": "Deep payments infrastructure experience directly matches PayFast's challenge",
  "ai_evidence": "Mentored CashFlow in Batch 4 — outcome score 4.8/5",
  "created_at": "2026-05-16T10:00:00Z"
}
```

---

### `PATCH /api/relationships/{id}`

Updates a relationship's status.
Used by: approve button, reject button, admin lifecycle controls.

**Request body — Approve**

```json
{
  "status": "active"
}
```

**Request body — Reject**

```json
{
  "status": "rejected",
  "rejection_reason": "Wrong segment — B2B focus doesn't fit our B2C startup"
}
```

**Request body — Complete (end of programme)**

```json
{
  "status": "completed",
  "outcome_score": 4.8
}
```

**Response `200`**

```json
{
  "id": 1,
  "status": "active",
  "rejection_reason": null,
  "outcome_score": null,
  "updated_at": "2026-05-16T10:05:00Z"
}
```

**Response `404`**

```json
{
  "detail": "Relationship 99 not found"
}
```

---

### `GET /api/dashboard/stats`

Returns aggregate counts for the dashboard stat cards.
Used by: top stat cards in programme owner view.

**Response `200`**

```json
{
  "total_participants": 12,
  "active_mentors": 8,
  "at_risk_relationships": 3,
  "total_relationships": 24,
  "active_relationships": 16,
  "proposed_relationships": 3,
  "completed_relationships": 5
}
```

**Frontend stat card mapping:**

| Card label | Field |
| --- | --- |
| Participants | `total_participants` |
| Active Mentors | `active_mentors` |
| Needs Attention | `at_risk_relationships` |
| Total Relationships | `total_relationships` |

---

### `GET /api/relationships/suggestions`

Returns past high-scoring completed relationships suitable for reuse in a new programme.
Used by: "Start New Programme" flow — reuse suggestion cards.

**Response `200`**

```json
[
  {
    "mentor": {
      "id": 1,
      "name": "Ahmad Razif",
      "domain": "fintech"
    },
    "past_startup_name": "CashFlow",
    "past_programme_name": "Batch 4",
    "outcome_score": 4.8,
    "ai_match_reason": "Strong domain fit in fintech payments",
    "suggestion_text": "Ahmad scored 4.8/5 with a similar fintech startup — worth reusing?"
  },
  {
    "mentor": {
      "id": 2,
      "name": "Sarah Chen",
      "domain": "growth"
    },
    "past_startup_name": "ShopEasy",
    "past_programme_name": "Batch 2",
    "outcome_score": 4.5,
    "ai_match_reason": "B2C growth mentorship drove measurable acquisition results",
    "suggestion_text": "Sarah scored 4.5/5 with a B2C startup — consider her for your next cohort?"
  }
]
```

---

## Approve / Reject Flow (Step by Step)

This is the exact sequence the frontend must follow after `POST /api/match` returns results:

```text
1. POST /api/match          → get matches array
2. Render match cards       → user sees score + reason + evidence
3. User clicks Approve      → POST /api/relationships (with ai_match_score, ai_match_reason, ai_evidence)
                            → on 201: PATCH /api/relationships/{new_id} { status: "active" }
4. User clicks Reject       → PATCH /api/relationships/{id} { status: "rejected", rejection_reason: "..." }
   (if relationship exists) OR just discard locally if not yet created
5. Refresh relationship list → GET /api/relationships
```

---

## CORS

Backend must allow:

```python
origins = [
  "http://localhost:5500",   # VS Code Live Server
  "http://localhost:3000",   # any local frontend server
  "http://127.0.0.1:5500",
  "https://*.web.app",       # Firebase Hosting
  "https://*.firebaseapp.com"
]
```

---

## What Backend Must Return / What Frontend Must Not Assume

| Rule | Detail |
| --- | --- |
| `tags` is always an array | Never a comma-separated string in responses |
| `past_outcomes` is always an array | Empty array `[]` if no history — never `null` |
| `needs_attention` is always a boolean | Computed server-side from `days_since_activity > 14` |
| `score` is always an integer 0–100 | Never a float, never a percentage string |
| `outcome_score` is `null` until completed | Frontend must handle null gracefully |
| `rejection_reason` is `null` if not rejected | Frontend only shows this field when `status === "rejected"` |
