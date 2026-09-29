from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Setup paths to import app
sys.path.append(str(Path(__file__).parent.parent))

from app.main import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint /"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_chat_invalid_mascot():
    """Test the chat endpoint with an invalid mascot."""
    response = client.post(
        "/api/chat",
        json={"message": "Halo!", "mascot": "kucing"}
    )
    assert response.status_code == 400
    assert "Maskot tidak dikenal" in response.json()["detail"]
    
# NOTE: We avoid testing valid mascots ("narra"/"syra") in feature tests 
# without mocking because it will hit the real Groq/Gemini API and consume quota.
# For full E2E testing, we would mock the `chat_with_ai` service.
