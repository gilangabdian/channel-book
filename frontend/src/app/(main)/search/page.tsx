import { searchBooks } from "@/features/books/api/books";
import { searchManga } from "@/features/manga/api/manga";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star, User, BookmarkPlus } from "lucide-react";
import { WantToReadButton } from "@/components/books/WantToReadButton";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: string | string[]; // allow multiple types
  }>;
}

export default async function SearchResultsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || "";
  
  let activeTypes: string[] = [];
  if (Array.isArray(params.type)) {
    activeTypes = params.type;
  } else if (params.type) {
    activeTypes = [params.type];
  } else {
    activeTypes = ["all"]; // default if no type is specified
  }

  let results: any[] = [];
  
  if (query) {
    const fetchBooks = activeTypes.includes("all") || activeTypes.includes("book");
    const fetchManga = activeTypes.includes("all") || activeTypes.includes("manga");

    const [booksRes, mangaRes] = await Promise.all([
      fetchBooks ? searchBooks(query, 20) : Promise.resolve({ items: [] }),
      fetchManga ? searchManga(query, 20) : Promise.resolve({ items: [] })
    ]);

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

    results = [...formattedBooks, ...formattedManga];
  }

  const getFilterUrl = (toggleType: string) => {
    if (toggleType === "all") return `/search?q=${encodeURIComponent(query)}`;
    
    let newTypes = [...activeTypes.filter(t => t !== "all")];
    if (newTypes.includes(toggleType)) {
      newTypes = newTypes.filter(t => t !== toggleType);
    } else {
      newTypes.push(toggleType);
    }
    
    // If empty, return to all
    if (newTypes.length === 0) {
      return `/search?q=${encodeURIComponent(query)}`;
    }
    
    const qs = newTypes.map(t => `type=${t}`).join('&');
    return `/search?q=${encodeURIComponent(query)}&${qs}`;
  };

  return (
    <div className="min-h-full bg-neutral-50 pt-4 pb-16">
      <div className="container mx-auto max-w-6xl px-4">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* LEFT: RESULTS LIST (70%) */}
          <div className="w-full md:w-3/4">
            {results.length > 0 ? (
              <div className="flex flex-col gap-4">
                {results.map((item, idx) => (
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
                        <span className="inline-block px-2 py-1 bg-neutral-100 text-[10px] font-bold text-neutral-600 uppercase tracking-wider rounded-md mb-2">
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
                  We couldn&apos;t find any books or manga matching your search. Try using different keywords.
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
                        <Link 
                          key={type} 
                          href={getFilterUrl(type)}
                          className="flex items-center gap-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          <input 
                            type="checkbox" 
                            checked={isActive}
                            readOnly
                            className="size-4 rounded border-neutral-300 text-[#A6B37D] focus:ring-[#A6B37D] cursor-pointer"
                          />
                          <span className="capitalize">{type}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Additional filters can go here (Language, Author, etc.) */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">Language (Coming Soon)</h4>
                  <div className="space-y-3 opacity-50 pointer-events-none">
                    <label className="flex items-center gap-3 text-sm text-neutral-600">
                      <input type="checkbox" className="size-4 rounded border-neutral-300 text-[#A6B37D]" />
                      Indonesian (id)
                    </label>
                    <label className="flex items-center gap-3 text-sm text-neutral-600">
                      <input type="checkbox" className="size-4 rounded border-neutral-300 text-[#A6B37D]" />
                      English (en)
                    </label>
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
