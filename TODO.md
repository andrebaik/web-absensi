# TODO - Perbaikan Koneksi API Frontend <-> Backend (ASINETKW)

## Checklist Mapping & Fix
- [ ] Buat mapping global seluruh pemanggilan `api.get/post/put/delete` di frontend dengan route backend
- [x] Perbaiki `src/pages/admin/BackupPage.jsx`: ganti `/backupLog` -> `/backup-log` (GET/POST)

- [ ] Perbaiki `src/pages/dosen/DosenDashboard.jsx`: hilangkan `GET /absensi` (admin-only) dan ganti ke `GET /absensi/rekap/dosen/:dosenId`
- [ ] Perbaiki `src/pages/mahasiswa/MahasiswaDashboard.jsx`: hilangkan `GET /absensi` (admin-only) dan ganti ke `GET /absensi/rekap/mahasiswa/:mahasiswaId`
- [ ] Perbaiki `src/pages/admin/HakAksesPage.jsx`:
  - [ ] Disable/Sembunyikan tombol Tambah User dan Edit User
  - [ ] Tambahkan keterangan UI sesuai requirement OPSIONAL A
  - [ ] Pastikan masih bisa GET `/users` dan DELETE `/users/:id`

- [x] Perbaiki `src/pages/auth/ForgotPasswordPage.jsx`:
  - [x] Tampilkan pesan bahwa fitur reset password masih demo/belum aktif




- [ ] Scan ulang global setelah perubahan:
  - [ ] cari `backupLog`/`/backupLog`
  - [ ] cari `/jadwal?dosen_id` dan `/jadwal?kelas`
  - [ ] cari `api.get('/absensi')` di file dosen/mahasiswa
  - [ ] cari `api/api/`
- [ ] Jalankan `npm run build` dan pastikan build sukses

## Laporan Akhir
- [ ] Daftar file frontend yang diubah
- [ ] Daftar file backend yang diubah
- [ ] Endpoint yang diperbaiki
- [ ] Endpoint baru yang dibuat (jika ada)
- [ ] Endpoint yang dihapus/diganti
- [ ] Cara test admin/dosen/mahasiswa

