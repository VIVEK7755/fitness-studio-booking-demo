from fastapi.testclient import TestClient
from main import app

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

def test_get_bookings_missing_email():
    response = client.get("/bookings")
    assert response.status_code == 422  # missing email param
