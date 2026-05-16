# StartConnector

**AI-powered Relationship Operating System for startup and innovation ecosystems.**

Built on Gemini · Cloud Run · Firebase Hosting

---

## What Is This

StartConnector replaces manual ecosystem coordination with an AI layer that:

- **Remembers** every mentor, startup, relationship, and outcome across all cohorts
- **Matches** automatically — admin types a natural language request, Gemini returns ranked mentors with scores, reasons, and evidence from past outcomes
- **Monitors** every relationship's health and flags problems before they become failures

---

## Project Documents

All planning documents are in [`version1/`](version1/).

| Document | Purpose |
| --- | --- |
| [MILESTONES.md](version1/MILESTONES.md) | Track what's done and what's next |
| [PRD.md](version1/PRD.md) | Full product requirements and feature list |
| [API_CONTRACT.md](version1/API_CONTRACT.md) | Exact request/response JSON for every endpoint |
| [steps-analysis.md](version1/steps-analysis.md) | 5-hour hackathon execution plan |
| [SETUP.md](version1/SETUP.md) | Environment setup and deployment guide |
| [PITCH.md](version1/PITCH.md) | Judge presentation script and slide structure |

---

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | Vanilla HTML / CSS / JS |
| Frontend hosting | Firebase Hosting |
| Backend | Python FastAPI |
| Backend hosting | Google Cloud Run |
| Database | SQLite |
| AI | Gemini API (gemini-1.5-flash) |

---

## Quick Start

```bash
# Backend
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
# Open version1/index.html with VS Code Live Server
```

Full setup instructions → [SETUP.md](version1/SETUP.md)

---

## Project Structure

```text
MyHack2026/
├── README.md               ← You are here
├── version1/
│   ├── index.html          ← Frontend
│   ├── MILESTONES.md       ← Progress tracker
│   ├── PRD.md              ← Product requirements
│   ├── API_CONTRACT.md     ← API reference
│   ├── steps-analysis.md   ← Build plan
│   ├── SETUP.md            ← Setup guide
│   └── PITCH.md            ← Pitch script
└── backend/                ← Created during build
    ├── main.py
    ├── database.py
    ├── gemini.py
    ├── models.py
    ├── requirements.txt
    └── Dockerfile
```
