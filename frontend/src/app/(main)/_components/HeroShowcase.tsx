"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarouselRow } from "./CarouselRow";
import { WantToReadButton } from "@/components/books/WantToReadButton";

interface Book {
  id: string;
  title: string;
  authors: string[];
  cover_image: string | null;
  categories: string[];
  published_date: string | null;
  description?: string | null;
}

interface HeroShowcaseProps {
  books: Book[];
}

export function HeroShowcase({ books }: HeroShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-play timer
  useEffect(() => {
    if (!books || books.length === 0) return;

    const DURATION = 8000; // 8 seconds
    const INTERVAL = 50; // update every 50ms
    const step = (INTERVAL / DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => prev + step);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [books, activeIndex]); // Restart timer saat activeIndex berubah manual

  // Progress watcher: Pindah slide ketika progress penuh
  useEffect(() => {
    if (progress >= 100) {
      setActiveIndex((current) => (current + 1) % (books?.length || 1));
      setProgress(0);
    }
  }, [progress, books]);

  if (!books || books.length === 0) {
    return <div className="h-64 bg-neutral-100 flex items-center justify-center animate-pulse" />;
  }

  const activeBook = books[activeIndex];
  const mockRating = ((activeBook.id.length % 3) + 3.1).toFixed(1);

  const handleManualClick = (index: number) => {
    setActiveIndex(index);
    setProgress(0); // Reset timer
  };

  return (
    <>
      {/* --- DESKTOP VIEW (Split Layout) --- */}
      <div className="hidden md:flex w-full h-[500px] lg:h-[600px] bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm relative mb-12">
        {/* Sisi Kiri: Area List (Thumbnail Buku-buku kecil) - 35% */}
        <div className="w-[35%] lg:w-[30%] bg-white flex flex-col h-full border-r border-neutral-200 z-10 shrink-0">
          <div className="p-6 pb-2 shrink-0 border-b border-neutral-100">
            <h2 className="text-neutral-900 font-bold text-xl tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#A6B37D] rounded-full inline-block"></span>
              Recommendations
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-2">
            {books.map((book, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={book.id}
                  onClick={() => handleManualClick(idx)}
                  className={cn(
                    "w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all relative overflow-hidden group border border-transparent",
                    isActive ? "bg-neutral-50 border-neutral-200 shadow-sm" : "hover:bg-neutral-50",
                  )}>
                  {/* Progress bar background indicator for active item */}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-[#A6B37D] transition-all ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  {/* Thumbnail */}
                  <div className="w-12 h-16 bg-neutral-100 shrink-0 rounded overflow-hidden relative border border-neutral-200">
                    {book.cover_image ? (
                      <Image
                        src={book.cover_image.replace("http:", "https:")}
                        alt={book.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-[#A6B37D] bg-[#FEFAE0] p-1 text-center">
                        {book.title}
                      </div>
                    )}
                  </div>

                  {/* Title & Author */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h3
                      className={cn(
                        "font-bold text-sm line-clamp-1 transition-colors",
                        isActive ? "text-[#A6B37D]" : "text-neutral-900 group-hover:text-[#A6B37D]",
                      )}>
                      {book.title}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                      {book.authors?.join(", ") || "Unknown"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sisi Kanan: Area Detail Besar (Hero) - 65% */}
        <div className="flex-1 relative bg-white overflow-hidden flex flex-col p-10 lg:p-16 z-0 justify-center">
          {/* Watermark Background (Ide B) */}
          {activeBook.cover_image && (
            <div
              key={`watermark-${activeBook.id}`}
              className="absolute -right-24 -bottom-32 w-[500px] lg:w-[600px] h-[750px] lg:h-[900px] opacity-[0.1] grayscale pointer-events-none rotate-12 transition-all duration-[2000ms] ease-out animate-in fade-in">
              <Image
                src={activeBook.cover_image.replace("http:", "https:")}
                alt="Watermark"
                fill
                className="object-cover mix-blend-multiply"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div
            key={`content-${activeBook.id}`}
            className="relative z-10 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center gap-3">
                {activeBook.categories?.[0] && (
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-600 border border-neutral-200 text-xs font-bold uppercase tracking-wider rounded-full">
                    {activeBook.categories[0]}
                  </span>
                )}
                <div className="flex items-center text-yellow-500 text-sm font-bold">
                  <Star className="size-4 fill-current mr-1" />
                  {mockRating}
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-neutral-900 line-clamp-3">
                {activeBook.title}
              </h1>

              <p className="text-xl text-neutral-500 font-medium italic">
                by {activeBook.authors?.join(", ") || "Unknown Author"}
              </p>

              <p className="text-base text-neutral-600 line-clamp-4 leading-relaxed mt-4">
                {activeBook.description ||
                  `${activeBook.title} is an excellent choice for readers who enjoy ${activeBook.categories?.[0] || "great stories"}. Dive into the world crafted by ${activeBook.authors?.[0] || "the author"}. Discover the complete synopsis and add it to your reading list.`}
              </p>

              <div className="pt-6">
                <Link
                  href={`/books/${activeBook.id}`}
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-[#A6B37D] text-white font-bold rounded-lg hover:bg-[#8f9b6b] transition-colors shadow-sm">
                  Want to Read
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE VIEW (Simple Swipable Cards) --- */}
      <div className="md:hidden mb-8">
        <CarouselRow title="Recommendations">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="shrink-0 snap-start relative block group">
              <div className="w-[160px] aspect-[2/3] bg-neutral-100 rounded-lg overflow-hidden relative shadow-sm border border-neutral-200 transition-shadow hover:shadow-md">
                {book.cover_image ? (
                  <Image
                    src={book.cover_image.replace("http:", "https:")}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 text-center bg-[#FEFAE0] text-[#A6B37D] font-bold text-lg">
                    {book.title}
                  </div>
                )}

                {/* Wishlist Button (Client Component) */}
                <WantToReadButton itemId={book.id} itemType="book" />
              </div>
              <div className="mt-3 max-w-[160px]">
                <h3 className="font-bold text-neutral-900 text-sm line-clamp-1 group-hover:text-[#A6B37D] transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{book.authors?.join(", ") || "Unknown"}</p>
              </div>
            </Link>
          ))}
        </CarouselRow>
      </div>
    </>
  );
}
