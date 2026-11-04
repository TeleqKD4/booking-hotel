# HotelPilih - SPK Pemilihan Hotel (Metode SAW), tampilan situs pemesanan hotel

## Cara menjalankan
Windows: klik dua kali `jalankan.bat`.
Manual: pastikan di folder ini ada package.json (ketik `dir`), lalu
  npm install
  npm run dev
Buka http://localhost:5173

## Struktur
- src/saw.js     : logika SAW + data awal
- src/App.jsx    : navbar, Beranda, Daftar Hotel + panel Preferensi, form tambah/ubah hotel
- src/Result.jsx : Rekomendasi, Perhitungan (matriks, V, pengujian), Panduan
- src/ui.jsx     : ikon dan ilustrasi hotel otomatis
- src/styles.css : tema coklat-krem
Foto hotel: isi kolom "URL foto" saat tambah/ubah hotel (opsional).
