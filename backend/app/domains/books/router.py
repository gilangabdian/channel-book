"""
Router untuk semua endpoint terkait buku.
Menggabungkan Google Books (search/detail) dan Open Library (categories).
"""
from fastapi import APIRouter, HTTPException, Query
from app.domains.books.schemas import (
    BookSearchResponse,
    BookDetail,
    CategoriesResponse,
    CategoryBooksResponse,
)
from app.domains.books import google_books_service, openlibrary_service

router = APIRouter(prefix="/api/books", tags=["Books"])


@router.get("/search", response_model=BookSearchResponse)
async def search_books(
    q: str = Query(..., min_length=1, description="Query pencarian buku"),
    max_results: int = Query(default=20, ge=1, le=40, description="Jumlah hasil (max 40)"),
    start_index: int = Query(default=0, ge=0, description="Offset untuk pagination"),
):
    """
    Cari buku menggunakan Google Books API.
    Contoh: /api/books/search?q=harry+potter&max_results=10
    """
    try:
        result = await google_books_service.search_books(q, max_results, start_index)
        return BookSearchResponse(
            query=q,
            total_items=result["total_items"],
            items=result["items"],
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gagal mengambil data dari Google Books: {str(e)}")


@router.get("/categories", response_model=CategoriesResponse)
async def get_categories():
    """
    Ambil daftar semua kategori buku yang tersedia.
    Data di-cache selama 24 jam.
    """
    categories = await openlibrary_service.get_categories()
    return CategoriesResponse(categories=categories, cached=False)


@router.get("/categories/{category_id}/books", response_model=CategoryBooksResponse)
async def get_books_by_category(
    category_id: str,
    limit: int = Query(default=12, ge=1, le=50, description="Jumlah buku per halaman"),
    offset: int = Query(default=0, ge=0, description="Offset untuk pagination"),
):
    """
    Ambil daftar buku untuk satu kategori dari Open Library.
    Jika gagal, fallback ke Google Books subject search.
    """
    try:
        result = await openlibrary_service.get_books_by_subject(category_id, limit, offset)
        return CategoryBooksResponse(
            category=category_id,
            total_items=result["total_items"],
            items=result["items"],
        )
    except Exception:
        # Fallback ke Google Books
        try:
            items = await google_books_service.search_books_by_subject(category_id, limit)
            return CategoryBooksResponse(
                category=category_id,
                total_items=len(items),
                items=items,
            )
        except Exception as e:
            raise HTTPException(
                status_code=502,
                detail=f"Gagal mengambil buku untuk kategori '{category_id}': {str(e)}",
            )


@router.get("/{volume_id}", response_model=BookDetail)
async def get_book_detail(volume_id: str):
    """
    Ambil detail lengkap satu buku dari Google Books API.
    Contoh: /api/books/abc123XYZ
    """
    try:
        return await google_books_service.get_book_detail(volume_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gagal mengambil detail buku: {str(e)}")
