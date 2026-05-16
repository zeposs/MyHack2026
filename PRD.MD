# StarsConnector — AI-Powered Ecosystem Relationship Platform

**Version:** 1.0 (Hackathon Build)
**Owner:** Team StarsConnector
**Date:** May 2026
**Status:** Demo-Ready

> **How to use this document:**
> This PRD defines the complete demo narrative, scene design, and build order for the StarsConnector hackathon prototype. Follow the scene map exactly during the live presentation. Every screen is deterministic. No scene depends on a live API call.

---

# 1. Project Overview

**Project Summary:**
StarsConnector is a project management and relationship platform built for Cradle — a government-linked funding body that seeds eligible entrepreneurs with capital, mentorship, and oversight. The platform replaces manual coordination with a structured, AI-assisted workflow that covers the full lifecycle: application intake, AI-powered approval and mentor matching, relationship visualisation, and project monitoring. The demo presents three user-facing dashboards — one for Cradle admins, one for funding applicants (participants), and one for mentors — connected through a single coherent flow.

**One-line value proposition:**
StarsConnector gives Cradle a single intelligent command centre to evaluate applicants, assign the right mentors automatically, and monitor every funded project in real time.

**Hackathon goal:**
Judges should leave understanding that StarsConnector solves three real operational failures — lost application context, manual mentor matching, and zero post-funding visibility — through a clean, scene-driven demo that feels production-ready.

---

# 2. Problem Statement

## 2.1 The User Problem

Cradle, as a funding body, manages dozens of active funding programmes simultaneously. Today, programme officers manually read applicant profiles, cross-reference mentor lists on spreadsheets, send emails to coordinate meetings, and have no live visibility into whether funded projects are on track. Mentors are matched by gut feel. Projects that go off-track are only discovered at quarterly reviews — often too late to intervene.

## 2.2 Why This Matters Now

Innovation ecosystem coordination is still largely manual in emerging markets. As funding programmes scale, this manual approach breaks down. The hackathon theme of AI-powered ecosystem management is a direct call to fix exactly this problem.

## 2.3 Why Existing Solutions Are Not Enough

Generic CRMs do not understand ecosystems. Grant management tools track disbursements, not relationships. No existing platform combines application review, AI mentor matching, relationship graph visualisation, and project health monitoring into one coherent workflow — especially not one that surfaces AI reasoning transparently for human-in-the-loop decisions.

---

# 3. Target User

## Primary User

| Attribute          | Detail                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Who they are       | Cradle programme officer / admin — manages 30–100 funded projects per year                     |
| Main goal          | Approve the right applicants, assign the best mentors, and keep every project on track         |
| Main pain point    | Too much manual coordination; no single source of truth; problems discovered too late          |
| Tech comfort level | Medium — comfortable with dashboards, not a developer                                          |
| What they fear     | Approving a weak application, assigning a mismatched mentor, missing a failing project         |

## Secondary User

**Participant (Funding Applicant):** An entrepreneur like Ali who submits a funding application, uploads supporting documents, and tracks milestone progress inside the platform after being accepted.

**Mentor:** A domain expert assigned by Cradle to guide one or more participants. Accesses the platform to view assigned participants, session bookings, and progress.

---

# 4. Product Vision

## 4.1 What the Product Does

StarsConnector gives Cradle admins a structured platform to receive and AI-review funding applications, match accepted participants with the most suitable mentor from a ranked shortlist, visualise the full ecosystem relationship graph, and monitor ongoing project health — including milestone tracking and financial performance — from a single dashboard.

## 4.2 What the Product Feels Like

Authoritative, intelligent, and clean. The platform should feel like a Bloomberg terminal designed by a fintech startup — data-dense but never cluttered, with AI assistance that surfaces as guidance rather than noise. Every action feels deliberate and consequential.

## 4.3 What Success Looks Like

After the demo, judges should feel that StarsConnector is ready to deploy. They should remember: the AI match scoring reveal, the animated ecosystem relationship graph, and the milestone-plus-P&L monitoring view. Those three moments are the judges' takeaways.

---

# 5. Demo Narrative / Scene Design

## 5.1 Core Principle

**Every interaction is a scene, not a function.**

Each scene has:
- **Trigger:** what the presenter clicks or shows
- **Transition:** the fake processing / animation state that sells the AI
- **Reveal:** the output that appears like it was computed just now

The audience must never feel like they are watching a form being filled in. They are watching a system think.

---

## 5.2 Scene Map

| Scene   | Trigger                                                                 | Transition                                                                  | Reveal                                                                                              | Fallback                                        |
| ------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Scene 1 | Presenter opens Participant tab; shows Ali's completed application form  | Presenter clicks "Submit Application" — form animates to submitted state     | Application card appears in Cradle dashboard with status "Pending Review"                           | Static submitted confirmation card              |
| Scene 2 | Presenter switches to Cradle tab; clicks "AI Review" on Ali's card      | Fake AI thinking animation — progress bar, scanning indicators, data pulse  | AI verdict card appears: Approve recommended, with reasons and confidence score. Cradle presses Approve. Three mentor cards ranked by AI score appear. Presenter hovers each, sees match reasoning, selects best mentor. Session booking modal appears. | Pre-filled AI verdict card and pre-ranked mentor list |
| Scene 3 | Presenter clicks "Ecosystem" tab in Cradle dashboard                    | Graph loads with animated node-link reveal                                  | Interactive bubble graph: 5 mentor nodes on the left, 20 participant nodes on the right, connected by lines. Hover shows project name, sector, status. | Static screenshot of graph                      |
| Scene 4 | Presenter clicks a project node or navigates to Monitoring tab          | Dashboard transitions with data loading shimmer                             | Project monitoring view: milestone tracker with current position, followed by quarterly P&L chart showing revenue and net profit bars. | Pre-rendered milestone and chart screenshot      |

---

## 5.3 Scene State Machine

```
Landing / Tab Select
        ↓
Scene 1 — Participant View
  Ali's profile and application form
  Submit → card transitions to "Submitted"
        ↓
Scene 2 — Cradle Admin View
  Application card in review queue
  Click "AI Review" → Thinking animation
  → AI Verdict (Approve / reasoning)
  → Admin clicks Approve
  → Top 3 Mentor Shortlist appears
  → Admin selects mentor
  → Session Booking modal
  → Confirmed
        ↓
Scene 3 — Ecosystem Graph View
  Graph animates in
  Hover nodes → tooltip with project info
        ↓
Scene 4 — Monitoring View
  Select active project
  Milestone tracker → current position highlighted
  Scroll → Quarterly P&L chart (bar chart, revenue + net profit)
```

### State Rules

- The app always knows which scene (tab/state) it is in.
- Each scene is triggered by a single, obvious button press.
- Scenes never depend on live API calls — all outputs are hardcoded.
- Every scene can be reset by refreshing or navigating back to the tab.

---

## 5.4 The "Magic Output" Moment

This is Scene 2 — the mentor matching reveal.

**Input:** Admin clicks "Find Mentors" after approving Ali's nursing home application.

**Transition:** A fake AI processing overlay appears. Show: "Analysing 50 mentor profiles… Scoring by domain expertise… Running vector similarity… Ranking by historical success rate…" with animated progress steps, each completing with a checkmark. Duration: approximately 3 seconds.

**Output:** Three ranked mentor cards appear with names, photos, domain tags, an AI match score (e.g. 94%, 87%, 71%), and a one-line reason: *"Strong background in healthcare operations and two successful exits in the eldercare sector — high alignment with applicant's nursing home model."* Admin clicks the top card to expand the full profile, then clicks "Assign Mentor." A success toast confirms the match.

This is the moment the audience remembers. The fake process must feel real.

---

# 6. Feature Requirements

## 6.1 Feature Priority Levels

| Priority | Meaning                                             |
| -------- | --------------------------------------------------- |
| P0       | Demo-critical. Without this, the demo is dead.      |
| P1       | Nice and impressive. Build if time allows.          |
| P2       | Optional polish. Only if everything else is stable. |
| NEVER    | Too risky. Do not build for hackathon.              |

## 6.2 Feature List

| ID  | Feature                              | Description                                                                                     | Priority | Hardcoded? |
| --- | ------------------------------------ | ----------------------------------------------------------------------------------------------- | -------- | ---------- |
| F1  | Participant application form         | Ali's profile form with name, business idea, sector, documents uploaded. Submit button.        | P0       | Yes        |
| F2  | Cradle review queue                  | Application card with status badge, AI Review button                                           | P0       | Yes        |
| F3  | AI verdict card                      | Animated thinking state → approve/deny recommendation with confidence score and bullet reasons  | P0       | Yes        |
| F4  | Approve / Deny decision button       | Admin clicks Approve → triggers mentor matching flow                                            | P0       | Yes        |
| F5  | Mentor shortlist reveal              | Top 3 mentor cards with AI score, reasoning, expandable profile                                | P0       | Yes        |
| F6  | Fake AI thinking animation           | Step-by-step processing overlay: "Scanning 50 profiles… Scoring… Ranking…" with progress bars  | P0       | Yes        |
| F7  | Session booking modal                | Date picker, confirm session, success state. Connects mentor and participant.                   | P0       | Yes        |
| F8  | Ecosystem relationship graph         | Animated bubble graph: 5 mentor nodes left, 20 participant nodes right, hover tooltips          | P0       | Yes        |
| F9  | Milestone tracker                    | Visual progress bar / step indicator showing current milestone position                        | P0       | Yes        |
| F10 | Quarterly P&L chart                  | Bar chart: revenue and net profit by quarter, clean labels                                     | P0       | Yes        |
| F11 | Three-tab navigation                 | Participant / Cradle Admin / Mentor tabs — always visible, always switchable                   | P0       | Yes        |
| F12 | Mentor profile page                  | Full profile: photo, bio, sector tags, past matches, availability                              | P1       | Yes        |
| F13 | Project status badges                | On-Track / Needs Attention / At Risk badges on monitoring cards                                | P1       | Yes        |
| F14 | Relationship health indicator        | Flag on ecosystem graph nodes for relationships with no recent activity                        | P2       | Yes        |
| F15 | Mentor dashboard tab                 | Mentor's own view of assigned participants and upcoming sessions                               | P2       | Yes        |
| —   | Real authentication                  | —                                                                                              | NEVER    | —          |
| —   | Real AI API calls                    | —                                                                                              | NEVER    | —          |
| —   | Real document upload processing      | —                                                                                              | NEVER    | —          |
| —   | Live database                        | —                                                                                              | NEVER    | —          |

## 6.3 Out of Scope

Do **not** build:
- Real authentication or login flows
- Real AI API integration (all outputs are hardcoded or scripted)
- Real file upload processing
- Real payment or disbursement flows
- Any feature that introduces unpredictable output during the live demo

---

# 7. UI / Screen Requirements

## 7.1 Required Screens

| Screen                       | Purpose                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------ |
| Participant Application Form | Ali fills in his business profile, uploads mock documents, and submits                    |
| Cradle Review Dashboard      | Application queue, AI review trigger, verdict card, approval button                        |
| AI Thinking Overlay          | Fake animated processing state — "Analysing 50 mentor profiles…"                          |
| Mentor Shortlist View        | Three ranked mentor cards with score, reason, expandable profile                          |
| Session Booking Modal        | Date/time picker, confirm button, success confirmation toast                               |
| Ecosystem Graph View         | Full-screen animated bubble graph with hover tooltips                                      |
| Project Monitoring View      | Milestone tracker + Q1–Q4 P&L bar chart for a selected project                           |

## 7.2 Visual Style

Dark, data-rich, government-meets-fintech. Deep navy or dark slate background. Crisp white and cool-grey typography. Accent colour: electric teal or amber for highlights and CTAs. The AI verdict and mentor score cards should feel like analysis outputs — structured, numbered, credible. The ecosystem graph should feel alive — nodes should glow softly and pulse on hover. Use a geometric sans-serif display font (e.g. DM Sans, IBM Plex Sans) for headers and a clean monospaced font for data values (scores, percentages, financial figures).

## 7.3 What the User Must Always Understand

- Which tab / role view they are in
- What the current state of the application / project is
- What the AI is recommending and why
- What action is available to them next
- Whether an action succeeded (always confirm with a visible success state)

---

# 8. Technical Strategy

## 8.1 Frontend Approach

Single-page React application. Three tab sections correspond to three user views. State management via `useState` / `useReducer`. No routing library needed. All transitions handled with CSS transitions and a simple scene state variable. Chart rendered with Recharts. Graph rendered with D3 or a lightweight force-directed library (e.g. react-force-graph or hand-coded SVG).

## 8.2 Backend Approach

No backend. Zero. Everything is in-memory JavaScript objects defined at the top of the file or in a `/data/mockData.js` file. There are no API calls during the demo. The "AI processing" is a `setTimeout` of 2,500–3,500ms that resolves to a hardcoded result.

## 8.3 Data Strategy

| Data Type              | Source         | Notes                                                               |
| ---------------------- | -------------- | ------------------------------------------------------------------- |
| Ali's application      | Hardcoded JSON | Name, business idea, sector, documents listed as filenames          |
| AI verdict             | Hardcoded      | "Approve — 89% confidence" + 3 bullet reasons                      |
| Mentor list (50 names) | Hardcoded array | Only top 3 shown with full cards; rest implied by the "50 scanned" |
| Match scores & reasons | Hardcoded      | Per mentor: score, one-line reason, tags                            |
| Session booking        | Hardcoded      | Date confirmation is immediate; stored in component state only      |
| Ecosystem graph nodes  | Hardcoded JSON | 5 mentors, 20 participants, connection map                          |
| Milestone data         | Hardcoded JSON | 5 milestones, current position at milestone 3                       |
| Quarterly P&L          | Hardcoded JSON | Q1–Q4, revenue and net profit per quarter                           |

## 8.4 Scene State Machine Implementation

```javascript
const SCENES = {
  PARTICIPANT_FORM: 'participant_form',
  PARTICIPANT_SUBMITTED: 'participant_submitted',
  CRADLE_REVIEW: 'cradle_review',
  AI_THINKING: 'ai_thinking',
  AI_VERDICT: 'ai_verdict',
  MENTOR_SHORTLIST: 'mentor_shortlist',
  SESSION_BOOKING: 'session_booking',
  SESSION_CONFIRMED: 'session_confirmed',
  ECOSYSTEM_GRAPH: 'ecosystem_graph',
  MONITORING: 'monitoring',
};
```

Each tab/button maps to exactly one scene transition. No conditional logic during the live demo path. Scene changes are always triggered by user action, never automatic.

## 8.5 AI Sprinkle Layer

No real AI is used. The "AI" is a theatre layer:
- A `setTimeout` with 3 seconds simulates processing time
- Animated step-progress UI runs during the wait
- The result is a hardcoded object that was always going to appear

This is correct. The demo cannot afford surprise behaviour. The AI is the narrative, not the infrastructure.

---

# 9. Hardcoded Content / Mock Data

| Item                        | Source     | Notes                                                            |
| --------------------------- | ---------- | ---------------------------------------------------------------- |
| Applicant — Ali's profile   | Hardcoded  | Nursing home concept, sector: healthcare, documents: 3 files     |
| AI verdict card             | Hardcoded  | Approve, 89% confidence, 3 reasons                              |
| Mentor 1 — Dr. Aminah       | Hardcoded  | Score: 94%, healthcare sector, 2 successful matches             |
| Mentor 2 — Rajan S.         | Hardcoded  | Score: 87%, operations background, 1 successful match           |
| Mentor 3 — Lim Wei Hong     | Hardcoded  | Score: 71%, general business mentor                             |
| Remaining 47 mentors        | Implied    | Referenced in the "scanned 50 profiles" animation only          |
| Ecosystem graph — 5 mentors | Hardcoded  | Names, sector tags, connection map                              |
| Ecosystem graph — 20 nodes  | Hardcoded  | Participant names, project names, status                        |
| Milestone tracker           | Hardcoded  | 5 milestones; current = milestone 3 ("Market Validation Done")  |
| Q1–Q4 P&L                   | Hardcoded  | Revenue: RM 40k / 65k / 88k / 112k; Net profit: RM 8k / 15k / 22k / 31k |
| Session booking confirm     | In-memory  | Date set in picker; confirmed immediately; no persistence        |

### Deterministic Output Rule

Every output in this demo is pre-determined and will always render identically regardless of presenter input.

---

# 10. Build Order

## Phase 1: Demo Path First

Build in this exact order and test after each step:

1. Three-tab navigation shell (Participant / Cradle / Ecosystem / Monitoring)
2. Participant application form — Ali's pre-filled profile, submit button
3. Submitted confirmation state — card transition
4. Cradle review queue — application card with "AI Review" button
5. AI thinking animation overlay — step progress, 3 seconds
6. AI verdict card — approve recommendation, reasons, confidence score
7. Approve button → mentor shortlist reveal (3 cards with scores and reasons)
8. Mentor profile expand → session booking modal → success confirmation
9. Ecosystem graph — hardcoded nodes and links, hover tooltips
10. Monitoring view — milestone tracker + P&L bar chart

**If steps 1–8 work, you have a complete demo. Steps 9 and 10 are the bonus.**

## Phase 2: Visual Polish

- Node glow and pulse animations on ecosystem graph
- Staggered card entry animations on mentor shortlist
- Smooth tab transitions
- Responsive layout check
- AI thinking animation refinement (step-by-step checkmarks)

## Phase 3: Supporting Features

- Mentor dashboard tab (their own view)
- Project status badges (On-Track / Needs Attention)
- Relationship health indicator on graph nodes

## Phase 4: Fallbacks and Rehearsal

- Test all scenes on the demo device / browser
- Confirm all animations complete within expected timing
- Prepare static screenshot fallbacks for graph and chart
- Run full demo twice at rehearsal speed
- Check tab navigation from any point in the flow

---

# 11. Risk Assessment & Fallbacks

| Risk                              | Impact | Fallback                                              |
| --------------------------------- | ------ | ----------------------------------------------------- |
| AI thinking animation hangs       | High   | Skip animation; show verdict card directly            |
| Ecosystem graph fails to render   | High   | Show static high-res screenshot of graph              |
| P&L chart does not render         | Medium | Show a pre-rendered chart image                       |
| Mentor shortlist cards mis-render | High   | Show hardcoded card as plain text with scores         |
| Tab navigation breaks             | High   | Navigate directly to pre-built standalone page        |
| Demo device / browser issue       | High   | Have demo open on a second device at all times        |
| Session booking modal fails       | Medium | Verbally describe the action; show success toast only |

## Demo Emergency Rule

If something breaks during the live demo, the presenter moves immediately to the next working scene. Do not debug on stage. Do not apologise for more than five seconds. Move forward. The judges watch the presenter's confidence more than the software.

---

# 12. Demo Script

## Opening (30 seconds)

*"Cradle funds hundreds of entrepreneurs a year. But today, every application review is manual, every mentor match is a guess, and once a project starts, nobody knows if it's actually working. StarsConnector fixes all three."*

## Scene 1 — Participant View (60 seconds)

*"Here's Ali. He wants to start a nursing home. He's filled in his application — business concept, sector, supporting documents. He hits Submit."*
[Presenter clicks Submit. Card transitions to Submitted state.]
*"His application is now live in Cradle's review queue."*

## Scene 2 — Cradle Admin View (2–3 minutes)

*"This is the Cradle dashboard. Ali's application just came in. The admin hits AI Review."*
[AI thinking animation runs — 3 seconds.]
*"The system has analysed Ali's profile, cross-referenced historical approval data, and it's recommending Approve — 89% confidence — because of these three reasons."*
[Presenter reads the reasons.]
*"The admin agrees. They press Approve. Now watch this."*
[Mentor shortlist appears with scores.]
*"Out of 50 mentors in the system, the AI has ranked the top three. Dr. Aminah — 94% match — because she has two successful exits in healthcare. The admin expands her profile, reviews her past matches, and selects her."*
[Admin clicks Assign. Session booking modal appears.]
*"One button connects them. Date is set. Meeting is confirmed."*

## Scene 3 — Ecosystem Graph (60 seconds)

*"Now zoom out. This is the full ecosystem. Every mentor on the left, every participant on the right, every relationship live."*
[Presenter hovers over nodes — tooltips appear.]
*"Hover over any node and see what project they're running, what stage they're in, whether they're on track."*

## Scene 4 — Monitoring Dashboard (60 seconds)

*"Finally, the admin selects an active project. Here's the milestone tracker — five milestones, currently at milestone three: Market Validation complete."*
[Presenter scrolls down.]
*"And here is the quarterly P&L — revenue growing quarter over quarter, net profit positive from Q2. Cradle can see in seconds whether to intervene or let this one run."*

## Closing (20 seconds)

*"StarsConnector replaces spreadsheets and email threads with one intelligent platform — application review, mentor matching, relationship visibility, and project monitoring. That's StarsConnector."*

---

# 13. Success Criteria

The project is successful if:

1. The audience understands the Cradle-participant-mentor relationship after Scene 1.
2. The AI mentor matching reveal lands as a "wow" moment in Scene 2.
3. The ecosystem graph is visually striking and interactive in Scene 3.
4. The monitoring dashboard communicates project health instantly in Scene 4.
5. The judges remember the scoring reveal and the graph — not the form.

---

# 14. One-Line Summary

**StarsConnector** is a hackathon prototype that solves ecosystem coordination failure — manual application review, mismatched mentoring, and invisible project health — through a **scene-based, frontend-first, fully deterministic demo** with a three-act structure: approve, match, monitor.