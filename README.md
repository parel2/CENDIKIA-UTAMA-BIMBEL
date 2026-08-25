# Rumah Belajar Calistung

Aplikasi belajar membaca, menulis, dan berhitung untuk siswa SD kelas 1-5.

## Teknologi
- React + TypeScript + Vite
- Tailwind CSS
- Firebase Firestore (database online untuk soal)
- IndexedDB (profil siswa dan nilai, per perangkat)

## Cara menjalankan secara lokal
```bash
npm install
npm run dev
```

## Build untuk produksi
```bash
npm run build
```
Hasil build ada di folder `dist/`.

## Deploy ke GitHub Pages
1. Buat repository baru di GitHub
2. Upload semua file proyek ini ke repository tersebut
3. Jalankan `npm run build` untuk membuat folder `dist/`
4. Buka Settings → Pages di repository GitHub Anda
5. Pilih source: folder `dist` (atau gunakan GitHub Actions)
6. Aplikasi akan tersedia di `https://<username>.github.io/<repo>/`

## Firebase
Soal dan snapshot tersimpan di Firebase Firestore. Profil siswa dan nilai tersimpan di perangkat masing-masing (IndexedDB).

Konfigurasi Firebase ada di `src/lib/firebase.ts`.
