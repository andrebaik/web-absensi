require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function mustGet(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[SEED] Missing required environment variable: ${name}`);
  }
  return value;
}

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: mustGet('DB_USER'),
    password: mustGet('DB_PASSWORD'),
    database: mustGet('DB_NAME'),
    charset: 'utf8mb4',
    multipleStatements: true,
  });

  console.log('Terhubung ke database...');

  try {
    // Kosongkan tabel dengan urutan yang benar (foreign key)
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE TABLE backup_log');
    await conn.query('TRUNCATE TABLE absensi');
    await conn.query('TRUNCATE TABLE jadwal');
    await conn.query('TRUNCATE TABLE ruangan');
    await conn.query('TRUNCATE TABLE mata_kuliah');
    await conn.query('TRUNCATE TABLE dosen');
    await conn.query('TRUNCATE TABLE mahasiswa');
    await conn.query('TRUNCATE TABLE users');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Tabel dikosongkan.');

    // Hash passwords (wajib dari env agar tidak ada hardcoded/default credentials)
    const hashAdmin = await bcrypt.hash(mustGet('SEED_ADMIN_PASSWORD'), SALT_ROUNDS);
    const hashDosen = await bcrypt.hash(mustGet('SEED_DOSEN_PASSWORD'), SALT_ROUNDS);
    const hashMhs   = await bcrypt.hash(mustGet('SEED_MHS_PASSWORD'), SALT_ROUNDS);

    // ---- users ----
    await conn.query(`INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
      (1, 'Administrator', 'admin@asinetkw.ac.id', ?, 'admin', '2024-01-01'),
      (2, 'Dr. Budi Santoso', 'dosen1@asinetkw.ac.id', ?, 'dosen', '2024-01-02'),
      (3, 'Siti Rahayu, M.Kom', 'dosen2@asinetkw.ac.id', ?, 'dosen', '2024-01-02'),
      (4, 'Ahmad Fauzi', 'mahasiswa1@asinetkw.ac.id', ?, 'mahasiswa', '2024-01-03'),
      (5, 'Dewi Lestari', 'mahasiswa2@asinetkw.ac.id', ?, 'mahasiswa', '2024-01-03')`,
      [hashAdmin, hashDosen, hashDosen, hashMhs, hashMhs]
    );
    console.log('Users selesai.');

    // ---- mahasiswa ----
    await conn.query(`INSERT INTO mahasiswa (id, nim, nama, email, prodi, kelas, semester, status, user_id) VALUES
      (1,  '2021001', 'Ahmad Fauzi',        'mahasiswa1@asinetkw.ac.id', 'Teknik Informatika',    'TI-A', 5, 'Aktif', 4),
      (2,  '2021002', 'Dewi Lestari',       'mahasiswa2@asinetkw.ac.id', 'Teknik Informatika',    'TI-A', 5, 'Aktif', 5),
      (3,  '2021003', 'Rizky Pratama',      'rizky@asinetkw.ac.id',      'Sistem Informasi',      'SI-B', 3, 'Aktif', NULL),
      (4,  '2021004', 'Nur Indah Sari',     'nurindah@asinetkw.ac.id',   'Teknik Informatika',    'TI-A', 5, 'Aktif', NULL),
      (5,  '2021005', 'Bagas Wicaksono',    'bagas@asinetkw.ac.id',      'Sistem Informasi',      'SI-A', 3, 'Aktif', NULL),
      (6,  '2020001', 'Putri Handayani',    'putri@asinetkw.ac.id',      'Teknik Informatika',    'TI-B', 7, 'Aktif', NULL),
      (7,  '2020002', 'Dian Aditya',        'dian@asinetkw.ac.id',       'Manajemen Informatika', 'MI-A', 7, 'Cuti',  NULL),
      (8,  '2022001', 'Farah Nabila',       'farah@asinetkw.ac.id',      'Teknik Informatika',    'TI-A', 3, 'Aktif', NULL),
      (9,  '2022002', 'Kevin Anggara',      'kevin@asinetkw.ac.id',      'Sistem Informasi',      'SI-A', 1, 'Aktif', NULL),
      (10, '2022003', 'Maya Sari',          'maya@asinetkw.ac.id',       'Teknik Informatika',    'TI-B', 1, 'Aktif', NULL)`
    );
    console.log('Mahasiswa selesai.');

    // ---- dosen ----
    await conn.query(`INSERT INTO dosen (id, nidn, nama, email, prodi, no_hp, status, user_id) VALUES
      (1, '0001010101', 'Dr. Budi Santoso',       'dosen1@asinetkw.ac.id', 'Teknik Informatika',    '081234567890', 'Aktif',    2),
      (2, '0002020202', 'Siti Rahayu, M.Kom',     'dosen2@asinetkw.ac.id', 'Sistem Informasi',      '082345678901', 'Aktif',    3),
      (3, '0003030303', 'Prof. Hendra Wijaya',    'hendra@asinetkw.ac.id', 'Teknik Informatika',    '083456789012', 'Aktif',    NULL),
      (4, '0004040404', 'Rina Kusuma, M.T',       'rina@asinetkw.ac.id',   'Manajemen Informatika', '084567890123', 'Aktif',    NULL),
      (5, '0005050505', 'Anton Sugiarto, M.Cs',   'anton@asinetkw.ac.id',  'Sistem Informasi',      '085678901234', 'Non-Aktif', NULL)`
    );
    console.log('Dosen selesai.');

    // ---- mata_kuliah ----
    await conn.query(`INSERT INTO mata_kuliah (id, kode_mk, nama_mk, sks, semester, prodi) VALUES
      (1, 'TI101', 'Algoritma & Pemrograman',      4, 1, 'Teknik Informatika'),
      (2, 'TI201', 'Struktur Data',                3, 3, 'Teknik Informatika'),
      (3, 'TI301', 'Rekayasa Perangkat Lunak',     3, 5, 'Teknik Informatika'),
      (4, 'TI302', 'Basis Data',                   4, 5, 'Teknik Informatika'),
      (5, 'SI101', 'Sistem Informasi Manajemen',   3, 1, 'Sistem Informasi'),
      (6, 'SI201', 'Analisis Sistem Informasi',    3, 3, 'Sistem Informasi'),
      (7, 'MI101', 'Manajemen Proyek TI',          2, 5, 'Manajemen Informatika'),
      (8, 'TI401', 'Keamanan Jaringan',            3, 7, 'Teknik Informatika')`
    );
    console.log('Mata kuliah selesai.');

    // ---- ruangan ----
    await conn.query(`INSERT INTO ruangan (id, kode_ruangan, nama_ruangan, kapasitas, lokasi, status) VALUES
      (1, 'R101', 'Ruang Kelas A1',  40,  'Gedung A Lantai 1', 'Tersedia'),
      (2, 'R102', 'Ruang Kelas A2',  40,  'Gedung A Lantai 1', 'Tersedia'),
      (3, 'R201', 'Lab Komputer 1',  30,  'Gedung B Lantai 2', 'Tersedia'),
      (4, 'R202', 'Lab Komputer 2',  30,  'Gedung B Lantai 2', 'Dalam Perbaikan'),
      (5, 'R301', 'Aula Utama',      200, 'Gedung C Lantai 1', 'Tersedia'),
      (6, 'R302', 'Ruang Seminar',   80,  'Gedung C Lantai 2', 'Tersedia')`
    );
    console.log('Ruangan selesai.');

    // ---- jadwal ----
    await conn.query(`INSERT INTO jadwal (id, mata_kuliah_id, dosen_id, kelas, ruangan_id, hari, jam_mulai, jam_selesai) VALUES
      (1, 3, 1, 'TI-A', 1, 'Senin',  '08:00', '10:30'),
      (2, 4, 1, 'TI-A', 3, 'Rabu',   '10:00', '13:00'),
      (3, 6, 2, 'SI-B', 2, 'Selasa', '08:00', '10:30'),
      (4, 5, 2, 'SI-A', 2, 'Kamis',  '13:00', '15:30'),
      (5, 1, 3, 'TI-A', 1, 'Jumat',  '08:00', '11:40'),
      (6, 8, 3, 'TI-B', 2, 'Senin',  '13:00', '15:30'),
      (7, 7, 4, 'MI-A', 6, 'Rabu',   '08:00', '09:40'),
      (8, 2, 1, 'TI-B', 3, 'Selasa', '13:00', '15:30')`
    );
    console.log('Jadwal selesai.');

    // ---- absensi ----
    await conn.query(`INSERT INTO absensi (id, jadwal_id, mahasiswa_id, tanggal, pertemuan_ke, status_absensi, keterangan, created_at) VALUES
      (1,  1, 1, '2024-09-02', 1, 'Hadir', '',                      '2024-09-02'),
      (2,  1, 2, '2024-09-02', 1, 'Hadir', '',                      '2024-09-02'),
      (3,  1, 4, '2024-09-02', 1, 'Izin',  'Ada keperluan keluarga','2024-09-02'),
      (4,  1, 1, '2024-09-09', 2, 'Hadir', '',                      '2024-09-09'),
      (5,  1, 2, '2024-09-09', 2, 'Sakit', 'Demam',                 '2024-09-09'),
      (6,  1, 4, '2024-09-09', 2, 'Hadir', '',                      '2024-09-09'),
      (7,  2, 1, '2024-09-04', 1, 'Hadir', '',                      '2024-09-04'),
      (8,  2, 2, '2024-09-04', 1, 'Alpha', '',                      '2024-09-04'),
      (9,  3, 3, '2024-09-03', 1, 'Hadir', '',                      '2024-09-03'),
      (10, 4, 5, '2024-09-05', 1, 'Hadir', '',                      '2024-09-05')`
    );
    console.log('Absensi selesai.');

    console.log('\n✅ Seed data berhasil dimasukkan!');
  } catch (err) {
    console.error('❌ Error saat seeding:', err.message);
    throw err;
  } finally {
    await conn.end();
  }
}

seed().catch(() => process.exit(1));
