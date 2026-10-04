"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Book, Library, ChevronLeft, ChevronRight } from "lucide-react";
import { Collection } from "@/features/collections/api/collections";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  collection: Collection;
  className?: string;
}

// Generate a pseudo-random pastel color based on the collection ID
const getBgColor = (id: string) => {
  const colors = [
    "bg-red-50 hover:bg-red-100",
    "bg-blue-50 hover:bg-blue-100",
    "bg-green-50 hover:bg-green-100",
    "bg-yellow-50 hover:bg-yellow-100",
    "bg-purple-50 hover:bg-purple-100",
    "bg-pink-50 hover:bg-pink-100",
    "bg-indigo-50 hover:bg-indigo-100",
    "bg-orange-50 hover:bg-orange-100",
    "bg-teal-50 hover:bg-teal-100",
    "bg-cyan-50 hover:bg-cyan-100",
  ];
  const charCodeSum = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const bgColorClass = getBgColor(collection.id);
  const books = collection.books || [];
  
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? books.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === books.length - 1 ? 0 : prev + 1));
  };

  const hasBooks = books.length > 0;
  const activeBook = hasBooks ? books[activeIndex] : null;

  return (
    <Link 
      href={`/collections/${collection.id}`} 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300",
        "border border-neutral-100 shadow-sm",
        !collection.cover_url && bgColorClass,
        className
      )}
    >
      {/* FULL CARD CUSTOM BACKGROUND */}
      {collection.cover_url && (
        <>
          <Image 
            src={collection.cover_url.replace("http:", "https:")}
            alt="Collection Custom Cover"
            fill
            className="object-cover absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </>
      )}

      {/* Visual Area (Top Half) */}
      <div className="relative aspect-square md:aspect-[4/3] w-full flex items-center justify-center p-6 overflow-hidden z-10">
        <div className="relative z-10 w-full h-full max-w-[200px] max-h-[280px] drop-shadow-xl transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
          {activeBook && activeBook.cover_url ? (
            <Image 
              src={activeBook.cover_url.replace("http:", "https:")} 
              alt={activeBook.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#A6B37D]">
              <Library className={cn("size-16", collection.cover_url ? "text-white/80" : "text-neutral-400")} />
            </div>
          )}
        </div>

        {/* Carousel Navigation (Arrows) */}
        {hasBooks && books.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-20">
            <button 
              onClick={handlePrev}
              className="pointer-events-auto p-1.5 md:p-2 bg-white/80 hover:bg-white text-neutral-800 rounded-full shadow backdrop-blur-sm transition-all duration-200 lg:opacity-0 lg:translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0"
              aria-label="Previous book"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button 
              onClick={handleNext}
              className="pointer-events-auto p-1.5 md:p-2 bg-white/80 hover:bg-white text-neutral-800 rounded-full shadow backdrop-blur-sm transition-all duration-200 lg:opacity-0 lg:-translate-x-4 lg:group-hover:opacity-100 lg:group-hover:translate-x-0"
              aria-label="Next book"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>

      {/* Info Area (Bottom Half) */}
      <div className={cn(
        "flex flex-col p-5 pt-4 flex-1 justify-end relative z-10",
        collection.cover_url ? "bg-transparent text-white" : "bg-gradient-to-t from-white/40 to-transparent"
      )}>
        <h3 className={cn(
          "text-lg font-bold line-clamp-1 mb-1",
          collection.cover_url ? "text-white" : "text-neutral-900"
        )}>{collection.title}</h3>
        
        <div className={cn(
          "flex items-center text-sm font-normal mt-1",
          collection.cover_url ? "text-white/80" : "text-neutral-500"
        )}>
          <span>Collection</span>
          <span className="mx-2">•</span>
          <span>{collection.user_id}</span>
        </div>
      </div>
    </Link>
  );
}
