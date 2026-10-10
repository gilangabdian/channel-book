"use client";

import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import { cn } from "@/lib/utils";

interface BookGridWithPaginationProps {
  items: any[];
  isLoading: boolean;
  isValidating: boolean;
  page: number;
  setPage: (page: number | ((p: number) => number)) => void;
  hasNextPage: boolean;
  emptyMessage?: string;
}

export function BookGridWithPagination({
  items,
  isLoading,
  isValidating,
  page,
  setPage,
  hasNextPage,
  emptyMessage = "No items found."
}: BookGridWithPaginationProps) {

  // Loading State for initial fetch (page 1 only)
  // This prevents the grid from unmounting during pagination!
  if (isLoading && page === 1 && items.length === 0) {
    return (
      <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-[160px] md:w-[200px] aspect-[2/3] bg-neutral-200 animate-pulse rounded-lg shadow-sm"
          />
        ))}
      </div>
    );
  }

  // Empty State (no results)
  if (!isLoading && items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-8 md:p-12 text-center flex flex-col items-center justify-center w-full max-w-2xl mt-8 mx-auto">
        <BookOpen className="size-12 text-neutral-300 mb-4" />
        <h3 className="text-xl font-bold text-neutral-900 mb-2">No items found</h3>
        <p className="text-neutral-500 max-w-md text-sm md:text-base">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center md:items-start">
      <div className={cn(
        "flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 transition-opacity duration-300 w-full",
        isValidating ? "opacity-60 pointer-events-none" : "opacity-100"
      )}>
        {items.map((item, idx) => (
          <BookCard key={`${item.type || "book"}-${item.id}-${idx}`} book={item} />
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-3 mt-12 mb-8 w-full">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || isValidating}
          className="flex items-center gap-1 px-3 py-1.5 rounded border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm bg-white"
        >
          <ChevronLeft className="size-4" /> Previous
        </button>
        
        <div className="flex items-center gap-1.5 text-sm font-bold text-neutral-600">
          {page > 2 && <span className="px-2 text-neutral-400 hidden sm:inline">...</span>}
          {page > 1 && (
            <button onClick={() => setPage(page - 1)} className="w-8 h-8 flex items-center justify-center rounded border border-transparent hover:border-neutral-200 hover:bg-neutral-50 transition-colors">
              {page - 1}
            </button>
          )}
          <span className="w-8 h-8 flex items-center justify-center rounded bg-[#A6B37D] text-white shadow-sm">
            {page}
          </span>
          {hasNextPage && (
            <>
              <button onClick={() => setPage(page + 1)} className="w-8 h-8 flex items-center justify-center rounded border border-transparent hover:border-neutral-200 hover:bg-neutral-50 transition-colors">
                {page + 1}
              </button>
              <span className="px-2 text-neutral-400 hidden sm:inline">...</span>
            </>
          )}
        </div>
        
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={isValidating || !hasNextPage}
          className="flex items-center gap-1 px-3 py-1.5 rounded border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm bg-white"
        >
          Next <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
