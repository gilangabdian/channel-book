"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { getBooksByCategory } from "@/features/books/api/books";
import { getMangaByCategory } from "@/features/manga/api/manga";
import { cn } from "@/lib/utils";
import { getGradient, FALLBACK_TOP_CATEGORIES, FALLBACK_ALL_GENRES } from "@/components/layout/categories-data";
import { BookGridWithPagination } from "@/components/books/BookGridWithPagination";

interface PageProps {
  params: Promise<{ name: string }>;
}

const getMangaGenre = (olCategory: string): string | null => {
  const map: Record<string, string | null> = {
    'fiction': 'Fantasy', 
    'non-fiction': null,
    'fantasy': 'Fantasy',
    'mystery_and_detective_stories': 'Mystery',
    'romance': 'Romance',
    'self-help': null,
    'adventure': 'Adventure',
    'art': 'Slice of Life',
    'biography': 'Drama',
    'business': null,
    'children': 'Comedy',
    'comics': 'Action',
    'cooking': null,
    'graphic_novels': 'Action',
    'historical_fiction': 'Drama',
    'history': 'Drama',
    'horror': 'Horror',
    'humor': 'Comedy',
    'poetry': 'Slice of Life',
    'religion': 'Psychological',
    'science': 'Sci-Fi',
    'science_fiction': 'Sci-Fi',
    'sports': 'Sports',
    'thriller': 'Thriller',
    'travel': 'Adventure',
    'true_crime': 'Mystery',
    'young_adult_fiction': 'Romance'
  };
  // Return mapping if exists, else fallback to null so it doesn't fetch irrelevant manga
  return map[olCategory.toLowerCase()] !== undefined ? map[olCategory.toLowerCase()] : null;
}

const fetcher = async ([categoryName, page]: [string, number]) => {
  const mangaGenre = getMangaGenre(categoryName);
  
  // Calculate offset for books (limit 12) and page for manga (limit 12) -> total 24 per page
  const booksLimit = 12;
  const mangaLimit = 12;
  const booksOffset = (page - 1) * booksLimit;

  // Fetch books (always)
  const booksPromise = getBooksByCategory(categoryName, booksLimit, booksOffset);
  
  // Fetch manga (only if genre mapped)
  const mangaPromise = mangaGenre 
    ? getMangaByCategory(mangaGenre, mangaLimit, page).catch(() => ({ items: [] }))
    : Promise.resolve({ items: [] });

  const [booksRes, mangaRes] = await Promise.all([booksPromise, mangaPromise]);

  const formattedBooks = (booksRes?.items || []).map((b: any) => ({
    id: b.id,
    title: b.title,
    cover_image: b.cover_image,
    type: "book",
    source: b.source,
    authors: b.authors || [],
    rating: b.rating || null,
    categories: b.categories || [],
    published_date: b.published_date || null
  }));

  const formattedManga = (mangaRes?.items || []).map((m: any) => ({
    id: String(m.id), // Ensure ID is string for Link
    title: m.title,
    cover_image: m.cover_image,
    type: m.type || "manga",
    source: m.source || "anilist",
    authors: m.authors || [],
    rating: m.rating || null,
    categories: m.categories || [],
    published_date: m.published_date || null
  }));

  // Simple mix (interleave them)
  const results = [];
  const maxLength = Math.max(formattedBooks.length, formattedManga.length);
  for (let i = 0; i < maxLength; i++) {
    if (formattedBooks[i]) results.push(formattedBooks[i]);
    if (formattedManga[i]) results.push(formattedManga[i]);
  }
  return results;
};

export default function CategoryPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const categoryName = decodeURIComponent(resolvedParams.name);
  
  // Find real display title if it's in our known lists
  const allKnownCategories = [...FALLBACK_TOP_CATEGORIES, ...FALLBACK_ALL_GENRES];
  const knownCat = allKnownCategories.find(c => c.id === categoryName);
  const displayTitle = knownCat ? knownCat.name.toUpperCase() : categoryName.replace(/_/g, ' ').toUpperCase();

  const [page, setPage] = useState(1);

  const { data: results, isLoading, isValidating } = useSWR(
    categoryName ? [categoryName, page] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const displayResults = results || [];

  return (
    <div className="min-h-full bg-white pb-20">
      {/* Header Banner */}
      <div className={cn(
        "w-full h-40 md:h-56 relative flex items-center justify-center overflow-hidden bg-gradient-to-b",
        getGradient(categoryName)
      )}>
        <div className="absolute inset-0 bg-black/5" />
        <h1 className="relative text-3xl md:text-5xl font-extrabold text-neutral-800 tracking-wider bg-white/70 px-8 py-3 rounded-md shadow-sm backdrop-blur-md text-center mx-4">
          {displayTitle}
        </h1>
      </div>



      <div className="container mx-auto max-w-7xl px-4 mt-8 md:mt-12 flex flex-col items-center">
        <BookGridWithPagination
          items={displayResults}
          isLoading={isLoading}
          isValidating={isValidating}
          page={page}
          setPage={setPage}
          hasNextPage={displayResults.length >= 24} // Based on the old heuristic `displayResults.length < 24`
          emptyMessage="We couldn't find any books or manga for this category on this page."
        />
      </div>
    </div>
  );
}
