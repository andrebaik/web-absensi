# TODO - Replace mockDatabase with backend API

## Task
Ganti penggunaan `mockDatabase` pada file-file yang terdeteksi dengan pemanggilan backend Express/MySQL via `src/api/client.js`. Setelah CRUD, fetch ulang data. Jangan ubah desain UI.

## Files yang harus diubah
- src/pages/auth/ForgotPasswordPage.jsx
- src/pages/admin/BackupPage.jsx
- src/pages/admin/RekapAbsensiPage.jsx
- src/pages/dosen/DosenJadwalPage.jsx
- src/pages/dosen/DosenRekapPage.jsx

## Step plan
1. [x] Identifikasi endpoint yang dibutuhkan dari backend routes:
   - /auth/forgot-password
   - /backupLog
   - /mahasiswa, /dosen, /mata_kuliah, /ruangan, /jadwal
   - /absensi untuk rekap admin/dosen
2. [ ] Ubah ForgotPasswordPage: ganti `authDB` mock menjadi POST `/auth/forgot-password`.
3. [ ] Ubah BackupPage: ganti sumber data ekspor dari endpoint GET masing-masing tabel + log backup dari GET `/backupLog`.
4. [ ] Ubah RekapAbsensiPage: ganti perhitungan rekap dengan GET `/absensi/rekap/admin` (kalau bentuk data match; jika tidak, lakukan pemetaan tetap tanpa ubah UI).
5. [ ] Ubah DosenJadwalPage: ganti list jadwal + join mk/ruangan dari endpoint GET `/jadwal/dosen/:id` dan /mata_kuliah, /ruangan.
6. [ ] Ubah DosenRekapPage: ganti rekap dengan GET `/absensi/rekap/dosen/:dosenId` atau komposisi dari endpoint yang ada.
7. [ ] Pastikan setelah create/update/delete dilakukan fetch ulang (untuk halaman ini: Backup hanya create log; rekap/jadwal hanya read).
8. [ ] Jalankan build/lint/dev untuk validasi.

