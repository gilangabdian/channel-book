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
    order_by: str = Query(default="relevance", description="Sorting (relevance, newest)"),
):
    """
    Cari buku menggunakan Google Books API.
    Contoh: /api/books/search?q=harry+potter&max_results=10
    """
    try:
        result = await google_books_service.search_books(q, max_results, start_index, order_by)
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
    Ambil detail lengkap satu buku dari API yang sesuai (Google Books atau Open Library).
    """
    try:
        if volume_id.startswith("OL"):
            return await openlibrary_service.get_book_detail(volume_id)
        return await google_books_service.get_book_detail(volume_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gagal mengambil detail buku: {str(e)}")


@router.get("/author/{author_name}/books", response_model=BookSearchResponse)
async def get_books_by_author(
    author_name: str,
    limit: int = Query(default=10, ge=1, le=40, description="Jumlah hasil"),
):
    """
    Cari buku yang ditulis oleh author tertentu.
    """
    try:
        result = await google_books_service.search_books(f'inauthor:"{author_name}"', limit, 0)
        return BookSearchResponse(
            query=f"author:{author_name}",
            total_items=result["total_items"],
            items=result["items"],
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gagal mengambil buku by author: {str(e)}")


@router.get("/{book_id}/recommendations", response_model=BookSearchResponse)
async def get_book_recommendations(book_id: str):
    """
    Ambil rekomendasi buku terkait. Karena Google API tidak punya fitur recommendations native,
    kita akan menggunakan sedikit "trik" dengan mencari subject dari buku tersebut.
    """
    try:
        # Get book detail first to know its categories
        if book_id.startswith("OL"):
            detail = await openlibrary_service.get_book_detail(book_id)
        else:
            detail = await google_books_service.get_book_detail(book_id)
            
        import random
        # Pick a random category or fallback to a general query
        category = detail.categories[0] if detail.categories else "fiction"
        
        # Take the first word of the category to make the search broader
        category_word = category.split()[0].lower()
        # Remove any non-alphabetic characters
        category_word = "".join(c for c in category_word if c.isalpha())
        if not category_word:
            category_word = "fiction"
        
        # We can shuffle the start_index to get "random" recommendations
        start_index = random.randint(0, 20)
        
        result = await google_books_service.search_books(category_word, max_results=10, start_index=start_index)
        
        # Filter out the current book
        items = [item for item in result["items"] if item.id != book_id]
        
        return BookSearchResponse(
            query=f"recommendations:{book_id}",
            total_items=len(items),
            items=items,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gagal mengambil rekomendasi: {str(e)}")
