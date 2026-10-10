"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { searchBooks } from "@/features/books/api/books";
import { getPopularManga } from "@/features/manga/api/manga";
import { BookGridWithPagination } from "@/components/books/BookGridWithPagination";

interface PageProps {
  params: Promise<{ section: string }>;
}

const fetcher = async ([section, page]: [string, number]) => {
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    switch (section) {
      case "new-releases": {
        const currentYear = new Date().getFullYear().toString();
        const res = await searchBooks(currentYear, limit, offset, "newest");
        return res.items || [];
      }
      case "popular-manga": {
        const res = await getPopularManga(limit, page);
        return res.items || [];
      }
      case "community-picks": {
        const res = await searchBooks("fantasy", limit, offset, "relevance");
        return res.items || [];
      }
      case "recent-activity": {
        // Dummy data for now until we have actual personalization backend
        const res = await searchBooks("sci-fi", limit, offset, "relevance");
        return res.items || [];
      }
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error fetching data for section ${section}:`, error);
    return [];
  }
};

export default function ExplorePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const section = resolvedParams.section;
  
  // Format section string "new-releases" -> "New Releases"
  const displayTitle = section
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [page, setPage] = useState(1);

  const { data: results, isLoading, isValidating } = useSWR(
    section ? [section, page] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const displayResults = results || [];

  const hasNextPage = displayResults.length === 20;

  return (
    <div className="min-h-full bg-white pb-20 pt-8">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        {/* Simple Left Aligned Header */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight mb-8">
          {displayTitle}
        </h1>

        <BookGridWithPagination
          items={displayResults}
          isLoading={isLoading}
          isValidating={isValidating}
          page={page}
          setPage={setPage}
          hasNextPage={hasNextPage}
          emptyMessage="We couldn't find anything for this section."
        />
      </div>
    </div>
  );
}
