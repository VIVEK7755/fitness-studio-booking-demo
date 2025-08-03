# backend/tests/test_main.py
from fastapi.testclient import TestClient
from backend.main import app
from backend.db import create_db_and_tables
import pytest

# Call DB initializer before any tests
@pytest.fixture(scope="session", autouse=True)
def setup_db():
    create_db_and_tables()

client = TestClient(app)

def test_get_classes():
    response = client.get("/classes")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_book_class_invalid_email():
    response = client.post("/book", json={
        "class_id": 1,
        "client_name": "Test User",
        "client_email": "invalid-email"
    })
    assert response.status_code == 422  # validation error

def test_get_bookings_without_email():
    response = client.get("/bookings")
    assert response.status_code == 200  # should succeed now
    assert isinstance(response.json(), list)
