"""
Pydantic schemas for the Books API responses.
Normalizes data from Google Books and Open Library into a single format.
"""
from pydantic import BaseModel, Field


class BookSummary(BaseModel):
    """Ringkasan buku — dipakai di list/search results."""
    id: str = Field(..., description="ID unik buku (Google Books volume ID)")
    title: str
    authors: list[str] = []
    cover_image: str | None = None
    categories: list[str] = []
    published_date: str | None = None
    rating: float | None = None
    source: str = Field(default="google", description="Sumber data: 'google' | 'openlibrary'")
    type: str = Field(default="book", description="Tipe item untuk frontend")


class BookDetail(BookSummary):
    """Detail lengkap buku — dipakai di halaman detail /books/{id}."""
    description: str | None = None
    page_count: int | None = None
    rating: float | None = None
    ratings_count: int | None = None
    publisher: str | None = None
    isbn_13: str | None = None
    isbn_10: str | None = None
    language: str | None = None
    preview_link: str | None = None
    info_link: str | None = None


class BookSearchResponse(BaseModel):
    """Response wrapper untuk search results."""
    query: str
    total_items: int
    items: list[BookSummary]


class CategoryCard(BaseModel):
    """Satu kategori untuk ditampilkan di dropdown Categories."""
    id: str = Field(..., description="Slug kategori, misal 'fiction'")
    name: str = Field(..., description="Nama tampilan, misal 'FICTION'")
    book_count: int | None = None


class CategoriesResponse(BaseModel):
    """Response wrapper untuk daftar kategori."""
    categories: list[CategoryCard]
    cached: bool = Field(default=False, description="Apakah data ini dari cache")


class CategoryBooksResponse(BaseModel):
    """Response wrapper untuk list buku dalam satu kategori."""
    category: str
    total_items: int
    items: list[BookSummary]
