-- ============================================================
-- ASINETKW - Database Schema (MariaDB / MySQL)
-- ============================================================


-- ---- 1. users ----
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','dosen','mahasiswa') NOT NULL,
  created_at DATE
);

-- ---- 2. mahasiswa ----
CREATE TABLE IF NOT EXISTS mahasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  prodi VARCHAR(100) NOT NULL,
  kelas VARCHAR(20) NOT NULL,
  semester INT NOT NULL,
  status ENUM('Aktif','Non-Aktif','Cuti','Lulus') NOT NULL,
  user_id INT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ---- 3. dosen ----
CREATE TABLE IF NOT EXISTS dosen (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nidn VARCHAR(30) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  prodi VARCHAR(100) NOT NULL,
  no_hp VARCHAR(20),
  status ENUM('Aktif','Non-Aktif') NOT NULL,
  user_id INT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ---- 4. mata_kuliah ----
CREATE TABLE IF NOT EXISTS mata_kuliah (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_mk VARCHAR(20) NOT NULL UNIQUE,
  nama_mk VARCHAR(100) NOT NULL,
  sks INT NOT NULL,
  semester INT NOT NULL,
  prodi VARCHAR(100) NOT NULL
);

-- ---- 5. ruangan ----
CREATE TABLE IF NOT EXISTS ruangan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_ruangan VARCHAR(20) NOT NULL UNIQUE,
  nama_ruangan VARCHAR(100) NOT NULL,
  kapasitas INT NOT NULL,
  lokasi VARCHAR(100) NOT NULL,
  status ENUM('Tersedia','Tidak Tersedia','Dalam Perbaikan') NOT NULL
);

-- ---- 6. jadwal ----
CREATE TABLE IF NOT EXISTS jadwal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mata_kuliah_id INT NOT NULL,
  dosen_id INT NOT NULL,
  kelas VARCHAR(20) NOT NULL,
  ruangan_id INT NOT NULL,
  hari ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu') NOT NULL,
  jam_mulai TIME NOT NULL,
  jam_selesai TIME NOT NULL,
  CONSTRAINT chk_jam CHECK (jam_selesai > jam_mulai),
  FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE CASCADE,
  FOREIGN KEY (dosen_id) REFERENCES dosen(id) ON DELETE CASCADE,
  FOREIGN KEY (ruangan_id) REFERENCES ruangan(id) ON DELETE CASCADE
);

-- ---- 7. absensi ----
CREATE TABLE IF NOT EXISTS absensi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jadwal_id INT NOT NULL,
  mahasiswa_id INT NOT NULL,
  tanggal DATE NOT NULL,
  pertemuan_ke INT NOT NULL,
  status_absensi ENUM('Hadir','Izin','Sakit','Alpha') NOT NULL,
  keterangan TEXT NULL,
  created_at DATE,
  UNIQUE KEY uniq_absensi (jadwal_id, mahasiswa_id, pertemuan_ke),
  FOREIGN KEY (jadwal_id) REFERENCES jadwal(id) ON DELETE CASCADE,
  FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE
);

-- ---- 8. backup_log ----
CREATE TABLE IF NOT EXISTS backup_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_data VARCHAR(100) NOT NULL,
  admin_id INT NULL,
  tanggal_backup DATE NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);
