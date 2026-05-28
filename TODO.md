# TODO - Integrasi Frontend -> Backend -> MySQL

## Step 1: Fix AuthContext (hilangkan apiFetch is not defined)
- [x] Ganti semua penggunaan `apiFetch` di `src/context/AuthContext.jsx` menjadi `api.get/post/...` dari `src/api/client.js`
- [x] Pastikan login memanggil `POST /api/auth/login`
- [x] Setelah login simpan user+token ke `sessionStorage` key `asinetkw_user`
- [ ] Pastikan load profile pakai endpoint yang sesuai


## Step 2: Perbaiki DB config backend agar DB_PASSWORD boleh kosong (XAMPP root)
- [x] Edit `backend/config/db.js` agar tidak mewajibkan DB_PASSWORD
- [ ] Pastikan mysql2/promise dan pool setup benar


## Step 3: Hilangkan mockDatabase/localStorage untuk data utama (ganti ke API)
- [ ] Update halaman admin:
  - [ ] src/pages/admin/DosenPage.jsx
  - [ ] src/pages/admin/MataKuliahPage.jsx
  - [ ] src/pages/admin/RuanganPage.jsx
  - [ ] src/pages/admin/JadwalPage.jsx
  - [ ] src/pages/admin/AbsensiPage.jsx
  - [ ] src/pages/admin/RekapAbsensiPage.jsx
  - [ ] src/pages/admin/HakAksesPage.jsx
  - [ ] src/pages/admin/BackupPage.jsx
  - [ ] src/pages/admin/AdminDashboard.jsx
- [ ] Update halaman dosen:
  - [ ] src/pages/dosen/DosenDashboard.jsx
  - [ ] src/pages/dosen/DosenJadwalPage.jsx
  - [ ] src/pages/dosen/DosenMahasiswaPage.jsx
  - [ ] src/pages/dosen/DosenAbsensiPage.jsx
  - [ ] src/pages/dosen/DosenRekapPage.jsx
- [ ] Update halaman mahasiswa:
  - [ ] src/pages/mahasiswa/MahasiswaDashboard.jsx
  - [ ] src/pages/mahasiswa/MahasiswaAbsensiPage.jsx
  - [ ] src/pages/mahasiswa/MahasiswaRekapPage.jsx

## Step 4: Update API helper (konsisten token + base URL)
- [ ] Cek `src/api/client.js` (konsisten pakai api.del vs api.delete)
- [ ] Pastikan semua halaman memakai helper ini

## Step 5: README & konfigurasi run
- [ ] Pastikan `.env` instruksi untuk backend lengkap (JWT_SECRET, JWT_EXPIRES_IN, DB_PASSWORD boleh kosong)
- [ ] Update README: cara import schema.sql, seed, akun login default

## Step 6: Verifikasi
- [ ] Jalankan backend + seed
- [ ] Jalankan frontend dan tes login
- [ ] Tes CRUD mahasiswa/dosen/mata kuliah/ruangan/jadwal/absensi

