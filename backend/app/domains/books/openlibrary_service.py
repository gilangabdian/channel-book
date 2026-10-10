"""
Service untuk berkomunikasi dengan Open Library API.
Digunakan terutama untuk mengambil daftar buku per kategori (subjects).
Open Library gratis tanpa API key dan tanpa rate limit resmi.
"""
import httpx
import time
from app.domains.books.schemas import BookSummary, CategoryCard

OPEN_LIBRARY_BASE = "https://openlibrary.org"

# ──────────────────────────────────────────────────
# In-memory cache sederhana (diganti Redis nanti jika perlu)
# ──────────────────────────────────────────────────
_cache: dict[str, dict] = {}
CACHE_TTL_SECONDS = 86400  # 24 jam


def _get_cached(key: str):
    """Ambil data dari cache jika belum expired."""
    entry = _cache.get(key)
    if entry and (time.time() - entry["timestamp"]) < CACHE_TTL_SECONDS:
        return entry["data"]
    return None


def _set_cached(key: str, data):
    """Simpan data ke cache dengan timestamp."""
    _cache[key] = {"data": data, "timestamp": time.time()}


# ──────────────────────────────────────────────────
# Daftar kategori populer (master list)
# Open Library memakai lowercase slugs sebagai subject key.
# ──────────────────────────────────────────────────
POPULAR_CATEGORIES = [
    # Top categories (tampil sebagai card besar di frontend)
    {"id": "fiction", "name": "Fiction", "is_top": True},
    {"id": "non-fiction", "name": "Non-Fiction", "is_top": True},
    {"id": "fantasy", "name": "Fantasy", "is_top": True},
    {"id": "mystery_and_detective_stories", "name": "Mystery", "is_top": True},
    {"id": "romance", "name": "Romance", "is_top": True},
    {"id": "self-help", "name": "Self-Help", "is_top": True},

    # All genres (tampil sebagai list teks kecil di frontend)
    {"id": "adventure", "name": "Action & Adventure", "is_top": False},
    {"id": "art", "name": "Art & Photography", "is_top": False},
    {"id": "biography", "name": "Biography", "is_top": False},
    {"id": "business", "name": "Business", "is_top": False},
    {"id": "children", "name": "Children's Books", "is_top": False},
    {"id": "comics", "name": "Comics & Manga", "is_top": False},
    {"id": "cooking", "name": "Cookbooks", "is_top": False},
    {"id": "graphic_novels", "name": "Graphic Novels", "is_top": False},
    {"id": "historical_fiction", "name": "Historical Fiction", "is_top": False},
    {"id": "history", "name": "History", "is_top": False},
    {"id": "horror", "name": "Horror", "is_top": False},
    {"id": "humor", "name": "Humor", "is_top": False},
    {"id": "poetry", "name": "Poetry", "is_top": False},
    {"id": "religion", "name": "Religion & Spirituality", "is_top": False},
    {"id": "science", "name": "Science & Tech", "is_top": False},
    {"id": "science_fiction", "name": "Science Fiction", "is_top": False},
    {"id": "sports", "name": "Sports", "is_top": False},
    {"id": "thriller", "name": "Thriller", "is_top": False},
    {"id": "travel", "name": "Travel", "is_top": False},
    {"id": "true_crime", "name": "True Crime", "is_top": False},
]


def _parse_ol_book(work: dict) -> BookSummary:
    """Normalisasi satu work dari Open Library ke BookSummary."""
    key = work.get("key", "")
    # Open Library key format: "/works/OL12345W"
    ol_id = key.split("/")[-1] if key else ""

    # Cover image dari Open Library
    cover_id = work.get("cover_id")
    cover_image = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg" if cover_id else None

    authors = []
    for author in work.get("authors", []):
        name = author.get("name")
        if name:
            authors.append(name)

    return BookSummary(
        id=ol_id,
        title=work.get("title", "Unknown Title"),
        authors=authors,
        cover_image=cover_image,
        categories=[work.get("subject", [""])[0]] if work.get("subject") else [],
        published_date=str(work.get("first_publish_year", "")),
        source="openlibrary",
    )


async def get_categories() -> list[CategoryCard]:
    """
    Mengembalikan daftar semua kategori buku yang tersedia.
    Data di-cache selama 24 jam.
    """
    cache_key = "all_categories"
    cached = _get_cached(cache_key)
    if cached:
        return cached

    categories = [
        CategoryCard(id=cat["id"], name=cat["name"])
        for cat in POPULAR_CATEGORIES
    ]

    _set_cached(cache_key, categories)
    return categories


async def get_top_categories() -> list[CategoryCard]:
    """Mengembalikan hanya kategori utama (untuk card besar)."""
    all_cats = await get_categories()
    top_ids = {cat["id"] for cat in POPULAR_CATEGORIES if cat["is_top"]}
    return [cat for cat in all_cats if cat.id in top_ids]


async def get_all_genres() -> list[CategoryCard]:
    """Mengembalikan hanya genre tambahan (untuk list teks kecil)."""
    all_cats = await get_categories()
    genre_ids = {cat["id"] for cat in POPULAR_CATEGORIES if not cat["is_top"]}
    return [cat for cat in all_cats if cat.id in genre_ids]


async def get_books_by_subject(subject: str, limit: int = 12, offset: int = 0) -> dict:
    """
    Ambil daftar buku untuk satu subject/kategori dari Open Library.
    Data di-cache selama 24 jam per subject.
    """
    cache_key = f"subject_{subject}_{limit}_{offset}"
    cached = _get_cached(cache_key)
    if cached:
        return {**cached, "cached": True}

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(
            f"{OPEN_LIBRARY_BASE}/subjects/{subject}.json",
            params={"limit": limit, "offset": offset},
        )
        resp.raise_for_status()
        data = resp.json()

    works = data.get("works", [])
    raw_items = [_parse_ol_book(work) for work in works]
    
    # Deduplikasi
    items = []
    seen = set()
    for item in raw_items:
        if item.id not in seen:
            seen.add(item.id)
            items.append(item)
            
    total = data.get("work_count", 0)

    result = {"total_items": total, "items": items}
    _set_cached(cache_key, result)
    return result


from app.domains.books.schemas import BookDetail

async def get_book_detail(ol_id: str) -> BookDetail:
    """
    Ambil detail lengkap satu buku dari Open Library API.
    """
    async with httpx.AsyncClient(timeout=10.0) as client:
        # Panggil endpoint works
        resp = await client.get(f"{OPEN_LIBRARY_BASE}/works/{ol_id}.json")
        resp.raise_for_status()
        data = resp.json()

        # Ekstrak data
        title = data.get("title", "Unknown Title")
        
        desc_data = data.get("description", "")
        description = desc_data.get("value") if isinstance(desc_data, dict) else desc_data
        
        categories = data.get("subjects", [])
        
        # Filter cover -1
        valid_covers = [c for c in data.get("covers", []) if c != -1]
        cover_image = f"https://covers.openlibrary.org/b/id/{valid_covers[0]}-L.jpg" if valid_covers else None

        # Ambil data nama penulis secara paralel jika ada
        authors = []
        author_refs = data.get("authors", [])
        if author_refs:
            import asyncio
            async def fetch_author(ref):
                author_key = ref.get("author", {}).get("key")
                if author_key:
                    try:
                        a_resp = await client.get(f"{OPEN_LIBRARY_BASE}{author_key}.json")
                        if a_resp.status_code == 200:
                            return a_resp.json().get("name")
                    except Exception:
                        pass
                return None

            fetched_authors = await asyncio.gather(*[fetch_author(ref) for ref in author_refs])
            authors = [name for name in fetched_authors if name]

        if not authors:
            authors = ["Unknown"]
    
    return BookDetail(
        id=ol_id,
        title=title,
        authors=authors,
        cover_image=cover_image,
        categories=categories[:5], # ambil max 5 aja
        published_date=None,
        source="openlibrary",
        description=description,
        page_count=None,
        rating=None,
        ratings_count=None,
        publisher=None,
        isbn_13=None,
        isbn_10=None,
        language=None,
        preview_link=f"https://openlibrary.org/works/{ol_id}",
        info_link=f"https://openlibrary.org/works/{ol_id}"
    )
