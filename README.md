# StarConnector

StarConnector is an AI-powered mentor matching platform designed for Cradle startup programmes. It streamlines the process of connecting startup founders with the right mentors by leveraging artificial intelligence to evaluate skills, industry fit, business stage, availability, and past feedback.

## Project Structure

The project is divided into two main components:

### 1. Backend (`/version2/backend`)
A RESTful API built with **FastAPI** to handle business logic, database operations, and AI mentor matching.

- **Technology Stack:** FastAPI, Python, SQLAlchemy (PostgreSQL/pgvector).
- **Key API Endpoints:** 
  - `auth`: User authentication and role management.
  - `dashboard`: Statistics and metrics for the platform.
  - `applications`: Application submission, review, and status updates.
  - `mentors`: Mentor profile directory.
  - `matching`: AI recommendation engine for mentor matching.
  - `milestones`: Startup project tracking.

### 2. Frontend (`/version2/frontend-simple`)
A lightweight, single-page web dashboard (Vanilla HTML/CSS/JS) for Cradle staff to manage the startup ecosystem.

- **Technology Stack:** HTML5, CSS3, JavaScript (No external frameworks).
- **Key Features:**
  - **Overview Dashboard:** Visualize key metrics (Total Applications, Pending Reviews, Matches Generated).
  - **Application Management:** Review applications, update statuses (Shortlist, Approve, Reject).
  - **AI Match Generation:** One-click AI Mentor Matching with detailed reasoning, confidence scores, and multi-dimensional match breakdowns (Skills, Industry, Stage, Availability, etc.).
  - **Mentor Directory:** Browse and filter mentor profiles.
  - **Milestone Tracking:** Monitor startup progress and view AI-generated risk signals.

## Core Data Models

The system is built around a robust relational schema designed for a startup ecosystem:
- **`users` & `organizations`:** Managing Cradle staff, founders, mentors, startups, and partners.
- **`programmes`:** Cradle funding or accelerator programmes.
- **`startup_profiles` & `mentor_profiles`:** Detailed profiles for matching.
- **`applications`:** Startup applications to specific programmes.
- **`matching_results`:** AI-generated match scores and reasoning.
- **`mentor_sessions` & `session_feedback`:** Managing meetings and extracting AI insights from feedback.
- **`project_milestones`:** Tracking startup progress and identifying risks.

## Running the Project

Both the backend and frontend come containerized with Docker.

To run the backend services (including the database and API), navigate to the backend directory and use Docker Compose:
```bash
cd version2/backend
docker-compose up -d
```

For the frontend, you can simply serve the `index.html` locally or build the Docker image provided in `version2/frontend-simple`.

## Demo Accounts
- **Admin (Cradle Staff):** `admin@cradle.com.my` / `admin1234`
- **Founder:** `ali@foodtech.my` / `founder1234`
