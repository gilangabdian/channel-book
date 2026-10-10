"use client";

import { searchBooks } from "@/features/books/api/books";
import { searchManga } from "@/features/manga/api/manga";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star, User } from "lucide-react";
import { WantToReadButton } from "@/components/books/WantToReadButton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

// Custom Checkbox Component
function CustomCheckbox({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) {
  return (
    <label className="flex items-center gap-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer group">
      <div className={cn(
        "relative flex items-center justify-center w-5 h-5 rounded border transition-colors",
        checked ? "bg-[#A6B37D] border-[#A6B37D]" : "border-neutral-300 group-hover:border-[#A6B37D]"
      )}>
        {checked && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="capitalize font-medium">{label}</span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
    </label>
  );
}

const fetcher = async ([q, types, sortBy]: [string, string[], string]) => {
  if (!q) return [];
  const fetchBooksPromise = types.includes("all") || types.includes("book") 
    ? searchBooks(q, 20) : Promise.resolve({ items: [] });
  const fetchMangaPromise = types.includes("all") || types.includes("manga")
    ? searchManga(q, 20) : Promise.resolve({ items: [] });
  
  const [booksRes, mangaRes] = await Promise.all([fetchBooksPromise, fetchMangaPromise]);
  
  const formattedBooks = (booksRes?.items || []).map((b: any) => ({
    id: b.id,
    title: b.title,
    cover_image: b.cover_image,
    type: "book",
    source: b.source,
    authors: b.authors || [],
    rating: b.rating || null,
    page_count: b.page_count || null
  }));

  const formattedManga = (mangaRes?.items || []).map((m: any) => ({
    id: m.id,
    title: m.title_romaji || m.title,
    cover_image: m.cover_image,
    type: "manga",
    source: "anilist",
    authors: m.author ? [m.author] : [],
    rating: m.average_score ? m.average_score / 10 : null,
    page_count: m.chapters || null
  }));

  let results = [...formattedBooks, ...formattedManga];
  
  // Custom sorting
  if (sortBy === "newest") {
    // Basic fallback if year data exists (mock behavior since API is limited)
  } else if (sortBy === "top_rated") {
    results.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  } else {
    // relevance - keep API order
  }

  return results;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") || "";
  const typesParam = searchParams.getAll("type");
  const activeTypes = typesParam.length > 0 ? typesParam : ["all"];
  const sortBy = searchParams.get("sort") || "relevance";

  const { data: results, isValidating } = useSWR(
    query ? [query, activeTypes, sortBy] : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateIfStale: false, // Ensures no network request if data is already cached!
    }
  );

  const displayResults = results || [];

  const handleTypeToggle = (toggleType: string) => {
    let newTypes = [...activeTypes.filter(t => t !== "all")];
    if (toggleType === "all") {
      newTypes = [];
    } else {
      if (newTypes.includes(toggleType)) {
        newTypes = newTypes.filter(t => t !== toggleType);
      } else {
        newTypes.push(toggleType);
      }
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    newTypes.forEach(t => params.append("type", t));
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSortToggle = (sortType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortType);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-full bg-neutral-50 pt-4 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* LEFT: RESULTS LIST (70%) */}
          <div className={cn(
            "w-full md:w-3/4 relative transition-all duration-300",
            isValidating ? "opacity-60 blur-[2px] bg-[#A6B37D]/5 pointer-events-none rounded-xl" : "opacity-100"
          )}>
            {/* Overlay for blur effect with brand color */}
            {isValidating && (
              <div className="absolute inset-0 z-50 bg-[#A6B37D]/10 rounded-xl animate-pulse" />
            )}

            {displayResults.length > 0 ? (
              <div className="flex flex-col gap-4">
                {displayResults.map((item, idx) => (
                  <Link 
                    key={`${item.type}-${item.id}-${idx}`}
                    href={`/item/${item.type}/${item.id}`}
                    className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-neutral-100 overflow-hidden group"
                  >
                    {/* Cover */}
                    <div className="w-24 sm:w-28 md:w-32 aspect-[2/3] sm:aspect-[3/4] bg-neutral-200 relative shrink-0">
                      {item.cover_image ? (
                        <Image 
                          src={item.cover_image} 
                          alt={item.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <BookOpen className="size-8" />
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 p-4 flex flex-col relative">
                      <div className="absolute top-4 right-4 z-10">
                        <WantToReadButton
                          itemId={item.id}
                          itemType={item.type as "book" | "manga"}
                        />
                      </div>
                      
                      <div className="pr-10">
                        <span className="inline-block px-2 py-1 bg-[#A6B37D]/10 text-[10px] font-bold text-[#A6B37D] uppercase tracking-wider rounded-md mb-2">
                          {item.type}
                        </span>
                        
                        <h2 className="text-base md:text-lg font-bold text-neutral-900 group-hover:text-[#A6B37D] transition-colors line-clamp-2">
                          {item.title}
                        </h2>
                        
                        <div className="flex items-center gap-1.5 mt-1.5 text-neutral-600 text-xs md:text-sm">
                          <User className="size-3.5" />
                          <span className="line-clamp-1">{item.authors && item.authors.length > 0 ? item.authors.join(", ") : "Unknown"}</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-3 flex items-center gap-4 text-xs md:text-sm text-neutral-500">
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-neutral-700">{Number(item.rating).toFixed(1)}</span>
                          </div>
                        )}
                        {item.page_count && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="size-4" />
                            <span>{item.page_count} Pages/Ch</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-12 text-center flex flex-col items-center justify-center">
                <BookOpen className="size-12 text-neutral-300 mb-4" />
                <h3 className="text-xl font-bold text-neutral-900 mb-2">No results found</h3>
                <p className="text-neutral-500 max-w-md">
                  {query 
                    ? "We couldn't find any books or manga matching your search. Try using different keywords." 
                    : "Enter a search term to find books and manga."}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: FILTERS SIDEBAR (30%) */}
          <div className="w-full md:w-1/4 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 sticky top-6">
              <h3 className="font-bold text-neutral-900 mb-4">Filters</h3>
              
              <div className="space-y-6">
                {/* Type Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">Type</h4>
                  <div className="space-y-3">
                    {["all", "book", "manga"].map((type) => {
                      const isActive = activeTypes.includes(type) || (type === "all" && activeTypes.includes("all"));
                      return (
                        <CustomCheckbox 
                          key={type}
                          label={type}
                          checked={isActive}
                          onChange={() => handleTypeToggle(type)}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Sorted By Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">Sorted By</h4>
                  <div className="space-y-3">
                    {[
                      { id: "relevance", label: "Relevance" },
                      { id: "newest", label: "Newest" },
                      { id: "top_rated", label: "Top Rated" }
                    ].map((sortOption) => (
                      <CustomCheckbox 
                        key={sortOption.id}
                        label={sortOption.label}
                        checked={sortBy === sortOption.id}
                        onChange={() => handleSortToggle(sortOption.id)}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-neutral-500">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
