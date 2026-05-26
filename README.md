# ASINETKW (Sistem Absensi & Manajemen Kampus)

Aplikasi web untuk absensi dan manajemen data kampus (admin, dosen, mahasiswa). Backend menyediakan API untuk autentikasi dan akses data ke database MySQL/MariaDB.

---

## Fitur
- Auth: login & forgot password
- Manajemen data:
  - Users (admin)
  - Mahasiswa
  - Dosen
  - Mata Kuliah
  - Ruangan
  - Jadwal
  - Absensi
  - Backup Log
- Role-based access control (RBAC)

---

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL/MariaDB
- Auth: JWT (tergantung controller)
- ORM/DB driver: `mysql2/promise` (connection pool)

---

## Prasyarat
1. Node.js (disarankan versi LTS)
2. MySQL/MariaDB sudah terinstall dan berjalan
3. (Opsional) phpMyAdmin / MySQL CLI untuk import schema

---

## Setup Database
Schema database tersedia di:
- `backend/sql/schema.sql`

Schema akan membuat database:
- `asinetkw_db`

Langkah:
1) Import file `backend/sql/schema.sql` ke MySQL/MariaDB.
2) Pastikan tabel-tabel sudah ada.

---

## Setup Backend
### 1) Install dependency
```bash
cd backend
npm install
```

### 2) Konfigurasi environment
Buat file:
- `backend/.env`

Required env untuk koneksi database:
- `DB_HOST` (default `localhost`)
- `DB_PORT` (default `3306`)
- `DB_USER` (WAJIB)
- `DB_PASSWORD` (WAJIB)
- `DB_NAME` (WAJIB, contoh: `asinetkw_db`)

Untuk seeding data (opsional tapi disarankan):
- `SEED_ADMIN_PASSWORD`
- `SEED_DOSEN_PASSWORD`
- `SEED_MHS_PASSWORD`

Contoh minimal `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=asinetkw_db

SEED_ADMIN_PASSWORD=admin123
SEED_DOSEN_PASSWORD=dosen123
SEED_MHS_PASSWORD=mahasiswa123

FRONTEND_URL=http://localhost:5173
PORT=5000
```

### 3) Jalankan database seeder (opsional)
```bash
cd backend
npm run seed
```

### 4) Jalankan server
Dev:
```bash
cd backend
npm run dev
```

Production:
```bash
cd backend
npm run start
```

Backend berjalan di:
- `http://localhost:5000` (atau sesuai `PORT` di `.env`)

---

## Setup Frontend
### 1) Install dependency
```bash
npm install
```

### 2) Jalankan frontend
```bash
npm run dev
```

Front-end berjalan di:
- `http://localhost:5173`

---

## Akses API
Base path API:
- `/api/auth`
- `/api/users`
- `/api/mahasiswa`
- `/api/dosen`
- `/api/mata-kuliah`
- `/api/ruangan`
- `/api/jadwal`
- `/api/absensi`
- `/api/backup-log`

---

## Cara Akses di Mobile
1. Jalankan frontend.
2. Pastikan HP dan laptop berada di jaringan yang sama (WiFi yang sama).
3. Buka dari HP:
   - `http://<IP_LAPTOP>:5173`

Aplikasi sudah responsif karena `index.html` memiliki:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

---

## Struktur Folder
- `src/` → komponen halaman React
- `backend/` → server Express + routes
- `backend/sql/schema.sql` → skema database

---

## Catatan
- Jika seeding gagal, pastikan kredensial DB di `backend/.env` benar.
- Jika CORS error, cek `FRONTEND_URL` di `backend/.env`.

---
