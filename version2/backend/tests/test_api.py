"""
Integration tests against the live API at http://localhost:8000
Run: pytest version2/backend/tests/ -v
"""
import requests
import pytest

BASE = "http://localhost:8000"
APP_ID = "app-ali-2026"
STARTUP_ID = "startup-ali-001"
MENTOR_A_ID = "mentor-a-001"
MENTOR_B_ID = "mentor-b-001"


# ─── Health ───────────────────────────────────────────────────────────────────

class TestHealth:
    def test_health_ok(self):
        r = requests.get(f"{BASE}/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert "StartConnector" in data["service"]


# ─── Auth ─────────────────────────────────────────────────────────────────────

class TestAuth:
    def test_login_success(self):
        r = requests.post(f"{BASE}/auth/login", json={
            "email": "admin@cradle.com.my", "password": "admin1234"
        })
        assert r.status_code == 200
        body = r.json()
        assert "access_token" in body
        assert body["token_type"] == "bearer"

    def test_login_wrong_password(self):
        r = requests.post(f"{BASE}/auth/login", json={
            "email": "admin@cradle.com.my", "password": "wrongpass"
        })
        assert r.status_code == 401

    def test_login_unknown_email(self):
        r = requests.post(f"{BASE}/auth/login", json={
            "email": "nobody@example.com", "password": "pass"
        })
        assert r.status_code == 401

    def test_me_authenticated(self, auth):
        r = requests.get(f"{BASE}/auth/me", headers=auth)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == "admin@cradle.com.my"
        assert data["role"] == "cradle_admin"

    def test_me_no_token(self):
        r = requests.get(f"{BASE}/auth/me")
        assert r.status_code == 401

    def test_me_invalid_token(self):
        r = requests.get(f"{BASE}/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
        assert r.status_code == 401


# ─── Dashboard ────────────────────────────────────────────────────────────────

class TestDashboard:
    def test_stats_authenticated(self, auth):
        r = requests.get(f"{BASE}/dashboard/stats", headers=auth)
        assert r.status_code == 200
        data = r.json()
        assert data["total_applications"] >= 1
        assert data["total_mentors"] >= 3
        assert data["active_programmes"] >= 1
        assert data["matches_generated"] >= 3

    def test_stats_unauthenticated(self):
        r = requests.get(f"{BASE}/dashboard/stats")
        assert r.status_code == 401


# ─── Programmes ───────────────────────────────────────────────────────────────

class TestProgrammes:
    def test_list_programmes(self, auth):
        r = requests.get(f"{BASE}/programmes", headers=auth)
        assert r.status_code == 404  # not in MVP router scope — expected missing

    # Programmes list endpoint not implemented (no programmes router)
    # These records exist in DB but are surfaced through applications


# ─── Applications ─────────────────────────────────────────────────────────────

class TestApplications:
    def test_list_applications(self, auth):
        r = requests.get(f"{BASE}/applications", headers=auth)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_list_applications_unauthenticated(self):
        r = requests.get(f"{BASE}/applications")
        assert r.status_code == 401

    def test_get_application_by_id(self, auth):
        r = requests.get(f"{BASE}/applications/{APP_ID}", headers=auth)
        assert r.status_code == 200
        data = r.json()
        assert data["id"] == APP_ID
        assert data["startup_name"] == "Ali FoodTech"
        assert data["programme_name"] == "Cradle Fund Seeding 2026"
        assert data["applicant_name"] == "Ali Hassan"
        assert "requested_amount" in data

    def test_get_application_not_found(self, auth):
        r = requests.get(f"{BASE}/applications/does-not-exist", headers=auth)
        assert r.status_code == 404

    def test_update_application_status_valid(self, auth):
        r = requests.patch(
            f"{BASE}/applications/{APP_ID}/status",
            json={"status": "shortlisted"},
            headers=auth,
        )
        assert r.status_code == 200
        assert r.json()["status"] == "shortlisted"

    def test_update_application_status_invalid(self, auth):
        r = requests.patch(
            f"{BASE}/applications/{APP_ID}/status",
            json={"status": "not_a_real_status"},
            headers=auth,
        )
        assert r.status_code == 400

    def test_update_application_status_not_found(self, auth):
        r = requests.patch(
            f"{BASE}/applications/fake-id/status",
            json={"status": "approved"},
            headers=auth,
        )
        assert r.status_code == 404


# ─── Mentors ──────────────────────────────────────────────────────────────────

class TestMentors:
    def test_list_mentors(self, auth):
        r = requests.get(f"{BASE}/mentors", headers=auth)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 3

    def test_mentor_has_expected_fields(self, auth):
        r = requests.get(f"{BASE}/mentors", headers=auth)
        mentor = r.json()[0]
        for field in ["id", "user_id", "title", "skills", "industries", "availability_status"]:
            assert field in mentor

    def test_get_mentor_by_id(self, auth):
        r = requests.get(f"{BASE}/mentors/{MENTOR_A_ID}", headers=auth)
        assert r.status_code == 200
        data = r.json()
        assert data["id"] == MENTOR_A_ID
        assert data["user_name"] == "Priya Nair"
        assert data["availability_status"] == "available"
        assert isinstance(data["skills"], list)

    def test_get_mentor_not_found(self, auth):
        r = requests.get(f"{BASE}/mentors/no-such-mentor", headers=auth)
        assert r.status_code == 404

    def test_mentors_unauthenticated(self):
        r = requests.get(f"{BASE}/mentors")
        assert r.status_code == 401


# ─── Matching ─────────────────────────────────────────────────────────────────

class TestMatching:
    def test_get_existing_matches(self, auth):
        r = requests.get(f"{BASE}/applications/{APP_ID}/matches", headers=auth)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 3
        ranks = [m["rank_position"] for m in data]
        assert ranks == [1, 2, 3]

    def test_match_scores_are_valid(self, auth):
        r = requests.get(f"{BASE}/applications/{APP_ID}/matches", headers=auth)
        for match in r.json():
            assert 0 <= float(match["match_score"]) <= 100
            assert match["reason_summary"]
            assert match["mentor_name"] is not None

    def test_get_matches_app_not_found(self, auth):
        r = requests.get(f"{BASE}/applications/bad-id/matches", headers=auth)
        assert r.status_code == 404

    def test_select_mentor(self, auth):
        r = requests.post(
            f"{BASE}/applications/{APP_ID}/matches/select",
            json={"mentor_profile_id": MENTOR_A_ID},
            headers=auth,
        )
        assert r.status_code == 200
        data = r.json()
        assert data["selected_by_cradle"] is True
        assert data["mentor_profile_id"] == MENTOR_A_ID

    def test_select_mentor_deselects_others(self, auth):
        # Select B
        requests.post(
            f"{BASE}/applications/{APP_ID}/matches/select",
            json={"mentor_profile_id": MENTOR_B_ID},
            headers=auth,
        )
        # Check A is now deselected
        matches = requests.get(f"{BASE}/applications/{APP_ID}/matches", headers=auth).json()
        mentor_a = next(m for m in matches if m["mentor_profile_id"] == MENTOR_A_ID)
        mentor_b = next(m for m in matches if m["mentor_profile_id"] == MENTOR_B_ID)
        assert mentor_a["selected_by_cradle"] is False
        assert mentor_b["selected_by_cradle"] is True

    def test_select_mentor_not_found(self, auth):
        r = requests.post(
            f"{BASE}/applications/{APP_ID}/matches/select",
            json={"mentor_profile_id": "no-such-mentor"},
            headers=auth,
        )
        assert r.status_code == 404

    def test_generate_matches_with_gemini(self, auth):
        """Live Gemini call — ranks all 3 mentors and stores results."""
        r = requests.post(
            f"{BASE}/applications/{APP_ID}/generate-matches",
            headers=auth,
            timeout=30,
        )
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 3
        rank_positions = sorted(m["rank_position"] for m in data)
        assert rank_positions == [1, 2, 3]
        for m in data:
            assert m["reason_summary"]
            assert 0 <= float(m["match_score"]) <= 100
            assert m["ai_model_name"] is not None


# ─── Milestones ───────────────────────────────────────────────────────────────

class TestMilestones:
    def test_get_milestones(self, auth):
        r = requests.get(f"{BASE}/startups/{STARTUP_ID}/milestones", headers=auth)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 3

    def test_milestones_have_expected_fields(self, auth):
        r = requests.get(f"{BASE}/startups/{STARTUP_ID}/milestones", headers=auth)
        for m in r.json():
            assert "title" in m
            assert "status" in m
            assert "progress_percentage" in m
            assert 0 <= m["progress_percentage"] <= 100

    def test_milestone_statuses_match_seed(self, auth):
        r = requests.get(f"{BASE}/startups/{STARTUP_ID}/milestones", headers=auth)
        statuses = {m["title"]: m["status"] for m in r.json()}
        assert statuses["Complete MVP prototype"] == "completed"
        assert statuses["Acquire 10 pilot merchants"] == "in_progress"
        assert statuses["Generate first RM 5,000 monthly transaction volume"] == "not_started"

    def test_milestones_startup_not_found(self, auth):
        r = requests.get(f"{BASE}/startups/no-such-startup/milestones", headers=auth)
        assert r.status_code == 404

    def test_milestones_unauthenticated(self):
        r = requests.get(f"{BASE}/startups/{STARTUP_ID}/milestones")
        assert r.status_code == 401
