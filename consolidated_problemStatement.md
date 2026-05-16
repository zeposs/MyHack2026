Project Problem Statement & Build Plan
Project Title: EcoLink — AI-Powered Ecosystem Relationship Platform
What You're Building
A platform that treats every person, organisation, and relationship in an innovation ecosystem as structured, intelligent data — so that matching, coordination, and follow-up happen automatically instead of manually.
The One-Sentence Pitch
"EcoLink replaces manual ecosystem coordination with an AI layer that remembers every relationship, matches the right people automatically, and keeps all connections healthy over time."
The Three Problems You're Solving
Problem 1 — No Memory Ecosystem platforms forget everything after each programme ends. Mentors, matches, and outcomes are never reused. EcoLink stores every relationship as a structured entity in a graph — so nothing is ever lost.
Problem 2 — Manual Matching Admins spend hours reading profiles to find the right mentor for a startup. EcoLink uses AI to score and rank every possible match instantly, with a plain-language explanation for each suggestion.
Problem 3 — No Monitoring Once a match is made, nobody tracks whether it's actually working. EcoLink monitors every relationship's health and sends nudges, flags problems, and suggests next steps automatically.
Core Features to Build (In Order of Priority)
PriorityFeatureWhich Idea🔴 MustActor profiles — Mentor, Startup, PartnerIdea 1🔴 MustRelationship entity — stores how/when/outcomeIdea 1🔴 MustAI matching — ranked suggestions with reasonsIdea 2🟡 ShouldAdmin approves/rejects — AI learns from itIdea 2🟡 ShouldRelationship status lifecycleIdea 3🟢 NiceAuto-nudge when relationship goes quietIdea 3🟢 NiceAuto-suggest reusing past successful matchesIdea 1 + 3
How to Build It — Phase by Phase
Phase 1 — Foundation (Build this first)
Set up your database with 3 tables: actors, relationships, programmes
Build basic CRUD — create a mentor, create a startup, link them
Every relationship stores: type, status, start_date, outcome_score, notes
Phase 2 — AI Matching (Core demo feature)
When admin creates a new programme, they input what kind of startups are enrolled
System fetches all mentors, sends profiles to Claude API
Claude ranks and explains matches
Admin sees a list: "Recommended mentors for Startup X → 1. Ahmad (score: 92%) — reason: ..."
Phase 3 — Relationship Lifecycle (Polish)
Each relationship has a status: Proposed → Active → Completed → Archived
Dashboard shows all active relationships and their health
Simple rule: if no activity logged in 14 days → flag as "needs attention"
Phase 4 — Reusability (Impress the judges)hh
When a new programme starts, system looks at past completed relationships
Surfaces high-scoring past matches and says "want to reuse this?"
This is the "first-class reusable entity" that the problem statement specifically asks for
Database Schema to Start With
-- Actors (mentors, startups, partners) actors (id, name, type, profile_text, tags, created_at)  -- Programmes programmes (id, name, country, status, start_date, end_date)  -- Relationships (the core entity) relationships ( id,  actor_a_id,       -- e.g. mentor actor_b_id,       -- e.g. startup programme_id,     -- which programme relationship_type,-- mentor-startup, partner-initiative, etc. status,           -- proposed, active, completed, archived outcome_score,    -- 1-5, filled after completion ai_match_reason,  -- Claude's explanation stored here created_at, last_activity_at )
What Your Demo Should Show
Admin opens platform → sees dashboard of active relationships
Admin clicks "Start New Programme" → adds 3 startups
Clicks "Find Mentors" → AI instantly returns ranked mentor list with reasons
Admin approves 2, rejects 1 → system learns
Time passes → one relationship goes quiet → system flags it
Programme ends → scores recorded
New programme starts → system says "these 2 mentors performed well last time, reuse?"
That flow covers all 3 ideas and directly answers the hackathon challenge.
Want me to now generate the actual starter code for Phase 1 — the database + basic backend?
