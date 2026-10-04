# Rencana Perbaikan Search & Filter

Berikut adalah analisis dan rencana eksekusi untuk 2 kendala yang saat ini terjadi di aplikasi Anda:

## 1. Jikan API Rate Limit (Error 502)
- **Akar Masalah**: Jikan API hanya memperbolehkan maksimal 3 request per detik. Fitur *live search* dari *SearchBar* membuat banyak request secara cepat, sehingga IP server/backend kita terkena *Rate Limit* (HTTP 429), yang pada akhirnya membuat *frontend* menerima HTTP 502.
- **Rencana Solusi Backend**:
  - Tidak perlu merubah arsitektur (*frontend* tetap menembak ke *backend* kita, bukan `jikanjs`).
  - Kita akan memasang library **`tenacity`** di backend Python kita.
  - Kita akan menambahkan *decorator* *retry* dengan **Exponential Backoff** pada fungsi `httpx.get` di `jikan_service.py`.
  - **Mekanisme**: Jika mendapat status 429, *backend* akan menunggu 1 detik, coba lagi. Jika masih gagal, tunggu 2 detik, lalu coba lagi hingga maksimal 3 kali percobaan sebelum akhirnya benar-benar melempar error.
  - **Kepastian (Apakah pasti work?)**: **Ya, ini dipastikan berhasil.** Ini adalah standar industri (best practice) dalam menghadapi layanan pihak ketiga (3rd party API) yang memiliki *Rate Limit*. API Google Books juga sebenarnya memiliki batasan, jadi *retry* ini membuat server kita sangat tahan banting.

## 2. Checkbox Filter Ngelag
- **Akar Masalah**: Di halaman `/search`, filter (Book / Manga) saat ini dibungkus menggunakan komponen `<Link>` bawaan Next.js dan halaman tersebut adalah *Server Component*. Saat Anda mengklik *checkbox*, Anda sebenarnya memicu navigasi halaman baru. Server Next.js akan memproses *request* Jikan dan Google API di belakang layar sebelum mengirimkan tampilan baru. Karena tidak ada *Loading State* (seperti skeleton), halaman akan tampak diam/hang/ngelag selama beberapa detik padahal sebenarnya ia sedang memuat data dari internet.
- **Rencana Solusi Frontend**:
  - **Opsi A (Paling Mudah & Disarankan)**: Membuat file `loading.tsx` khusus untuk *route* `/search`. Dengan ini, begitu Anda klik filter, halaman akan langsung bereaksi dengan menampilkan animasi "sedang memuat (skeleton)", jadi tidak terasa nge-lag sama sekali.
  - **Opsi B (Client Component)**: Mengubah komponen filter di sebelah kanan menjadi *Client Component* yang menggunakan `useTransition` dan `useRouter().push()`. Ini membuat UI *checkbox* langsung tercentang, sementara data dimuat ulang.
- **Kesimpulan Eksekusi**: Saya akan menerapkan **Opsi A** (membuat animasi skeleton cantik) lalu memodifikasi opsi filter agar merespons interaksi dengan lebih halus.

## Langkah Eksekusi (Tunggu Instruksi Anda)
1. Install `tenacity` di backend dan implementasi *retry logic* di `jikan_service.py`.
2. Buat file `loading.tsx` di `frontend/src/app/(main)/search/loading.tsx`.
3. (Opsional) Mengurangi frekuensi tembakan API saat Anda mengetik dengan memperpanjang *debounce delay* di `SearchBar.tsx` dari 500ms menjadi 800ms atau 1000ms.
