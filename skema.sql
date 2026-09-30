-- ==========================================
-- 1. UPDATE TABEL PROFILES
-- ==========================================
-- Menambahkan kolom foto profil. Jika null, frontend akan render huruf inisial.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- ==========================================
-- 2. CREATE TABEL FAVORITES (Buku yang disukai)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.favorites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id text NOT NULL,
    title text NOT NULL,
    cover_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- ==========================================
-- 3. CREATE TABEL REVIEWS (Rating 1-5 & Komentar)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id text NOT NULL,
    title text NOT NULL,
    cover_url text,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
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
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Policy untuk Favorites (Semua bisa lihat, tapi hanya pemilik yang bisa tambah/hapus)
CREATE POLICY "Semua orang bisa melihat favorites" ON public.favorites FOR SELECT USING (true);
CREATE POLICY "User bisa menambah favorites sendiri" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User bisa menghapus favorites sendiri" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

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
