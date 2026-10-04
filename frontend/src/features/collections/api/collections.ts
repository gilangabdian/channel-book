import { createClient } from "@/lib/supabase/server";

export interface CollectionBook {
  book_id: string;
  title: string;
  cover_url: string | null;
}

export interface Collection {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  user_id: string;
  is_public: boolean;
  books: CollectionBook[]; // We'll map the relations here
}

/**
 * Fetch public collections to display on the Home page.
 * Uses a random ordering in Supabase if supported, or just order by created_at.
 */
export async function getPublicCollections(limit: number = 10): Promise<Collection[]> {
  const supabase = await createClient();

  // Supabase doesn't support 'ORDER BY random()' directly via PostgREST 
  // without a custom RPC, so we will order by created_at descending for now.
  // In a real production app, an RPC like `get_random_collections` would be better.
  const { data, error } = await supabase
    .from("collections")
    .select(`
      id,
      title,
      description,
      cover_url,
      user_id,
      is_public,
      collection_books (
        book_id,
        title,
        cover_url
      )
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching collections:", error);
    return [];
  }

  // Transform the response to match the interface
  return (data || []).map((col: Record<string, unknown>) => ({
    id: col.id as string,
    title: col.title as string,
    description: col.description as string | null,
    cover_url: col.cover_url as string | null,
    user_id: col.user_id as string,
    is_public: col.is_public as boolean,
    books: (col.collection_books as CollectionBook[]) || [],
  }));
}
