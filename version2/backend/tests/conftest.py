import pytest
import requests

BASE_URL = "http://localhost:8000"

ADMIN_EMAIL = "admin@cradle.com.my"
ADMIN_PASSWORD = "admin1234"

APP_ID = "app-ali-2026"
STARTUP_ID = "startup-ali-001"
MENTOR_A_ID = "mentor-a-001"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{BASE_URL}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Login failed: {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth(token):
    return {"Authorization": f"Bearer {token}"}
