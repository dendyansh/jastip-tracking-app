# Jastip Tracking Order

Aplikasi Web Jastip Tracking Order yang dibangun menggunakan Next.js (App Router), Tailwind CSS, TypeScript, dan Supabase.

## Fitur Utama
- **Lacak Pesanan (Pelanggan)**: Pelanggan dapat memasukkan Kode Pesanan untuk melihat status pesanan dan timeline perjalanan barang secara *real-time*.
- **Admin Dashboard**: Halaman khusus untuk Admin menambah pesanan baru, memperbarui status barang (PENDING, PURCHASED, SHIPPING, ARRIVED, DONE), dan memasukkan nomor resi pengiriman.
- **WhatsApp Integrasi**: Admin dapat dengan mudah mengirimkan link *tracking* langsung melalui WhatsApp pelanggan. Pelanggan juga dapat menanyakan detail barang ke Admin via WhatsApp.

## Persiapan Pengembangan Lokal
1. Lakukan instalasi dependensi:
   ```bash
   npm install
   ```
2. Salin `.env.local` dan masukkan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
3. Jalankan server lokal:
   ```bash
   npm run dev
   ```

## Panduan Deployment ke Vercel

Aplikasi ini sudah siap untuk di-deploy ke Vercel. Ikuti langkah-langkah berikut:

1. Push repository/kode ini ke **GitHub**, **GitLab**, atau **Bitbucket**.
2. Login ke [Vercel Dashboard](https://vercel.com/dashboard) dan klik **Add New Project**.
3. Import repository Anda yang berisi kode aplikasi ini.
4. Pada bagian **Environment Variables** sebelum melakukan *Deploy*, tambahkan dua variabel berikut:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
     - **Value**: *(Masukkan URL Project Supabase Anda, misal: https://xyz.supabase.co)*
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **Value**: *(Masukkan Anon Key Supabase Anda)*
5. Klik **Deploy**. Vercel akan otomatis melakukan proses *build* dan aplikasi Anda akan tersedia secara online.

## Catatan Database (Supabase)
Pastikan Anda sudah menjalankan SQL *schema* yang tersedia pada file `schema.sql` di SQL Editor pada *dashboard* Supabase Anda sebelum menggunakan aplikasi ini.
