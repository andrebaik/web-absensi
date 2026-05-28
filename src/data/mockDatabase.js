// ============================================================
// ASINETKW - Mock Database (localStorage-backed)
// Ganti fungsi ini dengan API calls untuk koneksi ke Supabase/MySQL
// ============================================================

const DB_KEY = 'asinetkw_db';

const initialData = {
  users: [
    { id: 1, name: 'Administrator', email: 'admin@asinetkw.ac.id', password: 'admin123', role: 'admin', created_at: '2024-01-01' },
    { id: 2, name: 'Dr. Budi Santoso', email: 'dosen1@asinetkw.ac.id', password: 'dosen123', role: 'dosen', created_at: '2024-01-02' },
    { id: 3, name: 'Siti Rahayu, M.Kom', email: 'dosen2@asinetkw.ac.id', password: 'dosen123', role: 'dosen', created_at: '2024-01-02' },
    { id: 4, name: 'Ahmad Fauzi', email: 'mahasiswa1@asinetkw.ac.id', password: 'mhs123', role: 'mahasiswa', created_at: '2024-01-03' },
    { id: 5, name: 'Dewi Lestari', email: 'mahasiswa2@asinetkw.ac.id', password: 'mhs123', role: 'mahasiswa', created_at: '2024-01-03' },
  ],
  mahasiswa: [
    { id: 1, nim: '2021001', nama: 'Ahmad Fauzi', email: 'mahasiswa1@asinetkw.ac.id', prodi: 'Teknik Informatika', kelas: 'TI-A', semester: 5, status: 'Aktif', user_id: 4 },
    { id: 2, nim: '2021002', nama: 'Dewi Lestari', email: 'mahasiswa2@asinetkw.ac.id', prodi: 'Teknik Informatika', kelas: 'TI-A', semester: 5, status: 'Aktif', user_id: 5 },
    { id: 3, nim: '2021003', nama: 'Rizky Pratama', email: 'rizky@asinetkw.ac.id', prodi: 'Sistem Informasi', kelas: 'SI-B', semester: 3, status: 'Aktif', user_id: null },
    { id: 4, nim: '2021004', nama: 'Nur Indah Sari', email: 'nurindah@asinetkw.ac.id', prodi: 'Teknik Informatika', kelas: 'TI-A', semester: 5, status: 'Aktif', user_id: null },
    { id: 5, nim: '2021005', nama: 'Bagas Wicaksono', email: 'bagas@asinetkw.ac.id', prodi: 'Sistem Informasi', kelas: 'SI-A', semester: 3, status: 'Aktif', user_id: null },
    { id: 6, nim: '2020001', nama: 'Putri Handayani', email: 'putri@asinetkw.ac.id', prodi: 'Teknik Informatika', kelas: 'TI-B', semester: 7, status: 'Aktif', user_id: null },
    { id: 7, nim: '2020002', nama: 'Dian Aditya', email: 'dian@asinetkw.ac.id', prodi: 'Manajemen Informatika', kelas: 'MI-A', semester: 7, status: 'Cuti', user_id: null },
    { id: 8, nim: '2022001', nama: 'Farah Nabila', email: 'farah@asinetkw.ac.id', prodi: 'Teknik Informatika', kelas: 'TI-A', semester: 3, status: 'Aktif', user_id: null },
    { id: 9, nim: '2022002', nama: 'Kevin Anggara', email: 'kevin@asinetkw.ac.id', prodi: 'Sistem Informasi', kelas: 'SI-A', semester: 1, status: 'Aktif', user_id: null },
    { id: 10, nim: '2022003', nama: 'Maya Sari', email: 'maya@asinetkw.ac.id', prodi: 'Teknik Informatika', kelas: 'TI-B', semester: 1, status: 'Aktif', user_id: null },
  ],
  dosen: [
    { id: 1, nidn: '0001010101', nama: 'Dr. Budi Santoso', email: 'dosen1@asinetkw.ac.id', prodi: 'Teknik Informatika', no_hp: '081234567890', status: 'Aktif', user_id: 2 },
    { id: 2, nidn: '0002020202', nama: 'Siti Rahayu, M.Kom', email: 'dosen2@asinetkw.ac.id', prodi: 'Sistem Informasi', no_hp: '082345678901', status: 'Aktif', user_id: 3 },
    { id: 3, nidn: '0003030303', nama: 'Prof. Hendra Wijaya', email: 'hendra@asinetkw.ac.id', prodi: 'Teknik Informatika', no_hp: '083456789012', status: 'Aktif', user_id: null },
    { id: 4, nidn: '0004040404', nama: 'Rina Kusuma, M.T', email: 'rina@asinetkw.ac.id', prodi: 'Manajemen Informatika', no_hp: '084567890123', status: 'Aktif', user_id: null },
    { id: 5, nidn: '0005050505', nama: 'Anton Sugiarto, M.Cs', email: 'anton@asinetkw.ac.id', prodi: 'Sistem Informasi', no_hp: '085678901234', status: 'Non-Aktif', user_id: null },
  ],
  mata_kuliah: [
    { id: 1, kode_mk: 'TI101', nama_mk: 'Algoritma & Pemrograman', sks: 4, semester: 1, prodi: 'Teknik Informatika' },
    { id: 2, kode_mk: 'TI201', nama_mk: 'Struktur Data', sks: 3, semester: 3, prodi: 'Teknik Informatika' },
    { id: 3, kode_mk: 'TI301', nama_mk: 'Rekayasa Perangkat Lunak', sks: 3, semester: 5, prodi: 'Teknik Informatika' },
    { id: 4, kode_mk: 'TI302', nama_mk: 'Basis Data', sks: 4, semester: 5, prodi: 'Teknik Informatika' },
    { id: 5, kode_mk: 'SI101', nama_mk: 'Sistem Informasi Manajemen', sks: 3, semester: 1, prodi: 'Sistem Informasi' },
    { id: 6, kode_mk: 'SI201', nama_mk: 'Analisis Sistem Informasi', sks: 3, semester: 3, prodi: 'Sistem Informasi' },
    { id: 7, kode_mk: 'MI101', nama_mk: 'Manajemen Proyek TI', sks: 2, semester: 5, prodi: 'Manajemen Informatika' },
    { id: 8, kode_mk: 'TI401', nama_mk: 'Keamanan Jaringan', sks: 3, semester: 7, prodi: 'Teknik Informatika' },
  ],
  ruangan: [
    { id: 1, kode_ruangan: 'R101', nama_ruangan: 'Ruang Kelas A1', kapasitas: 40, lokasi: 'Gedung A Lantai 1', status: 'Tersedia' },
    { id: 2, kode_ruangan: 'R102', nama_ruangan: 'Ruang Kelas A2', kapasitas: 40, lokasi: 'Gedung A Lantai 1', status: 'Tersedia' },
    { id: 3, kode_ruangan: 'R201', nama_ruangan: 'Lab Komputer 1', kapasitas: 30, lokasi: 'Gedung B Lantai 2', status: 'Tersedia' },
    { id: 4, kode_ruangan: 'R202', nama_ruangan: 'Lab Komputer 2', kapasitas: 30, lokasi: 'Gedung B Lantai 2', status: 'Dalam Perbaikan' },
    { id: 5, kode_ruangan: 'R301', nama_ruangan: 'Aula Utama', kapasitas: 200, lokasi: 'Gedung C Lantai 1', status: 'Tersedia' },
    { id: 6, kode_ruangan: 'R302', nama_ruangan: 'Ruang Seminar', kapasitas: 80, lokasi: 'Gedung C Lantai 2', status: 'Tersedia' },
  ],
  jadwal: [
    { id: 1, mata_kuliah_id: 3, dosen_id: 1, kelas: 'TI-A', ruangan_id: 1, hari: 'Senin', jam_mulai: '08:00', jam_selesai: '10:30' },
    { id: 2, mata_kuliah_id: 4, dosen_id: 1, kelas: 'TI-A', ruangan_id: 3, hari: 'Rabu', jam_mulai: '10:00', jam_selesai: '13:00' },
    { id: 3, mata_kuliah_id: 6, dosen_id: 2, kelas: 'SI-B', ruangan_id: 2, hari: 'Selasa', jam_mulai: '08:00', jam_selesai: '10:30' },
    { id: 4, mata_kuliah_id: 5, dosen_id: 2, kelas: 'SI-A', ruangan_id: 2, hari: 'Kamis', jam_mulai: '13:00', jam_selesai: '15:30' },
    { id: 5, mata_kuliah_id: 1, dosen_id: 3, kelas: 'TI-A', ruangan_id: 1, hari: 'Jumat', jam_mulai: '08:00', jam_selesai: '11:40' },
    { id: 6, mata_kuliah_id: 8, dosen_id: 3, kelas: 'TI-B', ruangan_id: 2, hari: 'Senin', jam_mulai: '13:00', jam_selesai: '15:30' },
    { id: 7, mata_kuliah_id: 7, dosen_id: 4, kelas: 'MI-A', ruangan_id: 6, hari: 'Rabu', jam_mulai: '08:00', jam_selesai: '09:40' },
    { id: 8, mata_kuliah_id: 2, dosen_id: 1, kelas: 'TI-B', ruangan_id: 3, hari: 'Selasa', jam_mulai: '13:00', jam_selesai: '15:30' },
  ],
  absensi: [
    { id: 1, jadwal_id: 1, mahasiswa_id: 1, tanggal: '2024-09-02', pertemuan_ke: 1, status_absensi: 'Hadir', keterangan: '', created_at: '2024-09-02' },
    { id: 2, jadwal_id: 1, mahasiswa_id: 2, tanggal: '2024-09-02', pertemuan_ke: 1, status_absensi: 'Hadir', keterangan: '', created_at: '2024-09-02' },
    { id: 3, jadwal_id: 1, mahasiswa_id: 4, tanggal: '2024-09-02', pertemuan_ke: 1, status_absensi: 'Izin', keterangan: 'Ada keperluan keluarga', created_at: '2024-09-02' },
    { id: 4, jadwal_id: 1, mahasiswa_id: 1, tanggal: '2024-09-09', pertemuan_ke: 2, status_absensi: 'Hadir', keterangan: '', created_at: '2024-09-09' },
    { id: 5, jadwal_id: 1, mahasiswa_id: 2, tanggal: '2024-09-09', pertemuan_ke: 2, status_absensi: 'Sakit', keterangan: 'Demam', created_at: '2024-09-09' },
    { id: 6, jadwal_id: 1, mahasiswa_id: 4, tanggal: '2024-09-09', pertemuan_ke: 2, status_absensi: 'Hadir', keterangan: '', created_at: '2024-09-09' },
    { id: 7, jadwal_id: 2, mahasiswa_id: 1, tanggal: '2024-09-04', pertemuan_ke: 1, status_absensi: 'Hadir', keterangan: '', created_at: '2024-09-04' },
    { id: 8, jadwal_id: 2, mahasiswa_id: 2, tanggal: '2024-09-04', pertemuan_ke: 1, status_absensi: 'Alpha', keterangan: '', created_at: '2024-09-04' },
    { id: 9, jadwal_id: 3, mahasiswa_id: 3, tanggal: '2024-09-03', pertemuan_ke: 1, status_absensi: 'Hadir', keterangan: '', created_at: '2024-09-03' },
    { id: 10, jadwal_id: 4, mahasiswa_id: 5, tanggal: '2024-09-05', pertemuan_ke: 1, status_absensi: 'Hadir', keterangan: '', created_at: '2024-09-05' },
  ],
  backup_log: [],
  _nextId: { users: 6, mahasiswa: 11, dosen: 6, mata_kuliah: 9, ruangan: 7, jadwal: 9, absensi: 11, backup_log: 1 },
};

// ---- Utility Functions ----
function getDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function initDB() {
  if (!getDB()) saveDB(initialData);
}

export function resetDB() {
  saveDB(initialData);
}

function db() {
  return getDB() || initialData;
}

function nextId(table) {
  const d = db();
  const id = d._nextId[table];
  d._nextId[table] = id + 1;
  saveDB(d);
  return id;
}

// ---- Generic CRUD ----
function getAll(table) { return db()[table] || []; }

function getById(table, id) { return getAll(table).find(r => r.id === id) || null; }

function create(table, data) {
  const d = db();
  const id = nextId(table);
  const record = { ...data, id };
  d[table].push(record);
  saveDB(d);
  return record;
}

function update(table, id, data) {
  const d = db();
  const idx = d[table].findIndex(r => r.id === id);
  if (idx === -1) return null;
  d[table][idx] = { ...d[table][idx], ...data, id };
  saveDB(d);
  return d[table][idx];
}

function remove(table, id) {
  const d = db();
  const idx = d[table].findIndex(r => r.id === id);
  if (idx === -1) return false;
  d[table].splice(idx, 1);
  saveDB(d);
  return true;
}

// ---- Auth ----
export const authDB = {
  login(email, password) {
    const user = getAll('users').find(u => u.email === email && u.password === password);
    return user || null;
  },
  findByEmail(email) {
    return getAll('users').find(u => u.email === email) || null;
  },
};

// ---- Users ----
export const usersDB = {
  getAll: () => getAll('users'),
  getById: (id) => getById('users', id),
  create: (data) => create('users', { ...data, created_at: new Date().toISOString().split('T')[0] }),
  update: (id, data) => update('users', id, data),
  delete: (id) => remove('users', id),
};

// ---- Mahasiswa ----
export const mahasiswaDB = {
  getAll: () => getAll('mahasiswa'),
  getById: (id) => getById('mahasiswa', id),
  getByUserId: (uid) => getAll('mahasiswa').find(m => m.user_id === uid) || null,
  create: (data) => create('mahasiswa', data),
  update: (id, data) => update('mahasiswa', id, data),
  delete: (id) => remove('mahasiswa', id),
};

// ---- Dosen ----
export const dosenDB = {
  getAll: () => getAll('dosen'),
  getById: (id) => getById('dosen', id),
  getByUserId: (uid) => getAll('dosen').find(d => d.user_id === uid) || null,
  create: (data) => create('dosen', data),
  update: (id, data) => update('dosen', id, data),
  delete: (id) => remove('dosen', id),
};

// ---- Mata Kuliah ----
export const mataKuliahDB = {
  getAll: () => getAll('mata_kuliah'),
  getById: (id) => getById('mata_kuliah', id),
  create: (data) => create('mata_kuliah', data),
  update: (id, data) => update('mata_kuliah', id, data),
  delete: (id) => remove('mata_kuliah', id),
};

// ---- Ruangan ----
export const ruanganDB = {
  getAll: () => getAll('ruangan'),
  getById: (id) => getById('ruangan', id),
  create: (data) => create('ruangan', data),
  update: (id, data) => update('ruangan', id, data),
  delete: (id) => remove('ruangan', id),
};

// ---- Jadwal ----
export const jadwalDB = {
  getAll: () => getAll('jadwal'),
  getById: (id) => getById('jadwal', id),
  getByDosen: (dosenId) => getAll('jadwal').filter(j => j.dosen_id === dosenId),
  getByKelas: (kelas) => getAll('jadwal').filter(j => j.kelas === kelas),
  checkConflict(data, excludeId = null) {
    const all = getAll('jadwal').filter(j => j.id !== excludeId);
    return all.filter(j => {
      if (j.hari !== data.hari) return false;
      const newStart = data.jam_mulai, newEnd = data.jam_selesai;
      const exStart = j.jam_mulai, exEnd = j.jam_selesai;
      const overlap = newStart < exEnd && newEnd > exStart;
      if (!overlap) return false;
      return j.dosen_id === data.dosen_id || j.ruangan_id === data.ruangan_id || j.kelas === data.kelas;
    });
  },
  create(data) {
    const conflicts = jadwalDB.checkConflict(data);
    if (conflicts.length > 0) return { error: true, conflicts };
    return { data: create('jadwal', data) };
  },
  update(id, data) {
    const conflicts = jadwalDB.checkConflict(data, id);
    if (conflicts.length > 0) return { error: true, conflicts };
    return { data: update('jadwal', id, data) };
  },
  delete: (id) => remove('jadwal', id),
};

// ---- Absensi ----
export const absensiDB = {
  getAll: () => getAll('absensi'),
  getById: (id) => getById('absensi', id),
  getByMahasiswa: (mahasiswaId) => getAll('absensi').filter(a => a.mahasiswa_id === mahasiswaId),
  getByJadwal: (jadwalId) => getAll('absensi').filter(a => a.jadwal_id === jadwalId),
  getByJadwalAndPertemuan: (jadwalId, pertemuan) =>
    getAll('absensi').filter(a => a.jadwal_id === jadwalId && a.pertemuan_ke === pertemuan),
  create: (data) => create('absensi', { ...data, created_at: new Date().toISOString().split('T')[0] }),
  update: (id, data) => update('absensi', id, data),
  delete: (id) => remove('absensi', id),
  getRekapByMahasiswa(mahasiswaId) {
    const records = absensiDB.getByMahasiswa(mahasiswaId);
    const jadwalList = getAll('jadwal');
    const mkList = getAll('mata_kuliah');
    const grouped = {};
    records.forEach(a => {
      const jadwal = jadwalList.find(j => j.id === a.jadwal_id);
      if (!jadwal) return;
      const mk = mkList.find(m => m.id === jadwal.mata_kuliah_id);
      const key = jadwal.mata_kuliah_id;
      if (!grouped[key]) {
        grouped[key] = { mata_kuliah: mk?.nama_mk || '-', hadir: 0, izin: 0, sakit: 0, alpha: 0, total: 0 };
      }
      grouped[key][a.status_absensi.toLowerCase()]++;
      grouped[key].total++;
    });
    return Object.values(grouped).map(r => ({
      ...r,
      persentase: r.total ? Math.round((r.hadir / r.total) * 100) : 0,
    }));
  },
};

// ---- Backup Log ----
export const backupLogDB = {
  getAll: () => getAll('backup_log'),
  create: (data) => create('backup_log', { ...data, tanggal_backup: new Date().toISOString().split('T')[0] }),
};
