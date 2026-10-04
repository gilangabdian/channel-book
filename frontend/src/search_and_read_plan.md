# Rencana Implementasi: Live Search & Want to Read 🚀

Berdasarkan tiga poin permintaanmu, berikut adalah analisis dan rencana eksekusinya:

### 1. Menghapus Redundansi AI di Search Bar
**Analisis**: Betul sekali, sangat redundant! *Search Bar* di *Navbar* seharusnya difokuskan 100% untuk mencari entitas (Katalog Buku, Manga, Author), sedangkan interaksi/konsultasi *Natural Language* diserahkan sepenuhnya ke *AI Floating Widget* di pojok kanan bawah. Memisahkan kedua hal ini akan membuat UX jauh lebih jelas dan tidak membingungkan *user*.
**Eksekusi**:
- Menghapus ikon Sparkles (✨) dari `SearchBar.tsx`.
- Mengubah *placeholder* dari `"Search books, manga, or ask AI..."` menjadi `"Search"`.

### 2. Live Search dengan Debounce (Bouncing Technique) di Search Bar
**Analisis**: Ini adalah *best practice* sejati. *User* tidak perlu menekan "Enter", melainkan cukup mengetik dan hasil pencarian akan langsung muncul di *pop-up*. Untuk mencegah *spam* *request* ke *backend* tiap kali *user* mengetik 1 huruf, kita gunakan teknik **Debounce** (memberi jeda sekitar 500ms setelah *user* berhenti mengetik baru me-lempar *request*).
**Eksekusi**:
- Membuat *custom hook* `useDebounce` di *frontend*.
- Merombak `SearchBar.tsx`:
  - Jika input kosong -> Tampilkan UI *Recent Searches* (seperti yang sudah ada).
  - Jika input diisi -> Tampilkan UI *Live Search* dengan status *Loading* (Spinner/Skeleton).
  - Jika hasil didapat -> Tampilkan daftar *item* (Buku/Manga) bersusun ke bawah.
  - Di tiap baris hasil pencarian, kita sediakan informasi (Cover, Judul, Tipe) dan sebuah tombol/ikon **"Want to read"**.

### 3. Hapus Fitur Wishlist & Ganti Menjadi "Want to Read" [DONE]
**Analisis**: Di platform literatur (seperti Goodreads atau MyAnimeList), konsep *"Wishlist"* (Keranjang Belanja) memang kurang cocok. Konsep *"Want to read"* (Daftar Ingin Dibaca) jauh lebih relevan secara *domain*.
**Eksekusi (Selesai)**:
- **SQL Database**: Tabel `favorites` lama sudah diganti namanya menjadi `want_to_read`. File migrasinya sudah dibuat di `migration_want_to_read.sql` dan `skema.sql` utama juga sudah di-update agar mencerminkan skema final ini.
- **Frontend UI**:
  - Menghapus komponen `WishlistButton.tsx`.
  - Mengganti aksi *hover* di dalam komponen `BookCard` (yang ada di Home) menjadi *icon* **Want to Read** (misalnya ikon pita/bookmark atau buku dengan tanda plus 📖+).
  - Mengimplementasikan fungsionalitas agar tombol tersebut langsung tersimpan ke *database*.

---

### 4. Hapus Tombol "My Book" di Navbar
**Analisis**: Tombol "My Book" (atau My Library) mungkin sudah tidak relevan dengan flow saat ini, atau dirasa membingungkan karena *user* sudah punya menu *Profile* dan *Collections* sendiri.
**Eksekusi**:
- Hapus komponen `MyLibraryButton.tsx` (jika ada) dan bersihkan pemanggilannya dari `Navbar.tsx` / `DesktopNav.tsx`.
- Hapus *logic* terkait *routing* atau *state* dari "My Book".

### 5. Sesuaikan Lebar Search Bar (Responsif)
**Analisis**: Saat ini *Search Bar* di layar *laptop* atau *tablet* mungkin terlalu panjang/lebar ke kanan (melebar secara penuh) sehingga proporsinya kurang indah.
**Eksekusi**:
- Membatasi `max-w` (maximum width) dari *Search Bar* di `Navbar.tsx`. Misalnya membatasinya menjadi `max-w-md` atau `max-w-lg` di *viewport* medium/large, agar ukurannya terkesan *compact* dan seimbang dengan ruang kosong di kiri-kanannya.

---

Apakah kamu setuju dengan rencana (terutama poin ke-3 untuk nama tabel database-nya: mau spesifik `want_to_read` saja tanpa kolom status (seperti *reading, completed, plan_to_read*)?) Balas agar kita bisa langsung eksekusi!
