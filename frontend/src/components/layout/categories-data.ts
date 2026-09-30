/**
 * Data kategori buku.
 * 
 * Saat ini menyimpan data gradien statis (untuk styling card).
 * Data kategori (nama, id) nantinya di-fetch dari backend,
 * tetapi gradien warna tetap di-define di sini karena itu urusan UI.
 */

/** Mapping warna gradien per kategori ID (untuk card besar). */
export const CATEGORY_GRADIENTS: Record<string, string> = {
  "fiction": "from-blue-300 to-white",
  "non-fiction": "from-amber-300 to-white",
  "fantasy": "from-purple-300 to-white",
  "mystery_and_detective_stories": "from-slate-400 to-white",
  "romance": "from-rose-300 to-white",
  "self-help": "from-[#A6B37D] to-white",
};

/** Fallback data kategori utama (jika API belum tersedia). */
export const FALLBACK_TOP_CATEGORIES = [
  { id: "fiction", name: "FICTION" },
  { id: "non-fiction", name: "NON-FICTION" },
  { id: "fantasy", name: "FANTASY" },
  { id: "mystery_and_detective_stories", name: "MYSTERY" },
  { id: "romance", name: "ROMANCE" },
  { id: "self-help", name: "SELF-HELP" },
];

/** Fallback data genre (jika API belum tersedia). */
export const FALLBACK_ALL_GENRES = [
  { id: "adventure", name: "Action & Adventure" },
  { id: "art", name: "Art & Photography" },
  { id: "biography", name: "Biography" },
  { id: "business", name: "Business" },
  { id: "children", name: "Children's Books" },
  { id: "comics", name: "Comics & Manga" },
  { id: "cooking", name: "Cookbooks" },
  { id: "graphic_novels", name: "Graphic Novels" },
  { id: "historical_fiction", name: "Historical Fiction" },
  { id: "history", name: "History" },
  { id: "horror", name: "Horror" },
  { id: "humor", name: "Humor" },
  { id: "poetry", name: "Poetry" },
  { id: "religion", name: "Religion & Spirituality" },
  { id: "science", name: "Science & Tech" },
  { id: "science_fiction", name: "Science Fiction" },
  { id: "sports", name: "Sports" },
  { id: "thriller", name: "Thriller" },
  { id: "travel", name: "Travel" },
  { id: "true_crime", name: "True Crime" },
  { id: "young_adult_fiction", name: "Young Adult" },
];

/** Helper: ambil gradient untuk kategori tertentu, atau random gradient. */
const RANDOM_GRADIENTS = [
  "from-teal-300 to-white",
  "from-indigo-300 to-white",
  "from-orange-300 to-white",
  "from-cyan-300 to-white",
  "from-pink-300 to-white",
  "from-lime-300 to-white",
];

export function getGradient(categoryId: string): string {
  if (CATEGORY_GRADIENTS[categoryId]) {
    return CATEGORY_GRADIENTS[categoryId];
  }
  // Stable random: hash the id to always get the same gradient for the same category
  let hash = 0;
  for (let i = 0; i < categoryId.length; i++) {
    hash = categoryId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return RANDOM_GRADIENTS[Math.abs(hash) % RANDOM_GRADIENTS.length];
}
