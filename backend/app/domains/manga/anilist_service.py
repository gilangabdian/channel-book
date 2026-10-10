"""
Service untuk berkomunikasi dengan AniList GraphQL API.
Berfungsi sebagai alternatif Jikan API (karena isu pemblokiran ISP).
"""
import httpx
from app.domains.manga.schemas import MangaSummary, MangaDetail, CategoryCard

ANILIST_URL = "https://graphql.anilist.co"

# GraphQL Queries
SEARCH_QUERY = """
query ($query: String, $page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
    }
    media (search: $query, type: MANGA, sort: SEARCH_MATCH, isAdult: false, genre_not_in: ["Ecchi", "Hentai"]) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      genres
      startDate {
        year
      }
      averageScore
      staff {
        edges {
          role
          node {
            name {
              full
            }
          }
        }
      }
    }
  }
}
"""

DETAIL_QUERY = """
query ($id: Int) {
  Media (id: $id, type: MANGA) {
    id
    title {
      romaji
      english
    }
    description(asHtml: false)
    coverImage {
      extraLarge
    }
    genres
    startDate {
      year
    }
    chapters
    volumes
    averageScore
    status
    staff {
      edges {
        role
        node {
          name {
            full
          }
        }
      }
    }
  }
}
"""

GENRE_QUERY = """
query {
  GenreCollection
}
"""

BY_GENRE_QUERY = """
query ($genre: String, $page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
    }
    media (genre: $genre, type: MANGA, sort: POPULARITY_DESC, isAdult: false, genre_not_in: ["Ecchi", "Hentai"]) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      genres
      startDate {
        year
      }
      averageScore
      staff {
        edges {
          role
          node {
            name {
              full
            }
          }
        }
      }
    }
  }
}
"""

POPULAR_QUERY = """
query ($page: Int, $perPage: Int) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
    }
    media (type: MANGA, sort: POPULARITY_DESC, isAdult: false, genre_not_in: ["Ecchi", "Hentai"]) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      genres
      startDate {
        year
      }
      averageScore
      staff {
        edges {
          role
          node {
            name {
              full
            }
          }
        }
      }
    }
  }
}
"""

RECOMMENDATIONS_QUERY = """
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    recommendations(sort: RATING_DESC, page: 1, perPage: 10) {
      nodes {
        mediaRecommendation {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          genres
          startDate {
            year
          }
          averageScore
          staff {
            edges {
              role
              node {
                name {
                  full
                }
              }
            }
          }
        }
      }
    }
  }
}
"""

AUTHOR_WORKS_QUERY = """
query ($search: String) {
  Staff(search: $search) {
    staffMedia(type: MANGA, sort: POPULARITY_DESC, page: 1, perPage: 10) {
      edges {
        node {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          genres
          startDate {
            year
          }
          averageScore
          staff {
            edges {
              role
              node {
                name {
                  full
                }
              }
            }
          }
        }
      }
    }
  }
}
"""


def _extract_authors(staff_edges: list) -> list[str]:
    authors = []
    if not staff_edges:
        return authors
    for edge in staff_edges:
        role = edge.get("role", "").lower()
        if "story" in role or "art" in role or "original creator" in role:
            name = edge.get("node", {}).get("name", {}).get("full")
            if name and name not in authors:
                authors.append(name)
    return authors


def _parse_manga_summary(item: dict) -> MangaSummary:
    title = item.get("title", {}).get("english") or item.get("title", {}).get("romaji") or "Unknown Title"
    cover = item.get("coverImage", {}).get("large")
    genres = item.get("genres", [])
    
    published_date = None
    year = item.get("startDate", {}).get("year")
    if year:
        published_date = str(year)
        
    staff_edges = item.get("staff", {}).get("edges", [])
    authors = _extract_authors(staff_edges)

    score = item.get("averageScore")
    if score:
        score = score / 10.0

    return MangaSummary(
        id=str(item.get("id")),
        title=title,
        authors=authors,
        cover_image=cover,
        categories=genres,
        published_date=published_date,
        rating=score,
        source="anilist",
        type="manga",
    )


def _parse_manga_detail(item: dict) -> MangaDetail:
    title = item.get("title", {}).get("english") or item.get("title", {}).get("romaji") or "Unknown Title"
    cover = item.get("coverImage", {}).get("extraLarge")
    genres = item.get("genres", [])
    
    published_date = None
    year = item.get("startDate", {}).get("year")
    if year:
        published_date = str(year)
        
    staff_edges = item.get("staff", {}).get("edges", [])
    authors = _extract_authors(staff_edges)
    
    # AniList averageScore is out of 100, we convert to 10 for consistency or leave as is (float)
    score = item.get("averageScore")
    if score:
        score = score / 10.0

    import re
    raw_desc = item.get("description") or ""
    # Clean up (Source: ...) and Notes section
    clean_desc = re.sub(r'(?i)\(Source:.*', '', raw_desc, flags=re.DOTALL)
    clean_desc = re.sub(r'(?i)(<br\s*/?>\s*)*<i>\s*Note[s]?:.*', '', clean_desc, flags=re.DOTALL)
    clean_desc = re.sub(r'(?i)(<br\s*/?>\s*)*Note[s]?:.*', '', clean_desc, flags=re.DOTALL)
    
    clean_desc = clean_desc.strip()
    if clean_desc.endswith("<br>"):
        clean_desc = clean_desc[:-4].strip()
        
    return MangaDetail(
        id=str(item.get("id")),
        title=title,
        authors=authors,
        cover_image=cover,
        categories=genres,
        published_date=published_date,
        source="anilist",
        type="manga",
        description=clean_desc if clean_desc else None,
        chapters=item.get("chapters"),
        volumes=item.get("volumes"),
        score=score,
        scored_by=0, # AniList doesn't expose scored_by easily in basic Media query
        status=item.get("status"),
        serialization=None,
    )


async def search_mangas(query: str, limit: int = 20, page: int = 1) -> dict:
    variables = {
        "query": query,
        "page": page,
        "perPage": min(limit, 25)
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(ANILIST_URL, json={"query": SEARCH_QUERY, "variables": variables})
        resp.raise_for_status()
        data = resp.json().get("data", {}).get("Page", {})

    total = data.get("pageInfo", {}).get("total", 0)
    items = [_parse_manga_summary(item) for item in data.get("media", [])]

    q_lower = query.lower()
    items = [
        item for item in items 
        if q_lower in item.title.lower() or any(q_lower in author.lower() for author in item.authors)
    ]

    return {"total_items": total, "items": items}


async def get_manga_detail(anilist_id: str) -> MangaDetail:
    variables = {"id": int(anilist_id)}

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(ANILIST_URL, json={"query": DETAIL_QUERY, "variables": variables})
        resp.raise_for_status()
        media = resp.json().get("data", {}).get("Media", {})

    if not media:
        raise ValueError("Manga not found")

    return _parse_manga_detail(media)


async def get_categories() -> list[CategoryCard]:
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(ANILIST_URL, json={"query": GENRE_QUERY})
        resp.raise_for_status()
        genres = resp.json().get("data", {}).get("GenreCollection", [])
        
    # AniList genres don't have IDs, the name itself is the ID
    categories = []
    for genre in genres:
        # Skip weird genres if needed, but AniList genres are clean
        categories.append(
            CategoryCard(
                id=genre,
                name=genre,
                manga_count=None # AniList doesn't return count easily
            )
        )
    return categories


async def get_mangas_by_category(genre_id: str, limit: int = 20, page: int = 1) -> dict:
    variables = {
        "genre": genre_id,
        "page": page,
        "perPage": min(limit, 25)
    }
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(ANILIST_URL, json={"query": BY_GENRE_QUERY, "variables": variables})
        resp.raise_for_status()
        data = resp.json().get("data", {}).get("Page", {})
        
    total = data.get("pageInfo", {}).get("total", 0)
    items = [_parse_manga_summary(item) for item in data.get("media", [])]

    return {"total_items": total, "items": items}


async def get_popular_mangas(limit: int = 20, page: int = 1) -> dict:
    variables = {
        "page": page,
        "perPage": min(limit, 25)
    }
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(ANILIST_URL, json={"query": POPULAR_QUERY, "variables": variables})
        resp.raise_for_status()
        data = resp.json().get("data", {}).get("Page", {})
        
    total = data.get("pageInfo", {}).get("total", 0)
    items = [_parse_manga_summary(item) for item in data.get("media", [])]

    return {"total_items": total, "items": items}


async def search_manga_by_author(author_name: str, limit: int = 10) -> dict:
    variables = {
        "search": author_name
    }
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(ANILIST_URL, json={"query": AUTHOR_WORKS_QUERY, "variables": variables})
        resp.raise_for_status()
        data = resp.json().get("data", {}).get("Staff", {})
        
    media_edges = data.get("staffMedia", {}).get("edges", [])
    
    items = []
    for edge in media_edges:
        node = edge.get("node")
        if node:
            items.append(_parse_manga_summary(node))
            
    # Filter out anything more than limit since AniList perPage in staffMedia works differently sometimes
    items = items[:limit]

    return {"total_items": len(items), "items": items}


async def get_manga_recommendations(anilist_id: str) -> list[MangaSummary]:
    variables = {"id": int(anilist_id)}

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(ANILIST_URL, json={"query": RECOMMENDATIONS_QUERY, "variables": variables})
        resp.raise_for_status()
        media = resp.json().get("data", {}).get("Media", {})

    nodes = media.get("recommendations", {}).get("nodes", [])
    
    items = []
    for node in nodes:
        rec_media = node.get("mediaRecommendation")
        if rec_media:
            items.append(_parse_manga_summary(rec_media))

    return items
