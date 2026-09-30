"use client";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FALLBACK_TOP_CATEGORIES, getGradient } from "./categories-data";
import { getCategories } from "@/features/books/api/books";
import { cn } from "@/lib/utils";

interface CategoryItem {
  id: string;
  name: string;
}

const TOP_IDS = new Set(FALLBACK_TOP_CATEGORIES.map((c) => c.id));

export function CategoriesMobile({ closeSheet }: { closeSheet: () => void }) {
  const [open, setOpen] = useState(false);
  const [topCategories, setTopCategories] = useState<CategoryItem[]>(
    FALLBACK_TOP_CATEGORIES.map((c) => ({ ...c, name: c.name.toUpperCase() })),
  );

  useEffect(() => {
    getCategories()
      .then((res) => {
        const top = res.categories.filter((c) => TOP_IDS.has(c.id));
        if (top.length > 0) setTopCategories(top.map((c) => ({ id: c.id, name: c.name.toUpperCase() })));
      })
      .catch(() => {
        // Fallback: keep static data silently
      });
  }, []);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between py-3 text-lg font-medium text-neutral-800 hover:text-[#A6B37D] transition-colors w-full">
        Categories
        <ChevronDown className={cn("size-5 transition-transform duration-200 text-neutral-400", open && "rotate-180")} />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
        )}>
        <div className="overflow-hidden pb-4">
          {/* Inset gradient card */}
          <div className="bg-gradient-to-b from-[#f4f6ef] from-45% to-[#f4f6ef]/0 rounded-2xl border border-[#A6B37D]/20 pt-4 pb-3">
            {/* Horizontal scroll container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {topCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className={cn(
                    "snap-center shrink-0 w-[140px] h-20 rounded-lg flex items-center justify-center bg-gradient-to-b relative overflow-hidden shadow-sm",
                    getGradient(cat.id),
                  )}
                  onClick={() => {
                    setOpen(false);
                    closeSheet();
                  }}>
                  <span className="relative bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold text-neutral-800 tracking-wider shadow-sm rounded-sm">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>

            <Link
              href="/categories"
              className="block text-sm font-bold text-slate-800 hover:text-black transition-colors px-4 mt-2"
              onClick={closeSheet}>
              View all categories &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
