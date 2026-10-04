-- File Migrasi: Mengganti tabel favorites (Wishlist) menjadi want_to_read

-- 1. Hapus tabel favorites yang lama (beserta semua policy yang terikat)
DROP TABLE IF EXISTS public.favorites CASCADE;

-- 2. Buat tabel want_to_read baru
CREATE TABLE IF NOT EXISTS public.want_to_read (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id text NOT NULL, -- ID dari Google Books atau API Manga
    item_type text DEFAULT 'book' CHECK (item_type IN ('book', 'manga')),
    title text NOT NULL,
    cover_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, item_id, item_type) -- Mencegah duplikasi item yang sama
);

-- 3. Aktifkan RLS
ALTER TABLE public.want_to_read ENABLE ROW LEVEL SECURITY;

-- 4. Buat Policy RLS
CREATE POLICY "Semua orang bisa melihat want_to_read" ON public.want_to_read FOR SELECT USING (true);
CREATE POLICY "User bisa menambah want_to_read sendiri" ON public.want_to_read FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User bisa menghapus want_to_read sendiri" ON public.want_to_read FOR DELETE USING (auth.uid() = user_id);
