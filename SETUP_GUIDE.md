# Panduan Lengkap Setup Web App Jastip Tracking Order

Dokumen ini berisi panduan *step-by-step* untuk mengatur (setup) aplikasi Anda dari awal (mulai dari pra-syarat), menghubungkannya ke Supabase, menjalankannya secara lokal, hingga melakukan *push* kode ke GitHub.

---

## Tahap 1: Persiapan (*Prerequisites*)

Sebelum mulai, pastikan komputer Anda telah terinstal *software* berikut:
1. **Node.js**: Unduh dan install dari [nodejs.org](https://nodejs.org/). (Ini diperlukan agar perintah `npm` dapat berjalan).
2. **Git**: Unduh dan install dari [git-scm.com](https://git-scm.com/) (Dibutuhkan untuk *push* ke GitHub).
3. **Visual Studio Code** (Opsional tapi disarankan): Untuk membuka folder `d:/Project/Antigravity` dan mengedit kode jika perlu.

---

## Tahap 2: Setup Database & Auth di Supabase

Aplikasi ini sangat bergantung pada Supabase untuk Database dan Autentikasi Admin.

1. Buka [supabase.com](https://supabase.com) dan buat akun (jika belum).
2. Buat **New Project** di dashboard Supabase.
3. **Jalankan Skema Database**:
   - Buka menu **SQL Editor** di sisi kiri dashboard Supabase Anda.
   - Buka file `schema.sql` yang ada di folder aplikasi Anda, lalu *Copy* semua isinya.
   - *Paste* di SQL Editor Supabase, kemudian tekan tombol **Run**. Ini akan membuat tabel `orders` secara otomatis.
4. **Buat Akun Admin**:
   - Buka menu **Authentication** di panel sebelah kiri, lalu pilih tab **Users**.
   - Klik **Add User** -> **Create New User**.
   - Masukkan *email* dan *password* (Ini adalah kredensial yang akan Anda gunakan untuk masuk ke `/admin/login`).
5. **Dapatkan Credentials API**:
   - Masuk ke menu **Project Settings** (ikon gerigi/roda gigi) -> **API**.
   - Salin **Project URL** dan **Project API Keys (anon, public)**. Anda akan membutuhkannya di Tahap 3.

---

## Tahap 3: Menjalankan Aplikasi di Komputer Lokal

1. Buka aplikasi terminal (*Command Prompt*, *PowerShell*, atau *Terminal* bawaan VS Code).
2. Pindah ke direktori project Anda:
   ```bash
   cd d:/Project/Antigravity
   ```
3. Install semua *library* pendukung:
   ```bash
   npm install
   ```
4. Hubungkan Aplikasi ke Supabase:
   - Buka file `.env.local` di editor Anda.
   - Ganti *placeholder* dengan *URL* dan *Anon Key* yang Anda dapatkan di Tahap 2:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://[ID-PROJECT].supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUz... (paste kunci panjang Anda)
     ```
5. Jalankan *server* lokal:
   ```bash
   npm run dev
   ```
6. Buka Web Browser dan ketik: `http://localhost:3000`. Aplikasi kini sudah berjalan secara lokal!
   - Kunjungi `http://localhost:3000/admin/login` dan coba login dengan akun Supabase yang telah dibuat.

---

## Tahap 4: Push Kode ke GitHub

Setelah aplikasi berjalan dengan baik di lokal, saatnya mengamankan kode Anda ke GitHub.

1. Buka akun [github.com](https://github.com) dan buat repositori baru (klik tombol **New**). Beri nama misal: `jastip-tracking-app`. Jangan centang "Add a README" (biarkan kosong agar bersih).
2. Kembali ke *Terminal* atau *Command Prompt* di komputer Anda (Pastikan masih berada di folder `d:/Project/Antigravity`).
3. Tekan `Ctrl + C` untuk mematikan *server* Next.js jika masih menyala.
4. Jalankan perintah inisialisasi Git:
   ```bash
   git init
   ```
   *(Penting: Next.js sudah memiliki file `.gitignore` bawaan sehingga file `.env.local` berisi kata sandi tidak akan ikut terunggah, yang mana itu sangat aman).*
5. Tambahkan semua file Anda ke Git:
   ```bash
   git add .
   ```
6. Simpan perubahan pertama (Commit):
   ```bash
   git commit -m "First commit: Jastip Tracking Web App dengan Supabase Auth"
   ```
7. Hubungkan Git lokal Anda ke Github. (Ganti `USERNAME` dengan username GitHub Anda, dan `jastip-tracking-app` dengan nama repositori Anda tadi):
   ```bash
   git remote add origin https://github.com/USERNAME/jastip-tracking-app.git
   ```
   *(Perintah ini juga dapat Anda salin langsung dari halaman Github setelah Anda membuat repositori).*
8. Atur nama *branch* utama menjadi `main`:
   ```bash
   git branch -M main
   ```
9. Kirim (*Push*) kode ke GitHub:
   ```bash
   git push -u origin main
   ```

Selamat! Kode Anda kini telah aman berada di GitHub. 
Dari sini, Anda bisa merujuk ke file `README.md` utama untuk instruksi menyebarkannya (deployment) ke Vercel dengan satu klik.
