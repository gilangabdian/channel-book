import { searchBooks } from "@/features/books/api/books";
import { HeroShowcase } from "./_components/HeroShowcase";
import { CarouselRow } from "./_components/CarouselRow";
import { BookCard, Book } from "@/components/books/BookCard";
import { getPublicCollections, Collection } from "@/features/collections/api/collections";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { createClient } from "@/lib/supabase/server";

import { getPopularManga } from "@/features/manga/api/manga";


export default async function Home() {
  // Fetch data dari backend (error handling basic agar tidak crash jika backend mati)
  let trendingBooks: Book[] = [];
  let newReleases: Book[] = [];
  let publicCollections: Collection[] = [];
  let popularMangas: Book[] = [];
  let communityPicks: Book[] = [];
  let recentActivity: Book[] = [];

  let isLoggedIn = false;
  let user = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    isLoggedIn = !!user;
  } catch (err) {
    console.error("Auth check failed on home:", err);
  }

  const currentYear = new Date().getFullYear().toString();

  try {
    const promises = [
      searchBooks("fiction", 16, 0, "relevance"), // 5 for hero + 11 for others? Wait, we can fetch separately
      searchBooks(currentYear, 16, 0, "newest"), // New Releases
      getPublicCollections(10), // Fetch 10 collections
      getPopularManga(16), // Fetch 16 popular mangas
      searchBooks("fantasy", 16, 0, "relevance"), // Community Picks
    ];

    if (isLoggedIn) {
      promises.push(searchBooks("sci-fi", 16, 0, "relevance")); // Recent activity (replace with actual recommendation later)
    }

    const results = await Promise.all(promises);

    const trendingRes = results[0];
    const newRes = results[1];
    const collectionsRes = results[2] as Collection[];
    const mangaRes = results[3];
    const communityRes = results[4];
    const recentRes = isLoggedIn ? results[5] : null;

    trendingBooks = trendingRes?.items || [];
    newReleases = newRes?.items || [];
    publicCollections = collectionsRes || [];
    popularMangas = mangaRes?.items || [];
    communityPicks = communityRes?.items || [];
    recentActivity = recentRes?.items || [];

    // TAMPILKAN DUMMY DATA JIKA GOOGLE BOOKS API LIMIT
    const createDummyBooks = (prefix: string) => Array.from({ length: 12 }).map((_, i) => ({
      id: `dummy-${prefix}-${i}`,
      title: `${prefix} Book ${i + 1}`,
      authors: ["Unknown Author"],
      cover_image: `https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300`,
      categories: ["Fiction"],
      published_date: "2023",
      source: "google" as const,
    }));

    if (trendingBooks.length === 0) trendingBooks = createDummyBooks("Trending");
    if (newReleases.length === 0) newReleases = createDummyBooks("New Release");
    if (communityPicks.length === 0) communityPicks = createDummyBooks("Community Pick");
    if (recentActivity.length === 0) recentActivity = createDummyBooks("Recent");

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

  return (
    <div className="flex flex-col flex-1 pb-16 overflow-x-hidden pt-6 px-4 md:px-8 lg:px-12">
      {/* 1. DISCOVERY HERO SHOWCASE */}
      <HeroShowcase books={showcaseBooks} />

      <div className="space-y-12">
        <CarouselRow title="New Releases" href="/explore/new-releases">
          {newReleases.length > 0
            ? newReleases.map((book) => <BookCard key={book.id} book={book} />)
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
          {communityPicks.length > 0
            ? communityPicks.map((book) => <BookCard key={book.id} book={book} />)
            : Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[160px] md:w-[200px] h-[240px] md:h-[300px] bg-neutral-200 animate-pulse rounded-lg snap-start"
                />
              ))}
        </CarouselRow>
        
        {/* RECENT ACTIVITY */}
        {isLoggedIn && (
          <CarouselRow 
            title="Inspired by your recent activity" 
            href={recentActivity.length > 10 ? "/explore/recent-activity" : undefined}
          >
            {recentActivity.length > 0
              ? recentActivity.map((book) => <BookCard key={book.id} book={book} />)
              : Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-[160px] md:w-[200px] h-[240px] md:h-[300px] bg-neutral-200 animate-pulse rounded-lg snap-start"
                  />
                ))}
          </CarouselRow>
        )}
        
        {/* POPULAR MANGA */}
        <CarouselRow title="Popular Manga" href="/explore/popular-manga">
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


