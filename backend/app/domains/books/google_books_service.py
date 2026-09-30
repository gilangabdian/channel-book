"""
Service untuk berkomunikasi dengan Google Books API.
Menangani search, detail, dan normalisasi data.
"""
import httpx
from app.core.config import settings
from app.domains.books.schemas import BookSummary, BookDetail

GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1"


def _parse_book_summary(item: dict) -> BookSummary:
    """Normalisasi satu item dari Google Books API ke BookSummary."""
    info = item.get("volumeInfo", {})
    image_links = info.get("imageLinks", {})

    # Ambil cover terbaik yang tersedia
    cover = (
        image_links.get("thumbnail")
        or image_links.get("smallThumbnail")
    )
    # Google Books mengembalikan http, upgrade ke https
    if cover and cover.startswith("http://"):
        cover = cover.replace("http://", "https://", 1)

    return BookSummary(
        id=item.get("id", ""),
        title=info.get("title", "Unknown Title"),
        authors=info.get("authors", []),
        cover_image=cover,
        categories=info.get("categories", []),
        published_date=info.get("publishedDate"),
        source="google",
    )


def _parse_book_detail(item: dict) -> BookDetail:
    """Normalisasi satu item dari Google Books API ke BookDetail."""
    info = item.get("volumeInfo", {})
    image_links = info.get("imageLinks", {})

    cover = (
        image_links.get("thumbnail")
        or image_links.get("smallThumbnail")
    )
    if cover and cover.startswith("http://"):
        cover = cover.replace("http://", "https://", 1)

    # Ekstrak ISBN
    isbn_13 = None
    isbn_10 = None
    for identifier in info.get("industryIdentifiers", []):
        if identifier.get("type") == "ISBN_13":
            isbn_13 = identifier.get("identifier")
        elif identifier.get("type") == "ISBN_10":
            isbn_10 = identifier.get("identifier")

    return BookDetail(
        id=item.get("id", ""),
        title=info.get("title", "Unknown Title"),
        authors=info.get("authors", []),
        cover_image=cover,
        categories=info.get("categories", []),
        published_date=info.get("publishedDate"),
        source="google",
        description=info.get("description"),
        page_count=info.get("pageCount"),
        rating=info.get("averageRating"),
        ratings_count=info.get("ratingsCount"),
        publisher=info.get("publisher"),
        isbn_13=isbn_13,
        isbn_10=isbn_10,
        language=info.get("language"),
        preview_link=info.get("previewLink"),
        info_link=info.get("infoLink"),
    )


async def search_books(query: str, max_results: int = 20, start_index: int = 0) -> dict:
    """
    Cari buku di Google Books API.
    Returns dict dengan total_items dan list of BookSummary.
    """
    params = {
        "q": query,
        "maxResults": min(max_results, 40),  # Google Books max = 40
        "startIndex": start_index,
        "key": settings.GOOGLE_BOOKS_API_KEY,
        "fields": "totalItems,items(id,volumeInfo(title,authors,imageLinks/thumbnail,imageLinks/smallThumbnail,categories,publishedDate))",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(f"{GOOGLE_BOOKS_BASE}/volumes", params=params)
        resp.raise_for_status()
        data = resp.json()

    total = data.get("totalItems", 0)
    items = [_parse_book_summary(item) for item in data.get("items", [])]

    return {"total_items": total, "items": items}


async def get_book_detail(volume_id: str) -> BookDetail:
    """
    Ambil detail lengkap satu buku dari Google Books API.
    """
    params = {
        "key": settings.GOOGLE_BOOKS_API_KEY,
        "fields": "id,volumeInfo(title,authors,imageLinks/thumbnail,imageLinks/smallThumbnail,categories,publishedDate,description,pageCount,averageRating,ratingsCount,publisher,industryIdentifiers,language,previewLink,infoLink)",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(f"{GOOGLE_BOOKS_BASE}/volumes/{volume_id}", params=params)
        resp.raise_for_status()
        data = resp.json()

    return _parse_book_detail(data)


async def search_books_by_subject(subject: str, max_results: int = 10) -> list[BookSummary]:
    """
    Cari buku berdasarkan subject/kategori di Google Books.
    Dipakai sebagai fallback jika Open Library gagal.
    """
    result = await search_books(f"subject:{subject}", max_results=max_results)
    return result["items"]
