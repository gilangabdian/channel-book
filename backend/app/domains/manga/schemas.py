"""
Pydantic schemas for the Manga API (Jikan) responses.
Designed to be mostly compatible with BookSummary for easy frontend integration.
"""
from pydantic import BaseModel, Field


class MangaSummary(BaseModel):
    """Ringkasan manga — dipakai di list/search results."""
    id: str = Field(..., description="ID unik manga (Jikan ID as string)")
    title: str
    authors: list[str] = []
    cover_image: str | None = None
    categories: list[str] = []
    published_date: str | None = None
    rating: float | None = None
    source: str = Field(default="jikan", description="Sumber data")
    type: str = Field(default="manga", description="Tipe item untuk frontend")


class MangaDetail(MangaSummary):
    """Detail lengkap manga — dipakai di halaman detail."""
    description: str | None = None
    chapters: int | None = None
    volumes: int | None = None
    score: float | None = None
    scored_by: int | None = None
    status: str | None = None
    serialization: str | None = None


class MangaSearchResponse(BaseModel):
    """Response wrapper untuk search results manga."""
    query: str
    total_items: int
    items: list[MangaSummary]


class CategoryCard(BaseModel):
    """Satu kategori untuk ditampilkan di dropdown Categories."""
    id: str = Field(..., description="ID genre (Jikan API menggunakan ID integer yang di-cast ke string)")
    name: str = Field(..., description="Nama tampilan")
    manga_count: int | None = None


class CategoriesResponse(BaseModel):
    """Response wrapper untuk daftar kategori manga."""
    categories: list[CategoryCard]
    cached: bool = Field(default=False, description="Apakah data ini dari cache")


class CategoryMangasResponse(BaseModel):
    """Response wrapper untuk list manga dalam satu kategori."""
    category: str
    total_items: int
    items: list[MangaSummary]
