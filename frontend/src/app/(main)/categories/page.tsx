import Link from "next/link";
import { FALLBACK_TOP_CATEGORIES, FALLBACK_ALL_GENRES, getGradient } from "@/components/layout/categories-data";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "All Categories - Channel",
  description: "Browse all books and manga categories",
};

// Fungsi pembantu untuk memendekkan nama kategori agar muat di kotak kecil
const shortenCategoryName = (name: string): string => {
  const shortNames: Record<string, string> = {
    "Mystery and Detective Stories": "Mystery",
    "Action & Adventure": "Adventure",
    "Art & Photography": "Art",
    "Children's Books": "Children",
    "Comics & Manga": "Comics",
    "Historical Fiction": "History Fic",
    "Religion & Spirituality": "Religion",
    "Science & Tech": "Science",
    "Science Fiction": "Sci-Fi",
    "True Crime": "Crime",
    "Young Adult": "YA Fiction",
  };
  const shortName = shortNames[name] || name;
  return shortName.charAt(0).toUpperCase() + shortName.slice(1).toLowerCase();
};

export default function AllCategoriesPage() {
  const allCategories = [...FALLBACK_TOP_CATEGORIES, ...FALLBACK_ALL_GENRES];

  return (
    <div className="min-h-full bg-neutral-50/50 pb-20">
      {/* Header Kecil */}
      <div className="w-full bg-white border-b border-neutral-100 py-8 px-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-800 tracking-tight">Explore Categories</h1>
        <p className="text-neutral-500 text-sm mt-2 text-center max-w-sm">
          Find your favorite books and manga based on genre.
        </p>
      </div>

      <div className="container mx-auto max-w-5xl px-4 mt-8 md:mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {allCategories.map((cat) => {
            const displayName = shortenCategoryName(cat.name);
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className={cn(
                  "group relative aspect-square rounded-2xl flex flex-col items-center justify-center p-4 text-center overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-md border border-black/5 bg-gradient-to-br",
                  getGradient(cat.id),
                )}>
                {/* Overlay shadow tipis biar text kebaca kalau bg terang */}
                <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/5" />
                <h2 className="relative z-10 text-white font-bold text-lg md:text-xl drop-shadow-md px-2 leading-tight">
                  {displayName}
                </h2>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
