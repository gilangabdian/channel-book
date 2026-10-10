"""
Service untuk berkomunikasi dengan Google Books API.
Menangani search, detail, dan normalisasi data.
"""
import httpx
import asyncio
from typing import Dict, Any
from app.core.config import settings
from app.domains.books.schemas import BookSummary, BookDetail

GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1"

_SEARCH_CACHE: Dict[str, Any] = {}
_google_books_semaphore = asyncio.Semaphore(2)

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
        rating=info.get("averageRating"),
        source="google",
        type="book",
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


async def search_books(query: str, max_results: int = 20, start_index: int = 0, order_by: str = "relevance") -> dict:
    """
    Cari buku di Google Books API.
    Returns dict dengan total_items dan list of BookSummary.
    """
    cache_key = f"{query}_{max_results}_{start_index}_{order_by}"
    if cache_key in _SEARCH_CACHE:
        return _SEARCH_CACHE[cache_key]

    params = {
        "q": query,
        "maxResults": min(max_results, 40),  # Google Books max = 40
        "startIndex": start_index,
        "key": settings.GOOGLE_BOOKS_API_KEY,
        "orderBy": order_by,
        "fields": "totalItems,items(id,volumeInfo(title,authors,imageLinks/thumbnail,imageLinks/smallThumbnail,categories,publishedDate,averageRating))",
    }

    async with _google_books_semaphore:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(f"{GOOGLE_BOOKS_BASE}/volumes", params=params)
            resp.raise_for_status()
            data = resp.json()

    total = data.get("totalItems", 0)
    items = [_parse_book_summary(item) for item in data.get("items", [])]

    if not any(query.startswith(prefix) for prefix in ("subject:", "inauthor:", "intitle:")):
        q_lower = query.lower()
        items = [
            item for item in items 
            if q_lower in item.title.lower() or any(q_lower in author.lower() for author in item.authors)
        ]

    # Deduplikasi berdasarkan ID untuk mencegah React Key Error di frontend
    unique_items = []
    seen_ids = set()
    for item in items:
        if item.id not in seen_ids:
            seen_ids.add(item.id)
            unique_items.append(item)
    items = unique_items

    result = {"total_items": total, "items": items}
    _SEARCH_CACHE[cache_key] = result
    return result


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
    result = await search_books(subject, max_results=max_results)
    return result["items"]
