"""
Router untuk semua endpoint terkait manga (menggunakan AniList API).
"""
from fastapi import APIRouter, HTTPException, Query
from app.domains.manga.schemas import (
    MangaSearchResponse,
    MangaDetail,
    CategoriesResponse,
    CategoryMangasResponse,
)
from app.domains.manga import anilist_service
import asyncio

router = APIRouter(prefix="/api/manga", tags=["Manga"])

# In-memory cache for manga categories to avoid spamming AniList API
_categories_cache = None

@router.get("/popular", response_model=MangaSearchResponse)
async def get_popular_mangas(
    limit: int = Query(default=20, ge=1, le=25, description="Jumlah hasil (max 25)"),
    page: int = Query(default=1, ge=1, description="Halaman untuk pagination"),
):
    """
    Ambil manga terpopuler menggunakan AniList API.
    """
    try:
        result = await anilist_service.get_popular_mangas(limit, page)
        return MangaSearchResponse(
            query="popular",
            total_items=result["total_items"],
            items=result["items"],
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gagal mengambil data dari AniList API: {repr(e)}")


@router.get("/search", response_model=MangaSearchResponse)
async def search_mangas(
    q: str = Query(..., min_length=1, description="Query pencarian manga"),
    limit: int = Query(default=20, ge=1, le=25, description="Jumlah hasil (max 25)"),
    page: int = Query(default=1, ge=1, description="Halaman untuk pagination"),
):
    """
    Cari manga menggunakan AniList API.
    Contoh: /api/manga/search?q=naruto&limit=10
    """
    try:
        result = await anilist_service.search_mangas(q, limit, page)
        return MangaSearchResponse(
            query=q,
            total_items=result["total_items"],
            items=result["items"],
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gagal mengambil data dari AniList API: {repr(e)}")


@router.get("/categories", response_model=CategoriesResponse)
async def get_categories():
    """
    Ambil daftar semua genre manga yang tersedia.
    """
    global _categories_cache
    if _categories_cache is not None:
        return CategoriesResponse(categories=_categories_cache, cached=True)

    try:
        categories = await anilist_service.get_categories()
        # Sort alphabetically for AniList since count is not provided
        categories = sorted(categories, key=lambda x: x.name)
        _categories_cache = categories
        return CategoriesResponse(categories=categories, cached=False)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gagal mengambil kategori manga: {repr(e)}")


@router.get("/categories/{genre_id}/mangas", response_model=CategoryMangasResponse)
async def get_mangas_by_category(
    genre_id: str,
    limit: int = Query(default=20, ge=1, le=25, description="Jumlah manga per halaman"),
    page: int = Query(default=1, ge=1, description="Halaman untuk pagination"),
):
    """
    Ambil daftar manga untuk satu genre ID.
    """
    try:
        result = await anilist_service.get_mangas_by_category(genre_id, limit, page)
        return CategoryMangasResponse(
            category=genre_id,
            total_items=result["total_items"],
            items=result["items"],
        )
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Gagal mengambil manga untuk genre '{genre_id}': {repr(e)}",
        )


@router.get("/{mal_id}", response_model=MangaDetail)
async def get_manga_detail(mal_id: str):
    """
    Ambil detail lengkap satu manga dari AniList API.
    Contoh: /api/manga/11
    """
    try:
        return await anilist_service.get_manga_detail(mal_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gagal mengambil detail manga: {repr(e)}")
