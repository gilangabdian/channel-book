"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star, ChevronDown, ChevronUp } from "lucide-react";

type WorkItem = {
  id: string;
  title: string;
  cover_image: string | null;
  rating?: number | null;
  type: "book" | "manga";
};

type AuthorWorksProps = {
  authorName: string;
  items: WorkItem[];
};

export function AuthorWorks({ authorName, items }: AuthorWorksProps) {
  const [expanded, setExpanded] = useState(false);

  if (!items || items.length === 0) return null;

  const displayItems = expanded ? items : items.slice(0, 3);
  const hasMore = items.length > 3;

  return (
    <div className="w-full mt-12 mb-8">
      <h3 className="text-xl font-bold text-neutral-800 mb-6">
        More by <span className="text-[#A6B37D]">{authorName}</span>
      </h3>
      
      <div className="flex flex-col gap-4">
        {displayItems.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={`/item/${item.type}/${item.id}`}
            className="group flex gap-4 p-3 rounded-2xl border border-neutral-100 hover:border-[#A6B37D]/30 hover:bg-[#A6B37D]/5 transition-all"
          >
            {/* Cover */}
            <div className="w-16 h-24 sm:w-20 sm:h-28 bg-neutral-100 rounded-lg overflow-hidden shrink-0 relative shadow-sm">
              {item.cover_image ? (
                <Image
                  src={item.cover_image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <BookOpen className="size-6" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-[#A6B37D] transition-colors truncate">
                {item.title}
              </h4>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-500 capitalize tracking-wider mt-1 mb-2">
                {item.type}
              </span>
              
              <div className="flex items-center gap-1.5 mt-auto">
                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold text-neutral-700">
                  {item.rating ? Number(item.rating).toFixed(1) : "N/A"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-[#A6B37D] transition-colors self-start"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="size-4" />
            </>
          ) : (
            <>
              See All ({items.length}) <ChevronDown className="size-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
