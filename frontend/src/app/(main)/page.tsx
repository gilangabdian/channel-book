import Link from "next/link";
import { searchBooks } from "@/features/books/api/books";
import Image from "next/image";
import { HeroShowcase } from "./_components/HeroShowcase";
import { CarouselRow } from "./_components/CarouselRow";
import { WishlistButton } from "@/components/books/WishlistButton";

// Tipe untuk menampung buku dari API
interface Book {
  id: string;
  title: string;
  authors: string[];
  cover_image: string | null;
  categories: string[];
  published_date: string | null;
}

export default async function Home() {
  // Fetch data dari backend (error handling basic agar tidak crash jika backend mati)
  let trendingBooks: Book[] = [];
  let newReleases: Book[] = [];

  try {
    const [trendingRes, newRes] = await Promise.all([searchBooks("fiction", 10), searchBooks("fantasy", 10)]);

    trendingBooks = trendingRes.items || [];
    newReleases = newRes.items || [];
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
        <CarouselRow title="Most Popular" href="/explore/community-picks">
          {newReleases.length > 0
            ? newReleases.map((book) => <BookCard key={book.id} book={book} />)
            : Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[160px] md:w-[200px] h-[240px] md:h-[300px] bg-neutral-200 animate-pulse rounded-lg snap-start"
                />
              ))}
        </CarouselRow>
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
          <div className="w-full h-full flex items-center justify-center p-4 text-center bg-[#FEFAE0] text-[#A6B37D] font-serif font-bold text-lg">
            {book.title}
          </div>
        )}
        
        {/* Wishlist Button (Client Component) */}
        <WishlistButton bookId={book.id} />
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
