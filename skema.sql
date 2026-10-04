-- ==========================================
-- 1. UPDATE TABEL PROFILES
-- ==========================================
-- Menambahkan kolom foto profil. Jika null, frontend akan render huruf inisial.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- ==========================================
-- 2. CREATE TABEL WANT_TO_READ (Daftar Ingin Dibaca)
-- ==========================================
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

-- ==========================================
-- 3. CREATE TABEL REVIEWS (Rating 1-5 & Komentar)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id text NOT NULL, -- ID dari Google Books atau API Manga
    item_type text DEFAULT 'book' CHECK (item_type IN ('book', 'manga')),
    title text NOT NULL,
    cover_url text,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, item_id, item_type) -- User hanya bisa review 1 kali per item
);

-- ==========================================
-- 4. CREATE TABEL FOLLOWS (Koneksi Sosial)
-- ==========================================
-- Digunakan untuk mengikuti User lain atau mengikuti Author Google Books
CREATE TABLE IF NOT EXISTS public.follows (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type text CHECK (target_type IN ('user', 'author')),
    target_user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_author_name text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 5. AKTIFKAN ROW LEVEL SECURITY (RLS) - WAJIB!
-- ==========================================
-- Supaya user lain tidak bisa menghapus/mengubah data milik user lain secara acak.
ALTER TABLE public.want_to_read ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Policy untuk want_to_read (Semua bisa lihat, tapi hanya pemilik yang bisa tambah/hapus)
CREATE POLICY "Semua orang bisa melihat want_to_read" ON public.want_to_read FOR SELECT USING (true);
CREATE POLICY "User bisa menambah want_to_read sendiri" ON public.want_to_read FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User bisa menghapus want_to_read sendiri" ON public.want_to_read FOR DELETE USING (auth.uid() = user_id);

-- Policy untuk Reviews (Semua bisa lihat, tapi hanya penulisnya yang bisa edit/hapus)
CREATE POLICY "Semua orang bisa membaca reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "User bisa menulis reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User bisa mengedit reviews miliknya" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "User bisa menghapus reviews miliknya" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Policy untuk Follows (Semua bisa lihat siapa follow siapa)
CREATE POLICY "Semua orang bisa melihat follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "User bisa follow/unfollow" ON public.follows FOR ALL USING (auth.uid() = follower_id);

-- ==========================================
-- 6. CREATE TABEL NOTIFICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Penerima notifikasi
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,

    -- Siapa yang memicu notif (bisa null jika ini adalah notifikasi dari sistem)
    actor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,

    -- Jenis notifikasi agar mudah difilter
    type text NOT NULL CHECK (type IN ('follow', 'like', 'review', 'system')),

    -- Isi pesan notifikasinya
    message text NOT NULL,

    -- Status apakah sudah dibaca atau belum
    is_read boolean DEFAULT false,

    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- AKTIFKAN ROW LEVEL SECURITY (RLS) UNTUK NOTIFICATIONS
-- ==========================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy 1: User HANYA bisa melihat notifikasi yang ditujukan untuk dirinya sendiri
CREATE POLICY "User bisa melihat notifikasinya sendiri"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: User bisa menandai notifikasinya sudah dibaca (update is_read)
CREATE POLICY "User bisa mengupdate notifikasinya sendiri"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Policy 3: User bisa menghapus notifikasinya sendiri
CREATE POLICY "User bisa menghapus notifikasinya sendiri"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

-- Catatan: Policy INSERT tidak diberikan kepada public/client.
-- Penambahan notifikasi nantinya akan dilakukan oleh fungsi internal (Server Actions / Database Triggers)
-- untuk alasan keamanan agar user tidak sembarangan mengirim spam notifikasi ke orang lain.

-- ==========================================
-- 7. CREATE TABEL COLLECTIONS (Playlist Buku)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.collections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    cover_url text, -- Bisa dikasih custom foto
    is_public boolean DEFAULT true, -- Default-nya langsung public
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 8. CREATE TABEL COLLECTION_ITEMS (Buku/Manga di dalam koleksi)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.collection_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
    item_id text NOT NULL,
    item_type text DEFAULT 'book' CHECK (item_type IN ('book', 'manga')),
    title text NOT NULL,
    cover_url text,
    added_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(collection_id, item_id, item_type) -- Mencegah item yang sama ditambahkan 2x di satu koleksi
);

-- ==========================================
-- AKTIFKAN ROW LEVEL SECURITY (RLS) UNTUK COLLECTIONS
-- ==========================================
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

-- Policy untuk Collections
-- 1. Semua orang bisa melihat koleksi yang is_public = true, ATAU koleksi miliknya sendiri
CREATE POLICY "Public bisa lihat public collections, owner bisa lihat private" 
ON public.collections FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);

-- 2. User hanya bisa membuat koleksinya sendiri
CREATE POLICY "User bisa membuat koleksinya sendiri" 
ON public.collections FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. User hanya bisa mengupdate koleksinya sendiri
CREATE POLICY "User bisa mengupdate koleksinya sendiri" 
ON public.collections FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. User hanya bisa menghapus koleksinya sendiri
CREATE POLICY "User bisa menghapus koleksinya sendiri" 
ON public.collections FOR DELETE 
USING (auth.uid() = user_id);


-- Policy untuk Collection Items
-- 1. Semua orang bisa melihat isi item DARI koleksi yang public, ATAU koleksi miliknya sendiri
CREATE POLICY "Public bisa lihat item di public collections, owner lihat semua" 
ON public.collection_items FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.collections c 
        WHERE c.id = collection_items.collection_id 
        AND (c.is_public = true OR c.user_id = auth.uid())
    )
);

-- 2. User hanya bisa menambah/hapus item ke dalam koleksinya sendiri
CREATE POLICY "User bisa modifikasi item di koleksinya sendiri" 
ON public.collection_items FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.collections c 
        WHERE c.id = collection_items.collection_id 
        AND c.user_id = auth.uid()
    )
);
