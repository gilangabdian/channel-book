"""
Service untuk berkomunikasi dengan Jikan API (MyAnimeList).
Menggantikan AniList untuk memfilter manga dewasa (menggunakan sfw=true).
"""
import httpx
from app.domains.manga.schemas import MangaSummary, MangaDetail, CategoryCard

JIKAN_URL = "https://api.jikan.moe/v4"

def _extract_authors(authors_data: list) -> list[str]:
    return [author.get("name") for author in authors_data if author.get("name")]

def _parse_manga_summary(item: dict) -> MangaSummary:
    title = item.get("title_english") or item.get("title") or "Unknown Title"
    cover = item.get("images", {}).get("jpg", {}).get("image_url") or item.get("images", {}).get("webp", {}).get("image_url")
    
    genres_data = item.get("genres", [])
    genres = [g.get("name") for g in genres_data if g.get("name")]
    
    published_date = None
    year = item.get("published", {}).get("prop", {}).get("from", {}).get("year")
    if year:
        published_date = str(year)
        
    authors = _extract_authors(item.get("authors", []))

    return MangaSummary(
        id=str(item.get("mal_id")),
        title=title,
        authors=authors,
        cover_image=cover,
        categories=genres,
        published_date=published_date,
        source="jikan",
        type="manga",
    )


def _parse_manga_detail(item: dict) -> MangaDetail:
    title = item.get("title_english") or item.get("title") or "Unknown Title"
    cover = item.get("images", {}).get("jpg", {}).get("large_image_url") or item.get("images", {}).get("jpg", {}).get("image_url")
    
    genres_data = item.get("genres", [])
    genres = [g.get("name") for g in genres_data if g.get("name")]
    
    published_date = None
    year = item.get("published", {}).get("prop", {}).get("from", {}).get("year")
    if year:
        published_date = str(year)
        
    authors = _extract_authors(item.get("authors", []))
    
    # Jikan score is out of 10
    score = item.get("score")
    
    serialization = None
    serializations_data = item.get("serializations", [])
    if serializations_data and len(serializations_data) > 0:
        serialization = serializations_data[0].get("name")

    return MangaDetail(
        id=str(item.get("mal_id")),
        title=title,
        authors=authors,
        cover_image=cover,
        categories=genres,
        published_date=published_date,
        source="jikan",
        type="manga",
        description=item.get("synopsis"),
        chapters=item.get("chapters"),
        volumes=item.get("volumes"),
        score=score,
        scored_by=item.get("scored_by"),
        status=item.get("status"),
        serialization=serialization,
    )


from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Helper function to fetch data from Jikan API with retry logic
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10),
    retry=retry_if_exception_type(httpx.HTTPStatusError),
    reraise=True
)
async def _fetch_jikan(url: str, params: dict = None) -> dict:
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(url, params=params)
        # We only want to retry on 429 Too Many Requests or 5xx server errors
        if resp.status_code == 429 or resp.status_code >= 500:
            resp.raise_for_status()
        
        # If it's a 4xx error (other than 429), we just raise it without retrying
        resp.raise_for_status()
        return resp.json()


async def search_mangas(query: str, limit: int = 20, page: int = 1) -> dict:
    params = {
        "q": query,
        "page": page,
        "limit": min(limit, 25),
        "sfw": "true"
    }

    data = await _fetch_jikan(f"{JIKAN_URL}/manga", params=params)

    items_data = data.get("data", [])
    pagination = data.get("pagination", {})
    total = pagination.get("items", {}).get("total", 0)
    
    items = [_parse_manga_summary(item) for item in items_data]

    return {"total_items": total, "items": items}


async def get_manga_detail(jikan_id: str) -> MangaDetail:
    data = await _fetch_jikan(f"{JIKAN_URL}/manga/{jikan_id}/full")

    item = data.get("data")
    if not item:
        raise ValueError("Manga not found")

    return _parse_manga_detail(item)


async def get_categories() -> list[CategoryCard]:
    data = await _fetch_jikan(f"{JIKAN_URL}/genres/manga?filter=genres")
        
    genres = data.get("data", [])
    categories = []
    
    for genre in genres:
        # Filter explicit genre manually just in case
        if genre.get("name", "").lower() in ["erotica", "hentai", "boys love", "girls love"]:
            continue
            
        categories.append(
            CategoryCard(
                id=str(genre.get("mal_id")),
                name=genre.get("name"),
                manga_count=genre.get("count")
            )
        )
    return categories


async def get_mangas_by_category(genre_id: str, limit: int = 20, page: int = 1) -> dict:
    params = {
        "genres": genre_id,
        "page": page,
        "limit": min(limit, 25),
        "sfw": "true",
        "order_by": "popularity",
        "sort": "desc"
    }
    
    data = await _fetch_jikan(f"{JIKAN_URL}/manga", params=params)
        
    items_data = data.get("data", [])
    pagination = data.get("pagination", {})
    total = pagination.get("items", {}).get("total", 0)
    
    items = [_parse_manga_summary(item) for item in items_data]

    return {"total_items": total, "items": items}


async def get_popular_mangas(limit: int = 20, page: int = 1) -> dict:
    params = {
        "page": page,
        "limit": min(limit, 25),
        "sfw": "true"
    }
    
    data = await _fetch_jikan(f"{JIKAN_URL}/top/manga", params=params)
        
    items_data = data.get("data", [])
    pagination = data.get("pagination", {})
    total = pagination.get("items", {}).get("total", 0)
    
    items = [_parse_manga_summary(item) for item in items_data]

    return {"total_items": total, "items": items}
