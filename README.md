# ASINETKW - Sistem Absensi & Manajemen Kampus

ASINETKW adalah aplikasi web untuk mengelola absensi dan manajemen data kampus. Sistem ini memiliki 3 role utama, yaitu **Admin**, **Dosen**, dan **Mahasiswa**. Aplikasi menggunakan frontend React/Vite, backend Express.js, dan database MySQL/MariaDB.

---

## Fitur Utama

### Admin
- Login sebagai admin
- Mengelola data mahasiswa
- Mengelola data dosen
- Mengelola data mata kuliah
- Mengelola data ruangan
- Mengelola jadwal kuliah
- Mengelola data absensi
- Mengelola user dan hak akses
- Melihat backup log

### Dosen
- Login sebagai dosen
- Melihat jadwal mengajar
- Melihat data mahasiswa
- Menginput dan mengedit absensi
- Melihat rekap absensi

### Mahasiswa
- Login sebagai mahasiswa
- Melihat dashboard mahasiswa
- Melihat jadwal kuliah
- Melihat status absensi
- Melihat rekap absensi

---

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express.js
- MySQL2
- JWT Authentication
- Bcrypt
- CORS
- Dotenv

### Database
- MySQL / MariaDB
- Bisa dijalankan menggunakan Laragon, XAMPP, atau MySQL Server biasa

---

## Struktur Folder

```txt
asinetkw/
├── src/                     # Frontend React
│   ├── api/                 # API client
│   ├── components/          # Komponen UI
│   ├── context/             # Auth dan toast context
│   ├── pages/               # Halaman admin, dosen, mahasiswa
│   └── data/                # Data fallback/mock jika masih ada
│
├── backend/                 # Backend Express
│   ├── config/              # Konfigurasi database
│   ├── controllers/         # Logic setiap fitur
│   ├── middleware/          # Auth dan role middleware
│   ├── routes/              # Route API
│   ├── seeders/             # Seeder data awal
│   ├── sql/                 # Schema database
│   └── server.js            # Entry point backend
│
├── package.json             # Dependency frontend
├── README.md
└── .gitignore
Persiapan

Pastikan sudah terinstall:

Node.js
npm
Git
Laragon / XAMPP / MySQL Server

Cek versi Node.js:

node -v
npm -v
Setup Database

File schema database tersedia di:

backend/sql/schema.sql

Schema ini akan membuat database:

asinetkw_db
Import Database Menggunakan Laragon / CMD

Masuk ke folder project:

cd /d D:\Learning\web-absen1.5\asinetkw

Import schema:

mysql -u root < backend\sql\schema.sql

Jika MySQL menggunakan password:

mysql -u root -p < backend\sql\schema.sql
Import Database Menggunakan PowerShell

Jika menggunakan PowerShell, gunakan:

Get-Content backend\sql\schema.sql | mysql -u root

Jika MySQL menggunakan password:

Get-Content backend\sql\schema.sql | mysql -u root -p
Setup Backend

Masuk ke folder backend:

cd backend

Install dependency:

npm install

Buat file .env di dalam folder backend:

backend/.env

Isi contoh:

PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=asinetkw_db

JWT_SECRET=asinetkw_secret_key_change_this
JWT_EXPIRES_IN=8h

SEED_ADMIN_PASSWORD=admin123
SEED_DOSEN_PASSWORD=dosen123
SEED_MHS_PASSWORD=mahasiswa123

FRONTEND_URL=http://localhost:5173

Catatan: file .env tidak boleh di-upload ke GitHub. Gunakan .env.example sebagai contoh konfigurasi.

Jalankan seeder:

npm run seed

Jalankan backend:

npm run dev

Backend berjalan di:

http://localhost:5000

Cek health API:

http://localhost:5000/api/health

Jika berhasil, response akan menampilkan:

{
  "status": "ok"
}
Setup Frontend

Buka terminal baru, lalu masuk ke folder utama project:

cd D:\Learning\web-absen1.5\asinetkw

Install dependency:

npm install

Jalankan frontend:

npm run dev

Frontend berjalan di:

http://localhost:5173
Akun Login Default

Akun dibuat melalui seeder backend.

Admin
Email    : admin@asinetkw.ac.id
Password : admin123
Dosen
Email    : dosen1@asinetkw.ac.id
Password : dosen123
Email    : dosen2@asinetkw.ac.id
Password : dosen123
Mahasiswa
Email    : mahasiswa1@asinetkw.ac.id
Password : mahasiswa123
Email    : mahasiswa2@asinetkw.ac.id
Password : mahasiswa123
Catatan Password User Baru

Untuk user baru yang dibuat melalui sistem:

Mahasiswa baru → password default menggunakan NIM
Dosen baru     → password default menggunakan NIDN

Contoh:

NIM      : 2406084
Password : 2406084
NIDN     : 0001010101
Password : 0001010101

Password yang tersimpan di database berbentuk hash menggunakan bcrypt, bukan teks asli.

Endpoint API

Base URL backend:

http://localhost:5000/api

Daftar endpoint utama:

/api/auth
/api/users
/api/mahasiswa
/api/dosen
/api/mata-kuliah
/api/ruangan
/api/jadwal
/api/absensi
/api/backup-log
Menjalankan Project

Jalankan backend dan frontend di terminal berbeda.

Terminal 1 - Backend
cd D:\Learning\web-absen1.5\asinetkw\backend
npm run dev
Terminal 2 - Frontend
cd D:\Learning\web-absen1.5\asinetkw
npm run dev
Terminal 3 - Cek Database
mysql -u root

Lalu:

USE asinetkw_db;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM mahasiswa;
SELECT * FROM dosen;
Build Frontend

Untuk membuat versi production frontend:

npm run build

Hasil build akan berada di folder:

dist/

Untuk preview hasil build:

npm run preview
Environment File

File .env tidak boleh masuk ke repository.

Yang boleh masuk GitHub:

.env.example

Yang tidak boleh masuk GitHub:

.env
backend/.env
node_modules/
backend/node_modules/
dist/

Contoh isi .gitignore:

node_modules/
backend/node_modules/

dist/
backend/dist/

.env
.env.local
.env.*.local

backend/.env
backend/.env.local

*.log
.vscode/
.idea/
Thumbs.db
.DS_Store
Troubleshooting
Port 5000 sudah digunakan

Jika muncul error:

EADDRINUSE: address already in use :::5000

Cek proses yang memakai port 5000:

netstat -ano | findstr :5000

Matikan proses berdasarkan PID:

taskkill /PID ANGKA_PID /F

Atau ubah port di backend/.env:

PORT=5001

Lalu sesuaikan base URL API di frontend jika diperlukan.

MySQL tidak dikenali di terminal

Jika muncul:

mysql is not recognized

Gunakan path MySQL dari Laragon atau XAMPP.

Contoh Laragon:

C:\laragon\bin\mysql\mysql-8.0\bin\mysql.exe -u root

Contoh XAMPP:

C:\xampp\mysql\bin\mysql.exe -u root
CORS Error

Pastikan FRONTEND_URL di backend/.env sesuai dengan URL frontend:

FRONTEND_URL=http://localhost:5173
Seeder gagal karena password database kosong

Jika menggunakan Laragon/XAMPP dan password root kosong, pastikan konfigurasi database backend mendukung password kosong:

password: process.env.DB_PASSWORD ?? ''
Git Workflow

Cek status file:

git status

Tambahkan semua perubahan:

git add .

Commit:

git commit -m "feat: update project"

Push ke GitHub:

git push origin main

Pastikan file rahasia seperti .env tidak ikut masuk ke commit.

Developer

Project ini dibuat sebagai sistem absensi dan manajemen kampus berbasis web.

Nama aplikasi:

ASINETKW

Role utama:

Admin
Dosen
Mahasiswa
Lisensi

Project ini digunakan untuk kebutuhan pembelajaran dan pengembangan sistem informasi kampus.


Tambahin juga `.env.example` lu biar lebih rapi. Isi `backend/.env.example` sebaiknya begini:

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
