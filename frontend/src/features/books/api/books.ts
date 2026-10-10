/**
 * API functions untuk semua endpoint terkait buku.
 * Source: Google Books API (search/detail) + Open Library (categories).
 */
import { apiFetch } from "@/shared/api/client";

// ────────────────── Types ──────────────────

export interface BookSummary {
  id: string;
  title: string;
  authors: string[];
  cover_image: string | null;
  categories: string[];
  published_date: string | null;
  source: "google" | "openlibrary";
}

export interface BookDetail extends BookSummary {
  description: string | null;
  page_count: number | null;
  rating: number | null;
  ratings_count: number | null;
  publisher: string | null;
  isbn_13: string | null;
  isbn_10: string | null;
  language: string | null;
  preview_link: string | null;
  info_link: string | null;
}

export interface BookSearchResponse {
  query: string;
  total_items: number;
  items: BookSummary[];
}

export interface CategoryCard {
  id: string;
  name: string;
  book_count: number | null;
}

export interface CategoriesResponse {
  categories: CategoryCard[];
  cached: boolean;
}

export interface CategoryBooksResponse {
  category: string;
  total_items: number;
  items: BookSummary[];
}

// ────────────────── API Functions ──────────────────

/** Cari buku via Google Books API (melalui backend). */
export async function searchBooks(
  query: string,
  maxResults = 20,
  startIndex = 0,
  orderBy = "relevance"
): Promise<BookSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    max_results: String(maxResults),
    start_index: String(startIndex),
    order_by: orderBy,
  });
  try {
    return await apiFetch<BookSearchResponse>(`/api/books/search?${params}`);
  } catch (error) {
    console.error("Error in searchBooks:", error);
    return { query, total_items: 0, items: [] };
  }
}

/** Ambil detail lengkap satu buku. */
export async function getBookDetail(volumeId: string): Promise<BookDetail> {
  return apiFetch<BookDetail>(`/api/books/${volumeId}`);
}

/** Ambil semua kategori dari backend (Open Library). */
export async function getCategories(): Promise<CategoriesResponse> {
  return apiFetch<CategoriesResponse>("/api/books/categories");
}

/** Ambil buku-buku dalam satu kategori. */
export async function getBooksByCategory(
  categoryId: string,
  limit = 12,
  offset = 0,
): Promise<CategoryBooksResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  return apiFetch<CategoryBooksResponse>(`/api/books/categories/${categoryId}/books?${params}`);
}

/** Cari buku berdasarkan author tertentu. */
export async function getBooksByAuthor(
  authorName: string,
  limit = 10,
): Promise<BookSearchResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
  });
  return apiFetch<BookSearchResponse>(`/api/books/author/${encodeURIComponent(authorName)}/books?${params}`);
}

/** Ambil rekomendasi buku berdasarkan buku tertentu. */
export async function getBookRecommendations(bookId: string): Promise<BookSearchResponse> {
  return apiFetch<BookSearchResponse>(`/api/books/${bookId}/recommendations`);
}
