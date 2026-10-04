import Link from "next/link";
import { searchBooks } from "@/features/books/api/books";
import Image from "next/image";
import { HeroShowcase } from "./_components/HeroShowcase";
import { CarouselRow } from "./_components/CarouselRow";
import { WantToReadButton } from "@/components/books/WantToReadButton";
import { getPublicCollections, Collection } from "@/features/collections/api/collections";
import { CollectionCard } from "@/components/collections/CollectionCard";

import { getPopularManga } from "@/features/manga/api/manga";

// Tipe untuk menampung buku dari API
interface Book {
  id: string;
  title: string;
  authors: string[];
  cover_image: string | null;
  categories: string[];
  published_date: string | null;
  type?: string; // untuk membedakan buku dan manga (opsional)
}

export default async function Home() {
  // Fetch data dari backend (error handling basic agar tidak crash jika backend mati)
  let trendingBooks: Book[] = [];
  let newReleases: Book[] = [];
  let publicCollections: Collection[] = [];
  let popularMangas: Book[] = [];

  try {
    const [trendingRes, newRes, collectionsRes, mangaRes] = await Promise.all([
      searchBooks("fiction", 10),
      searchBooks("fantasy", 10),
      getPublicCollections(10), // Fetch 10 collections
      getPopularManga(10), // Fetch 10 popular mangas
    ]);

    trendingBooks = trendingRes.items || [];
    newReleases = newRes.items || [];
    publicCollections = collectionsRes || [];
    popularMangas = mangaRes.items || [];

    // TAMPILKAN DUMMY DATA SEMENTARA JIKA KOSONG
    if (publicCollections.length === 0) {
      publicCollections = Array.from({ length: 10 }).map((_, i) => ({
        id: `dummy-${i}`,
        title: `Collection #${i + 1}: ${trendingBooks[i % trendingBooks.length]?.title || "Awesome Books"}`,
        description: "A specially curated list of books for you to discover.",
        cover_url:
          i === 0
            ? "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800"
            : null,
        user_id: `user-${i}`,
        is_public: true,
        books: [...trendingBooks.slice(i, i + 2), ...newReleases.slice(i, i + 2)].map((b) => ({
          book_id: b.id,
          title: b.title,
          cover_url: b.cover_image,
        })),
      }));
    }
  } catch (error) {
    console.error("Failed to fetch books for homepage:", error);
  }

  // Ambil 5 buku pertama dari trending untuk Hero Showcase
  const showcaseBooks = trendingBooks.slice(0, 5);
  // Sisa buku untuk baris Trending
  const remainingTrending = trendingBooks.slice(5);

  return (
    <div className="flex flex-col flex-1 pb-16 overflow-x-hidden pt-6 px-4 md:px-8 lg:px-12">
      {/* 1. DISCOVERY HERO SHOWCASE */}
      <HeroShowcase books={showcaseBooks} />

      <div className="space-y-12">
        {/* 2. NEW RELEASES (Horizontal Scroll with < > buttons) */}
        <CarouselRow title="New Releases" href="/explore/new-releases">
          {remainingTrending.length > 0
            ? remainingTrending.map((book) => <BookCard key={book.id} book={book} />)
            : // Skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[160px] md:w-[200px] h-[240px] md:h-[300px] bg-neutral-200 animate-pulse rounded-lg snap-start"
                />
              ))}
        </CarouselRow>

        {/* 3. COMMUNITY PICKS (Horizontal Scroll with < > buttons) */}
        <CarouselRow title="Community Picks" href="/explore/community-picks">
          {newReleases.length > 0
            ? newReleases.map((book) => <BookCard key={book.id} book={book} />)
            : Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[160px] md:w-[200px] h-[240px] md:h-[300px] bg-neutral-200 animate-pulse rounded-lg snap-start"
                />
              ))}
        </CarouselRow>
        
        {/* RECENT ACTIVITY DUMMY */}
        <CarouselRow title="Inspired by your recent activity" href="/explore/recent">
          {newReleases.length > 0
            ? newReleases.map((book) => <BookCard key={book.id} book={book} />)
            : Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[160px] md:w-[200px] h-[240px] md:h-[300px] bg-neutral-200 animate-pulse rounded-lg snap-start"
                />
              ))}
        </CarouselRow>
        
        {/* POPULAR MANGA */}
        <CarouselRow title="Popular Manga" href="/explore/manga">
          {popularMangas.length > 0
            ? popularMangas.map((manga) => <BookCard key={manga.id} book={manga} />)
            : Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[160px] md:w-[200px] h-[240px] md:h-[300px] bg-neutral-200 animate-pulse rounded-lg snap-start"
                />
              ))}
        </CarouselRow>

        {/* 4. PUBLIC COLLECTIONS */}
        <div className="pt-4 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900">Discover Public Collections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {publicCollections.length > 0 ? (
              publicCollections.map((collection) => <CollectionCard key={collection.id} collection={collection} />)
            ) : (
              <div className="w-full py-12 text-center col-span-full">
                <p className="text-neutral-500 font-medium">No public collections found yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Komponen Card Buku Minimalis
 */
function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/books/${book.id}`} className="shrink-0 snap-start relative block group">
      {/* Cover Buku */}
      <div className="w-[160px] md:w-[200px] aspect-[2/3] bg-neutral-100 rounded-lg overflow-hidden relative shadow-sm border border-neutral-200 transition-shadow hover:shadow-md">
        {book.cover_image ? (
          <Image
            src={book.cover_image.replace("http:", "https:")}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 160px, 200px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4 text-center bg-[#FEFAE0] text-[#A6B37D] font-bold text-lg">
            {book.title}
          </div>
        )}

        {/* Wishlist Button (Client Component) */}
        <WantToReadButton itemId={book.id} itemType="book" />
      </div>

      {/* Teks di bawah cover */}
      <div className="mt-3 max-w-[160px] md:max-w-[200px]">
        <h3 className="font-bold text-neutral-900 text-sm md:text-base line-clamp-1 group-hover:text-[#A6B37D] transition-colors">
          {book.title}
        </h3>
        <p className="text-xs md:text-sm text-neutral-500 line-clamp-1 mt-0.5">
          {book.authors?.join(", ") || "Unknown"}
        </p>
      </div>
    </Link>
  );
}
