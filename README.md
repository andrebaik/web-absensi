# ASINETKW

**ASINETKW** adalah aplikasi web untuk sistem absensi dan manajemen kampus berbasis role. Aplikasi ini dibuat untuk membantu pengelolaan data akademik seperti mahasiswa, dosen, mata kuliah, ruangan, jadwal kuliah, absensi, rekap absensi, serta hak akses pengguna.

Sistem ini memiliki tiga role utama:

- **Admin**: mengelola seluruh data master, jadwal, absensi, user, hak akses, dan backup log.
- **Dosen**: melihat jadwal mengajar, melihat data mahasiswa, menginput atau mengedit absensi, dan melihat rekap absensi.
- **Mahasiswa**: melihat dashboard, jadwal kuliah, status absensi, dan rekap absensi.

---

## Daftar Isi

- [Tentang Project](#tentang-project)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Style Guide](#style-guide)
- [Struktur Folder](#struktur-folder)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi Project](#instalasi-project)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Setup Database](#setup-database)
- [Menjalankan Backend](#menjalankan-backend)
- [Menjalankan Frontend](#menjalankan-frontend)
- [Akun Login Default](#akun-login-default)
- [Endpoint API](#endpoint-api)
- [Build Production](#build-production)
- [Git Workflow](#git-workflow)
- [Troubleshooting](#troubleshooting)
- [Developer](#developer)
- [Lisensi](#lisensi)

---

## Tentang Project

ASINETKW dikembangkan sebagai sistem informasi absensi dan manajemen kampus. Aplikasi ini dirancang agar proses akademik seperti pencatatan kehadiran, pengelolaan jadwal, dan pengelolaan data pengguna dapat dilakukan secara lebih terstruktur melalui dashboard berbasis web.

Project ini menggunakan arsitektur **frontend dan backend terpisah**:

- Frontend menggunakan React + Vite.
- Backend menggunakan Express.js.
- Database menggunakan MySQL atau MariaDB.
- Autentikasi menggunakan JWT.
- Password disimpan dalam bentuk hash menggunakan bcrypt.

---

## Fitur Utama

### Admin

- Login sebagai admin.
- Mengelola data mahasiswa.
- Mengelola data dosen.
- Mengelola data mata kuliah.
- Mengelola data ruangan.
- Mengelola jadwal kuliah.
- Mengelola data absensi.
- Mengelola user dan hak akses.
- Melihat rekap absensi.
- Melihat backup log.

### Dosen

- Login sebagai dosen.
- Melihat jadwal mengajar.
- Melihat data mahasiswa.
- Menginput absensi mahasiswa.
- Mengedit status absensi.
- Melihat rekap absensi.

### Mahasiswa

- Login sebagai mahasiswa.
- Melihat dashboard mahasiswa.
- Melihat jadwal kuliah.
- Melihat status absensi.
- Melihat rekap absensi.

---

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React
- CSS custom properties

### Backend

- Node.js
- Express.js
- MySQL2
- JSON Web Token
- Bcrypt
- CORS
- Dotenv

### Database

- MySQL
- MariaDB

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Laragon

---

## Style Guide

### WARNA UTAMA

| Fungsi                         |         Warna |      Kode |
| ------------------------------ | ------------: | --------: |
| Primary / warna utama          |     Biru navy | #1e3a5f |
| Primary light / tombol utama   |   Biru terang | #2563eb |
| Primary dark / sidebar         |    Navy gelap | #0f2440 |
| Accent / highlight aktif       |    Biru aksen | #3b82f6 |
| Success / berhasil / hadir     |         Hijau | #10b981 |
| Warning / peringatan / sakit   | Kuning-oranye | #f59e0b |
| Danger / error / hapus / alpha |         Merah | #ef4444 |
| Info / izin / informasi        |     Ungu-biru | #6366f1 |
| Background halaman             |    Abu terang | #f1f5f9 |
| Card / modal / navbar          |         Putih | #ffffff |
| Text utama                     |   Slate gelap | #1e293b |
| Text muted                     |     Abu slate | #64748b |
| Border                         |      Abu muda | #e2e8f0 |

### Tipografi

Project ini menggunakan font **Inter** sebagai font utama.

| Elemen           | Style                    |
|------------------|--------------------------|
| Font utama       | Inter                    |
| Font weight      | 300, 400, 500, 600, 700  |
| Body desktop     | 15px                     |
| Body mobile      | 14px                     |
| Heading dashboard| Bold / Semi-bold         |
| Label form       | Medium                   |
| Text tabel       | Regular / Medium         |
| Text kecil       | Muted, ukuran lebih kecil|

### Komponen UI

Komponen utama yang digunakan dalam project:

- Sidebar navigation
- Navbar
- Dashboard layout
- Stat card
- Data table
- Search input
- Filter select
- Modal form
- Confirm dialog
- Toast notification
- Badge status
- Button primary
- Button success
- Button danger
- Button outline
- Form input
- Responsive table wrapper
- Login card

### Prinsip Desain

- Menggunakan gaya modern dashboard.
- Warna utama biru navy untuk kesan formal dan akademik.
- Status data dibedakan dengan warna yang konsisten.
- Layout dibuat responsive untuk desktop, tablet, dan mobile.
- Tabel data menggunakan horizontal scroll pada layar kecil.
- Sidebar berubah menjadi hamburger menu pada perangkat mobile.

---

## Struktur Folder

```txt
asinetkw/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   ├── routes/
│   ├── seeders/
│   ├── sql/
│   │   └── schema.sql
│   ├── public/
│   ├── server.js
│   └── package.json
│
├── src/
│   ├── api/
│   │   └── client.js
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── context/
│   ├── data/
│   ├── pages/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── dosen/
│   │   └── mahasiswa/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Persyaratan Sistem

Pastikan sudah menginstall:

- Node.js
- npm
- Git
- MySQL / MariaDB
- Laragon, XAMPP, atau MySQL Server biasa

Cek versi Node.js dan npm:

```bash
node -v
npm -v
```

---

## Instalasi Project

Clone repository:

```bash
git clone https://github.com/andrebaik/web-absensi.git
```

Masuk ke folder project:

```bash
cd web-absensi
```

Install dependency frontend:

```bash
npm install
```

Install dependency backend:

```bash
cd backend
npm install
```

---

## Konfigurasi Environment

File `.env` tidak boleh di-upload ke GitHub. Gunakan `.env.example` sebagai template konfigurasi.

### Frontend Environment

Buat file `.env.local` di root project:

```env
VITE_API_BASE=http://localhost:5000/api
```

### Backend Environment

Buat file `.env` di dalam folder `backend`:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=asinetkw_db

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=8h

SEED_ADMIN_PASSWORD=admin123
SEED_DOSEN_PASSWORD=dosen123
SEED_MHS_PASSWORD=mahasiswa123

FRONTEND_URL=http://localhost:5173
```

Jika MySQL menggunakan password, isi bagian berikut:

```env
DB_PASSWORD=password_mysql
```

---

## Setup Database

File schema database tersedia di:

```txt
backend/sql/schema.sql
```

Schema tersebut akan membuat database:

```txt
asinetkw_db
```

### Import Database Menggunakan CMD

Dari root project, jalankan:

```bash
mysql -u root < backend\sql\schema.sql
```

Jika MySQL menggunakan password:

```bash
mysql -u root -p < backend\sql\schema.sql
```

### Import Database Menggunakan PowerShell

```powershell
Get-Content backend\sql\schema.sql | mysql -u root
```

Jika MySQL menggunakan password:

```powershell
Get-Content backend\sql\schema.sql | mysql -u root -p
```

---

## Menjalankan Backend

Masuk ke folder backend:

```bash
cd backend
```

Jalankan seeder untuk membuat akun awal:

```bash
npm run seed
```

Jalankan backend:

```bash
npm run dev
```

Backend berjalan di:

```txt
http://localhost:5000
```

Cek health API:

```txt
http://localhost:5000/api/health
```

Jika berhasil, response akan menampilkan:

```json
{
  "status": "ok"
}
```

---

## Menjalankan Frontend

Buka terminal baru dari root project:

```bash
npm run dev
```

Frontend berjalan di:

```txt
http://localhost:5173
```

Backend dan frontend harus berjalan bersamaan di terminal berbeda.

### Terminal Backend

```bash
cd backend
npm run dev
```

### Terminal Frontend

```bash
npm run dev
```

---

## Akun Login Default

Akun dibuat melalui seeder backend.

### Admin

```txt
Email    : admin@asinetkw.ac.id
Password : admin123
```

### Dosen

```txt
Email    : dosen1@asinetkw.ac.id
Password : dosen123

Email    : dosen2@asinetkw.ac.id
Password : dosen123
```

### Mahasiswa

```txt
Email    : mahasiswa1@asinetkw.ac.id
Password : mahasiswa123

Email    : mahasiswa2@asinetkw.ac.id
Password : mahasiswa123
```

### Catatan Password User Baru

Untuk user baru yang dibuat melalui sistem:

```txt
Mahasiswa baru -> password default menggunakan NIM
Dosen baru     -> password default menggunakan NIDN
```

Contoh:

```txt
NIM      : 2406084
Password : 2406084

NIDN     : 0001010101
Password : 0001010101
```

Password yang tersimpan di database berbentuk hash menggunakan bcrypt, bukan teks asli.

---

## Endpoint API

Base URL backend:

```txt
http://localhost:5000/api
```

Endpoint utama:

| Endpoint | Fungsi |
|---|---|
| `/api/health` | Cek status backend |
| `/api/auth` | Login dan autentikasi |
| `/api/users` | Manajemen user |
| `/api/mahasiswa` | Manajemen mahasiswa |
| `/api/dosen` | Manajemen dosen |
| `/api/mata-kuliah` | Manajemen mata kuliah |
| `/api/ruangan` | Manajemen ruangan |
| `/api/jadwal` | Manajemen jadwal |
| `/api/absensi` | Manajemen absensi |
| `/api/backup-log` | Backup log |

---

## Build Production

Build frontend:

```bash
npm run build
```

Hasil build berada di folder:

```txt
dist/
```

Preview hasil build:

```bash
npm run preview
```

---

## Git Workflow

Cek status file:

```bash
git status
```

Tambahkan perubahan:

```bash
git add .
```

Commit perubahan:

```bash
git commit -m "feat: update project"
```

Push ke GitHub:

```bash
git push origin main
```

Pastikan file rahasia tidak ikut masuk ke commit:

```txt
.env
.env.local
backend/.env
backend/.env.local
backend/.env.deploy.backup
node_modules/
backend/node_modules/
dist/
```

Contoh konfigurasi `.gitignore`:

```gitignore
# dependencies
node_modules/
backend/node_modules/

# build
dist/
backend/dist/

# environment files
.env
.env.local
.env.development
.env.production
.env.deploy.backup
.env.*.local

backend/.env
backend/.env.local
backend/.env.development
backend/.env.production
backend/.env.deploy.backup
backend/.env.*.local

# logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
Thumbs.db
```

Jika `.env` sudah pernah ter-track Git, hapus dari tracking tanpa menghapus file lokal:

```bash
git rm --cached .env
git rm --cached backend/.env
git commit -m "chore: remove env files from tracking"
git push origin main
```

---

## Troubleshooting

### Backend Tidak Bisa Connect ke Database

Pastikan MySQL sudah menyala.

Cek file `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=asinetkw_db
```

Cek database:

```bash
mysql -u root
```

Lalu jalankan:

```sql
SHOW DATABASES;
USE asinetkw_db;
SHOW TABLES;
```

---

### Frontend Tidak Connect ke Backend

Pastikan file `.env.local` di root project berisi:

```env
VITE_API_BASE=http://localhost:5000/api
```

Restart frontend setelah mengubah `.env.local`:

```bash
npm run dev
```

---

### CORS Error

Pastikan `FRONTEND_URL` pada `backend/.env` sesuai dengan URL frontend:

```env
FRONTEND_URL=http://localhost:5173
```

Jika Vite berjalan di port lain, misalnya `5174`, ubah menjadi:

```env
FRONTEND_URL=http://localhost:5174
```

Restart backend setelah mengubah `.env`:

```bash
npm run dev
```

---

### Port 5000 Sudah Digunakan

Jika muncul error:

```txt
EADDRINUSE: address already in use :::5000
```

Cek proses yang memakai port 5000:

```bash
netstat -ano | findstr :5000
```

Matikan proses berdasarkan PID:

```bash
taskkill /PID ANGKA_PID /F
```

Atau ubah port di `backend/.env`:

```env
PORT=5001
```

Jika port backend diubah, sesuaikan juga `VITE_API_BASE` pada frontend.

---

### MySQL Tidak Dikenali di Terminal

Jika muncul:

```txt
mysql is not recognized
```

Gunakan path MySQL langsung.

Contoh XAMPP:

```bash
C:\xampp\mysql\bin\mysql.exe -u root
```

Contoh Laragon:

```bash
C:\laragon\bin\mysql\mysql-8.0\bin\mysql.exe -u root
```

---

### Seeder Gagal

Pastikan database sudah dibuat dan konfigurasi `.env` benar.

Jalankan ulang:

```bash
npm run seed
```

Jika masih gagal, cek koneksi database dan pastikan tabel sudah ada:

```sql
USE asinetkw_db;
SHOW TABLES;
```

---

## Developer

Project ini dibuat untuk kebutuhan pembelajaran dan pengembangan sistem informasi kampus.

```txt
Nama Aplikasi : ASINETKW
Jenis Project : Sistem Absensi dan Manajemen Kampus
Role Utama    : Admin, Dosen, Mahasiswa
Repository    : github.com/andrebaik/web-absensi
```

---

## Lisensi

Project ini digunakan untuk kebutuhan pembelajaran, pengembangan, dan dokumentasi sistem informasi kampus.