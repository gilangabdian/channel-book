"use client";

import { Search, X, Clock, BookmarkPlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDebounce } from "@/hooks/use-debounce";
import { searchBooks } from "@/features/books/api/books";
import { searchManga } from "@/features/manga/api/manga";

type SearchResult = {
  id: string;
  title: string;
  cover_url: string | null;
  type: "book" | "manga";
  authors?: string[];
  source?: string;
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Live search states
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 800);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  // Save to localStorage whenever recentSearches changes
  useEffect(() => {
    localStorage.setItem("recent_searches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Click outside to close popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setShowConfirmClear(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Perform live search when debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const [booksRes, mangaRes] = await Promise.all([
          searchBooks(debouncedQuery, 5), // fetch top 5 books
          searchManga(debouncedQuery, 5), // fetch top 5 manga
        ]);

        const formattedBooks: SearchResult[] = booksRes.items.map((b: any) => ({
          id: b.id,
          title: b.title,
          cover_url: b.cover_image,
          authors: b.authors || [],
          type: "book",
          source: b.source,
        }));

        const formattedManga: SearchResult[] = mangaRes.items.map((m: any) => ({
          id: m.id,
          title: m.title,
          cover_url: m.cover_image,
          authors: m.authors || [],
          type: "manga",
        }));

        // Interleave or combine them
        setResults([...formattedBooks, ...formattedManga]);
      } catch (error) {
        console.error("Error during live search:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const saveSearch = (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== cleanTerm.toLowerCase());
      return [cleanTerm, ...filtered].slice(0, 15); // Max 15 items
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveSearch(query);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsFocused(false);
    }
  };

  const handleRecentSearchClick = (term: string) => {
    setQuery(term);
    saveSearch(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setIsFocused(false);
  };

  const removeRecentSearch = (e: React.MouseEvent, termToRemove: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((term) => term !== termToRemove));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    setShowConfirmClear(false);
  };

  const handleResultClick = (item: SearchResult) => {
    saveSearch(item.title);
    router.push(`/item/${item.type}/${item.id}`);
    setIsFocused(false);
  };

  const handleWantToRead = (e: React.MouseEvent, item: SearchResult) => {
    e.stopPropagation();
    // TODO: implement logic to insert into want_to_read table
    console.log("Add to want to read:", item.title);
  };

  const showRecent = !query.trim() && recentSearches.length > 0;
  const showLiveSearch = query.trim().length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full group">
      <form onSubmit={handleSearch} className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className={`size-4 transition-colors ${isFocused ? "text-[#A6B37D]" : "text-neutral-400"}`} />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-full pl-10 pr-10 py-2 outline-none focus:bg-white focus:border-[#A6B37D] focus:ring-2 focus:ring-[#A6B37D]/20 transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              // Optional: Keep focus on input after clearing
              const input = document.querySelector("input[type='text']") as HTMLInputElement;
              if (input) input.focus();
            }}
            className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      {/* RECENT SEARCHES & LIVE SEARCH POPUP */}
      {isFocused && (showRecent || showLiveSearch) && (
        <div className="absolute top-full mt-2 w-full bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Section: RECENT SEARCHES */}
          {showRecent && (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Recent Searches</h4>
                <button
                  type="button"
                  onClick={() => setShowConfirmClear(true)}
                  className="text-xs text-neutral-400 hover:text-red-500 transition-colors font-medium">
                  Clear All
                </button>
              </div>

              {showConfirmClear && (
                <div className="bg-red-50 p-3 border-b border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top-2">
                  <span className="text-sm text-red-800 font-medium">Are you sure?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={clearAllRecent}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md transition-colors">
                      Yes, clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmClear(false)}
                      className="px-3 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-md transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <ul className="max-h-64 overflow-y-auto py-2">
                {recentSearches.map((term, index) => (
                  <li key={index} className="group/item">
                    <button
                      type="button"
                      onClick={() => handleRecentSearchClick(term)}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-neutral-50 transition-colors text-left">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Clock className="size-4 text-neutral-400 shrink-0" />
                        <span className="text-sm text-neutral-700 truncate">{term}</span>
                      </div>
                      <div
                        onClick={(e) => removeRecentSearch(e, term)}
                        className="p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 shrink-0 cursor-pointer">
                        <X className="size-4" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Section: LIVE SEARCH RESULTS */}
          {showLiveSearch && (
            <div className="max-h-[400px] overflow-y-auto">


              {isSearching ? (
                <ul className="py-2">
                  {[...Array(5)].map((_, i) => (
                    <li key={i} className="w-full flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-14 bg-neutral-200 animate-pulse rounded shrink-0" />
                      <div className="flex-1 flex flex-col gap-2.5">
                        <div className="h-3.5 bg-neutral-200 animate-pulse rounded w-3/4" />
                        <div className="h-2.5 bg-neutral-200 animate-pulse rounded w-1/3" />
                      </div>
                      <div className="size-8 bg-neutral-100 animate-pulse rounded-full shrink-0" />
                    </li>
                  ))}
                </ul>
              ) : results.length > 0 ? (
                <ul className="py-2">
                  {results.map((item, idx) => (
                    <li key={`${item.type}-${item.id}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => handleResultClick(item)}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 transition-colors text-left group/result">
                        <div className="w-10 h-14 bg-neutral-200 rounded shrink-0 overflow-hidden relative">
                          {item.cover_url ? (
                            <Image src={item.cover_url} alt={item.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400">
                              <Search className="size-4" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col">
                          <span className="text-sm font-medium text-neutral-800 truncate">{item.title}</span>
                          <span className="text-[11px] font-medium text-neutral-500 flex items-center gap-1.5">
                            <span className="capitalize">{item.type}</span>
                            <span className="text-[8px]">•</span>
                            <span className="truncate">{item.authors && item.authors.length > 0 ? item.authors.join(", ") : "Unknown"}</span>
                          </span>
                        </div>

                        <div
                          onClick={(e) => handleWantToRead(e, item)}
                          className="p-2 text-neutral-400 hover:text-[#A6B37D] hover:bg-[#A6B37D]/10 rounded-full transition-colors shrink-0"
                          title="Want to Read">
                          <BookmarkPlus className="size-5" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 flex items-center justify-center text-neutral-500 text-sm">
                  No results found for &quot;{query}&quot;
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
