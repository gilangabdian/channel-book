"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { TOP_CATEGORIES, ALL_GENRES } from "./categories-data";
import { cn } from "@/lib/utils";

export function CategoriesDesktop() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center gap-1 text-base font-semibold hover:text-[#A6B37D] transition-colors text-gray-600 data-[state=open]:text-[#A6B37D] data-[state=open]:opacity-100">
        Categories
        <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
      </PopoverTrigger>
      <PopoverContent
        className="w-[800px] p-6 mt-2 rounded-xl shadow-2xl border border-white/50 bg-transparent bg-gradient-to-b from-[#f4f6ef] from-45% to-[#f4f6ef]/0 backdrop-blur-md"
        align="start">
        <div className="space-y-6">
          {/* Top Categories Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 drop-shadow-sm">
              Top Categories
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {TOP_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className={cn(
                    "relative h-24 rounded-md flex items-center justify-center overflow-hidden group hover:scale-[1.02] transition-transform bg-gradient-to-b",
                    cat.gradient,
                  )}
                  onClick={() => setOpen(false)}>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  <span className="relative bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-gray-800 tracking-wider shadow-sm rounded-sm">
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
              {ALL_GENRES.map((genre) => (
                <Link
                  key={genre}
                  href={`/categories/${genre.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium text-slate-600 hover:text-black hover:scale-[1.02] transition-all"
                  onClick={() => setOpen(false)}>
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
