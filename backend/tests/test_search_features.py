from fastapi.testclient import TestClient
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from app.main import app

client = TestClient(app)

def test_manga_search_by_author():
    """Test searching manga by author uses the new AniList Staff Query."""
    response = client.get("/api/manga/author/Masashi%20Kishimoto/mangas?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "author:Masashi Kishimoto"
    assert len(data["items"]) > 0
    
    # We should expect to see some titles returned for Kishimoto
    titles = [item["title"].lower() for item in data["items"]]
    assert any("naruto" in t for t in titles), "Expected 'naruto' in author's works"


def test_manga_recommendations():
    """Test getting recommendations for a specific manga."""
    # 30015 is Solo Leveling ID
    response = client.get("/api/manga/30015/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "recommendations:30015"
    assert len(data["items"]) > 0


def test_book_search_by_author():
    """Test searching books by author uses Google Books inauthor: operator."""
    response = client.get("/api/books/author/J.K.%20Rowling/books?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "author:J.K. Rowling"
    assert len(data["items"]) > 0
    
    titles = [item["title"].lower() for item in data["items"]]
    assert any("harry potter" in t for t in titles), "Expected 'harry potter' in J.K. Rowling's works"


def test_book_recommendations():
    """Test getting recommendations for a specific book."""
    # 8U2oAAAAQBAJ is Harry Potter and the Sorcerer's Stone
    response = client.get("/api/books/8U2oAAAAQBAJ/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "recommendations:8U2oAAAAQBAJ"
    assert len(data["items"]) > 0
