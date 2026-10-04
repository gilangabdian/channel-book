"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FALLBACK_TOP_CATEGORIES, FALLBACK_ALL_GENRES, getGradient } from "./categories-data";
import { getCategories } from "@/features/books/api/books";
import { cn } from "@/lib/utils";

interface CategoryItem {
  id: string;
  name: string;
}

// Top category IDs (untuk memisahkan card besar vs list kecil)
const TOP_IDS = new Set(FALLBACK_TOP_CATEGORIES.map((c) => c.id));

export function CategoriesDesktop() {
  const [open, setOpen] = useState(false);
  const [topCategories, setTopCategories] = useState<CategoryItem[]>(FALLBACK_TOP_CATEGORIES);
  const [allGenres, setAllGenres] = useState<CategoryItem[]>(FALLBACK_ALL_GENRES);

  useEffect(() => {
    getCategories()
      .then((res) => {
        const top = res.categories.filter((c) => TOP_IDS.has(c.id));
        const genres = res.categories.filter((c) => !TOP_IDS.has(c.id));
        if (top.length > 0) setTopCategories(top.map((c) => ({ id: c.id, name: c.name.toUpperCase() })));
        if (genres.length > 0) setAllGenres(genres.map((c) => ({ id: c.id, name: c.name })));
      })
      .catch(() => {
        // Fallback: keep static data silently
      });
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center gap-1 text-base font-semibold hover:text-[#A6B37D] transition-colors text-neutral-600 data-[state=open]:text-[#A6B37D] data-[state=open]:opacity-100">
        Categories
        <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
      </PopoverTrigger>
      <PopoverContent
        className="w-[800px] p-6 mt-2 rounded-xl shadow-2xl border border-white/50 bg-transparent bg-gradient-to-b from-[#f4f6ef] from-65% to-[#f4f6ef]/50 backdrop-blur-md"
        align="start">
        <div className="space-y-6">
          {/* Top Categories Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 drop-shadow-sm">
              Top Categories
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {topCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className={cn(
                    "relative h-24 rounded-md flex items-center justify-center overflow-hidden group hover:scale-[1.02] transition-transform bg-gradient-to-b",
                    getGradient(cat.id),
                  )}
                  onClick={() => setOpen(false)}>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  <span className="relative bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-neutral-800 tracking-wider shadow-sm rounded-sm">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* All Genres List */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 drop-shadow-sm">
              All Genres & Themes
            </h3>
            <div className="grid grid-cols-4 gap-y-3 gap-x-4">
              {allGenres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/categories/${genre.id}`}
                  className="text-sm font-medium text-slate-600 hover:text-black hover:scale-[1.02] transition-all"
                  onClick={() => setOpen(false)}>
                  {genre.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
