import { getBookDetail } from "@/features/books/api/books";
import { getMangaDetail } from "@/features/manga/api/manga";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, BookOpen, Calendar, User } from "lucide-react";
import { WantToReadButton } from "@/components/books/WantToReadButton";
import { AuthorWorks } from "@/components/item/AuthorWorks";
import { DummyComments } from "@/components/item/DummyComments";
import { CarouselRow } from "@/app/(main)/_components/CarouselRow";
import { BookCard } from "@/components/books/BookCard";

interface PageProps {
  params: Promise<{
    type: string;
    id: string;
  }>;
}

export default async function ItemDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { type, id } = resolvedParams;

  if (type !== "book" && type !== "manga") {
    notFound();
  }

  let item: any = null;
  if (type === "book") {
    item = await getBookDetail(id);
  } else if (type === "manga") {
    item = await getMangaDetail(id);
  }

  if (!item) {
    notFound();
  }

  // Common mapping to handle both BookDetail and MangaDetail structures
  const title = item.title || item.title_romaji || "Unknown Title";
  const coverImage = item.cover_image || null;
  const authors = item.authors || (item.author ? [item.author] : []);
  const rating = item.rating || (item.average_score ? item.average_score / 10 : null) || item.score || null;
  const description = item.description || item.synopsis || "No description available.";
  const publishedDate = item.published_date || item.start_date || "Unknown";
  const pageCount = item.page_count || item.chapters || null;
  const categories = item.categories || item.genres || [];

  // Fetch author works & similar items concurrently if possible, or sequential is fine here
  let authorWorks = [];
  let similarItems = [];
  
  if (authors && authors.length > 0) {
    const authorName = authors[0];
    if (type === "book") {
      const { getBooksByAuthor } = await import("@/features/books/api/books");
      const res = await getBooksByAuthor(authorName, 10);
      authorWorks = (res?.items || []).filter((w: any) => w.id !== id).map((w:any) => ({...w, type: "book"}));
    } else {
      const { getMangaByAuthor } = await import("@/features/manga/api/manga");
      const res = await getMangaByAuthor(authorName, 10);
      authorWorks = (res?.items || []).filter((w: any) => w.id !== id).map((w:any) => ({...w, type: "manga"}));
    }
  }

  if (type === "book") {
    const { getBookRecommendations } = await import("@/features/books/api/books");
    const res = await getBookRecommendations(id);
    similarItems = (res?.items || []).filter((w: any) => w.id !== id).map((w:any) => ({...w, type: "book"}));
  } else {
    const { getMangaRecommendations } = await import("@/features/manga/api/manga");
    const res = await getMangaRecommendations(id);
    similarItems = (res?.items || []).filter((w: any) => w.id !== id).map((w:any) => ({...w, type: "manga"}));
  }

  return (
    <div className="min-h-full bg-white pt-4 pb-20">
      <div className="container mx-auto max-w-5xl px-4">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* LEFT: Cover */}
          <div className="w-full max-w-[220px] mx-auto md:mx-0 shrink-0">
            <div className="sticky top-6 flex flex-col gap-4">
              <div className="aspect-[2/3] relative rounded-xl overflow-hidden shadow-lg bg-neutral-100 border border-neutral-200">
                {coverImage ? (
                  <Image
                    src={coverImage}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 220px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                    <BookOpen className="size-10 mb-2" />
                    <span className="text-xs font-medium uppercase tracking-widest">No Cover</span>
                  </div>
                )}
              </div>
              
              <WantToReadButton
                itemId={item.id || item.mal_id || id}
                itemType={type as "book" | "manga"}
                variant="solid"
              />
            </div>
          </div>

          {/* RIGHT: Info */}
          <div className="w-full md:w-2/3 lg:w-3/4 flex-1">
            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-[#A6B37D]/10 text-xs font-bold text-[#A6B37D] uppercase tracking-wider rounded-md mb-3">
                  {type}
                </span>
                
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
                  {title}
                </h1>
                
                <div className="flex items-center gap-2 mt-3 text-neutral-600">
                  <User className="size-4" />
                  <span className="font-medium text-neutral-800">
                    {authors && authors.length > 0 ? authors.join(", ") : "Unknown Author"}
                  </span>
                </div>

                {categories && categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {categories.map((c: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-default text-neutral-700 text-xs font-bold rounded-full border border-neutral-200">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-neutral-100">
                <div className="flex items-center gap-1">
                  <Star className="size-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-neutral-800">
                    {rating ? Number(rating).toFixed(1) : "N/A"}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-neutral-600 text-sm">
                  <BookOpen className="size-4" />
                  <span>{pageCount ? `${pageCount} Pages/Chapters` : "Unknown Pages/Chapters"}</span>
                </div>

                <div className="flex items-center gap-1 text-neutral-600 text-sm">
                  <Calendar className="size-4" />
                  <span>{publishedDate}</span>
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Synopsis</h3>
                <div 
                  className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Extra Sections (Full Width) */}
        <div className="mt-16 border-t border-neutral-100 pt-8">
          {/* Author Works Vertical List */}
          {authors && authors.length > 0 && authorWorks.length > 0 && (
            <AuthorWorks authorName={authors[0]} items={authorWorks} />
          )}

          {/* More Like This Carousel */}
          {similarItems.length > 0 && (
            <div className="mt-12 mb-8">
              <CarouselRow title="More Like This" href="">
                {similarItems.map((similarItem: any) => (
                  <BookCard key={similarItem.id} book={similarItem} />
                ))}
              </CarouselRow>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-12">
            <DummyComments />
          </div>
        </div>

      </div>
    </div>
  );
}
