---
trigger: always_on
---

projek bernama 'channel', projek ini adalah projek dimana user bisa melakukan CRUD buku
(bisa tambah, mengedit, melihat buku2 yang diambil dari api gratisan, misal google book API,
selain itu user juga bisa membuat collection yang judul collectionnya terserah user, dan user bisa
juga menambahkan buku-buku yang ada itu menjadi wishlist), user bisa menanyakan dengan AI
mengenai buku atau konsultasi buku sesuai keadaannya.

kemudian AI juga bisa dikirimi img / upload files yang mana dia bisa digunakan untuk memberi
rekomendasi buku bacaan serupa yang sesuai di upload user tadi.

AI akan selalu mengingat percakapan user kecuali user menghapus pesan dengan AI itu.
Ketika pertama kali melakukan percakapan dengan AI, user harus memilih 2 maskot AI
(narra atau syra), kedua maskot memiliki tingkah laku respon yang bertolak belakang.
Begitu pula jika user menghapus riwayat pesan maka user harus memilih maskot lagi.

Maskot narra: dia buku fiksi bewarna #A6B37D dengan kacamata dan tongkat, berambut agak panjang
tapi masih di atas mata panjang rambutnya. dia lebih santai, kalem, asik untuk segala usia,
suka becanda absurd, dan kaya akan kosa kata fiksi.

Maskot syra: dia buku non-fiksi bewarna #B99470 dengan rambut dikucir dan memakai kalung.
dia formal, tegang, professional, tidak bisa bercanda(susah), kaya akan kosa kata non-fiksi.

User perlu register dulu trus login and then dia akan masuk ke appnya, nanti di dalamnya udah
ada nih daftar2 buku nya dalam bentuk list seperti e commerce gitu.

fokus ke app web pwa.

main color web ini yaitu ini #A6B37D dan secondary colornya ini #FEFAE0

---

sementara fitur2nya itu dulu, aku rencana mau pake frontend nextjs dan backend python (faskapi)
dan database supabase.

kemudian ini adalah tahapan-tahapan yang akan aku lakukan:

Langkah 1: Eksperimen Backend (Python & AI) - Buktikan AI-nya bisa jalan!
Jangan sentuh Next.js atau CSS dulu. Fokus ke script Python sederhana (bisa di Jupyter Notebook
atau file .py biasa) untuk memastikan ide AI Anda benar-benar bisa bekerja.

Target:

Buat script Python yang bisa memanggil Gemini API / Groq API.

Buat prompt untuk kedua maskot dan lihat apakah AI menjawab sesuai karakter.

Coba kirim gambar lewat API dan minta rekomendasi buku, pastikan responnya bagus.

(Opsional tapi penting) Coba ekstrak teks dari 1 file PDF buku dan buat AI menjawab berdasarkan
teks tersebut (RAG dasar).

Kenapa ini pertama? Kalau ternyata fitur AI-nya macet, terlalu mahal, atau hasilnya jelek,
Anda bisa segera mengubah strategi tanpa pusing memikirkan UI yang terlanjur dibuat.

Langkah 2: Setup Database & Auth (Supabase) - Jembatannya
Setelah Anda yakin AI-nya berfungsi dengan baik di script terminal, mulailah mengatur pondasi
datanya.

Target:

Buat project di Supabase.

Nyalakan fitur Authentication (Login dengan Email/Google).

Buat tabel dasar (tabel users, chats, messages, wishlist, custom_lists).

Siapkan Supabase Storage untuk menampung upload gambar dari user.

Langkah 3: Bangun UI Dasar (Frontend Next.js) - Bentuk Wujudnya
Sekarang waktunya ngoding visualnya. Karena database dan auth sudah ada di Supabase (yang sangat
mudah disambungkan ke Next.js), Anda bisa mulai membangun kerangka aplikasinya.

Target:

Setup Next.js dengan Tailwind CSS (masukkan tema #A6B37D Anda).

Buat halaman Login/Register (langsung sambungkan ke Supabase).

Buat layout utama: Halaman Home (daftar buku/list), Halaman Chat, dan pop-up/layar
"Pilih Maskot".

Buat UI dummy dulu. Tampilkan data palsu di layar chat atau wishlist agar Anda tahu
aplikasinya terlihat bagus dan flow-nya enak.

Langkah 4: Hubungkan Frontend dan Backend (Integrasi)
Ini tahap menyatukan kepingan puzzle.

Target:

Bungkus script Python (dari Langkah 1) menjadi API sungguhan menggunakan FastAPI.

Di Next.js, saat user mengirim pesan chat, tembak endpoint FastAPI tersebut.

FastAPI memproses AI, lalu mengembalikan jawaban ke Next.js.

Simpan hasil percakapan tersebut ke tabel messages di Supabase.

Sambungkan pencarian buku di UI dengan Google Books API.

---