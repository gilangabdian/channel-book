"use client";

import Link from "next/link";
import Image from "next/image";
import { WantToReadButton } from "./WantToReadButton";

export interface Book {
  id: string;
  title: string;
  authors: string[];
  cover_image: string | null;
  categories: string[];
  published_date: string | null;
  type?: string;
}

export function BookCard({ book }: { book: Book }) {
  return (
    <div className="shrink-0 snap-start relative group block w-[160px] md:w-[200px]">
      <Link href={`/item/${book.type || "book"}/${book.id}`} className="block">
        {/* Cover Buku */}
        <div className="w-full aspect-[2/3] bg-neutral-100 rounded-lg overflow-hidden relative shadow-sm border border-neutral-200 transition-shadow hover:shadow-md">
          {book.cover_image ? (
            <Image
              src={book.cover_image.replace("http:", "https:")}
              alt={book.title}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 768px) 160px, 200px"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback && fallback.id === 'fallback-display') {
                  fallback.style.display = 'flex';
                }
              }}
            />
          ) : null}
          
          {/* Fallback Display */}
          <div 
            id="fallback-display"
            className="w-full h-full items-center justify-center p-4 text-center bg-[#FEFAE0] text-[#A6B37D] font-bold text-sm md:text-lg overflow-hidden"
            style={{ display: book.cover_image ? 'none' : 'flex' }}
          >
            {book.title}
          </div>

          {/* Pill Type */}
          {book.type && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-block px-2 py-0.5 bg-black/60 backdrop-blur-md text-[10px] font-bold text-white capitalize tracking-wider rounded shadow-sm">
                {book.type}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist Button (Terpisah agar tidak nested link) */}
      <div className="absolute top-2 right-2 z-20">
        <WantToReadButton itemId={book.id} itemType={(book.type as "book" | "manga") || "book"} />
      </div>

      {/* Teks di bawah cover */}
      <div className="mt-3 w-full">
        <Link href={`/item/${book.type || "book"}/${book.id}`}>
          <h3 className="font-bold text-neutral-900 text-sm md:text-base line-clamp-1 group-hover:text-[#A6B37D] transition-colors" title={book.title}>
            {book.title}
          </h3>
          <p className="text-xs md:text-sm text-neutral-500 line-clamp-1 mt-0.5">
            {book.authors?.join(", ") || "Unknown"}
          </p>
        </Link>
      </div>
    </div>
  );
}
