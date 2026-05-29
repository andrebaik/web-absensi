const pool = require('../config/db');

function statusKey(s) {
  return String(s).toLowerCase();
}

exports.getAll = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.*,
            j.kelas,
            m.nim, m.nama AS mahasiswa_nama,
            u.nama AS dosen_nama,
            mk.nama_mk
     FROM absensi a
     JOIN jadwal j ON j.id = a.jadwal_id
     JOIN mahasiswa m ON m.id = a.mahasiswa_id
     JOIN dosen u ON u.id = j.dosen_id
     JOIN mata_kuliah mk ON mk.id = j.mata_kuliah_id
     ORDER BY a.id DESC`
  );
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM absensi WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Absensi tidak ditemukan' });
  res.json(rows[0]);
};

exports.getByMahasiswa = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.*,
            j.kelas,
            j.hari,
            mk.nama_mk,
            mk.kode_mk,
            r.kode_ruangan,
            r.nama_ruangan
     FROM absensi a
     JOIN jadwal j ON j.id = a.jadwal_id
     JOIN mata_kuliah mk ON mk.id = j.mata_kuliah_id
     JOIN ruangan r ON r.id = j.ruangan_id
     WHERE a.mahasiswa_id = ?
     ORDER BY a.id DESC`,
    [req.params.mahasiswaId]
  );
  res.json(rows);
};

exports.getByJadwal = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.*
     FROM absensi a
     WHERE a.jadwal_id = ?
     ORDER BY a.id DESC`,
    [req.params.jadwalId]
  );
  res.json(rows);
};

exports.getByJadwalAndPertemuan = async (req, res) => {
  const { jadwalId, pertemuan } = req.params;
  const [rows] = await pool.query(
    `SELECT *
     FROM absensi a
     WHERE a.jadwal_id = ? AND a.pertemuan_ke = ?
     ORDER BY a.id DESC`,
    [jadwalId, pertemuan]
  );
  res.json(rows);
};

exports.getRekapByMahasiswa = async (req, res) => {
  const { mahasiswaId } = req.params;

  const [records] = await pool.query(
    `SELECT a.status_absensi,
            a.pertemuan_ke,
            j.mata_kuliah_id
     FROM absensi a
     JOIN jadwal j ON j.id = a.jadwal_id
     WHERE a.mahasiswa_id = ?`,
    [mahasiswaId]
  );

  const [mks] = await pool.query('SELECT id, nama_mk FROM mata_kuliah');
  const mkMap = new Map(mks.map(m => [m.id, m.nama_mk]));

  const grouped = {};
  for (const a of records) {
    const key = a.mata_kuliah_id;
    if (!grouped[key]) {
      grouped[key] = { mata_kuliah: mkMap.get(key) || '-', hadir: 0, izin: 0, sakit: 0, alpha: 0, total: 0 };
    }

    const k = statusKey(a.status_absensi);
    if (k === 'hadir') grouped[key].hadir++;
    else if (k === 'izin') grouped[key].izin++;
    else if (k === 'sakit') grouped[key].sakit++;
    else if (k === 'alpha') grouped[key].alpha++;

    grouped[key].total++;
  }

  const out = Object.values(grouped).map(r => ({
    ...r,
    persentase: r.total ? Math.round((r.hadir / r.total) * 100) : 0,
  }));

  res.json(out);
};

exports.getRekapAdmin = async (req, res) => {
  // ambil rekap per mahasiswa + mata kuliah dan sertakan nim/nama mahasiswa
  const [rows] = await pool.query(`
    SELECT a.mahasiswa_id,
           m.nim AS mahasiswa_nim,
           m.nama AS mahasiswa_nama,
           j.mata_kuliah_id,
           a.status_absensi
    FROM absensi a
    JOIN jadwal j ON j.id = a.jadwal_id
    JOIN mahasiswa m ON m.id = a.mahasiswa_id
  `);


  // kompatibel dengan frontend yang biasanya pakai rekapan agregat per mahasiswa
  const grouped = {};
  for (const r of rows) {
    const key = `${r.mahasiswa_id}:${r.mata_kuliah_id}`;
    if (!grouped[key]) {
      grouped[key] = { mahasiswa_id: r.mahasiswa_id, mata_kuliah_id: r.mata_kuliah_id, hadir: 0, izin: 0, sakit: 0, alpha: 0, total: 0 };
    }
    const k = statusKey(r.status_absensi);
    if (k === 'hadir') grouped[key].hadir++;
    else if (k === 'izin') grouped[key].izin++;
    else if (k === 'sakit') grouped[key].sakit++;
    else if (k === 'alpha') grouped[key].alpha++;
    grouped[key].total++;
  }

  const [mks] = await pool.query('SELECT id, nama_mk FROM mata_kuliah');
  const mkMap = new Map(mks.map(m => [m.id, m.nama_mk]));

  const out = Object.values(grouped).map(g => ({
    mata_kuliah_id: g.mata_kuliah_id,
    mata_kuliah: mkMap.get(g.mata_kuliah_id) || '-',
    mahasiswa_id: g.mahasiswa_id,
    hadir: g.hadir,
    izin: g.izin,
    sakit: g.sakit,
    alpha: g.alpha,
    total: g.total,
    persentase: g.total ? Math.round((g.hadir / g.total) * 100) : 0,
  }));

  res.json(out);
};

exports.getRekapDosen = async (req, res) => {
  const { dosenId } = req.params;

  const [rows] = await pool.query(
    `SELECT a.status_absensi,
            j.mata_kuliah_id,
            a.mahasiswa_id
     FROM absensi a
     JOIN jadwal j ON j.id = a.jadwal_id
     WHERE j.dosen_id = ?`,
    [dosenId]
  );

  const [mks] = await pool.query('SELECT id, nama_mk FROM mata_kuliah');
  const mkMap = new Map(mks.map(m => [m.id, m.nama_mk]));

  const grouped = {};
  for (const r of rows) {
    const key = r.mata_kuliah_id;
    if (!grouped[key]) {
      grouped[key] = { mata_kuliah: mkMap.get(key) || '-', hadir: 0, izin: 0, sakit: 0, alpha: 0, total: 0 };
    }
    const k = statusKey(r.status_absensi);
    if (k === 'hadir') grouped[key].hadir++;
    else if (k === 'izin') grouped[key].izin++;
    else if (k === 'sakit') grouped[key].sakit++;
    else if (k === 'alpha') grouped[key].alpha++;
    grouped[key].total++;
  }

  const out = Object.values(grouped).map(r => ({
    ...r,
    persentase: r.total ? Math.round((r.hadir / r.total) * 100) : 0,
  }));

  res.json(out);
};

exports.create = async (req, res) => {
  const { jadwal_id, mahasiswa_id, tanggal, pertemuan_ke, status_absensi, keterangan } = req.body || {};

  if (!jadwal_id || !mahasiswa_id || !tanggal || pertemuan_ke == null || !status_absensi) {
    return res.status(400).json({ message: 'jadwal_id, mahasiswa_id, tanggal, pertemuan_ke, status_absensi wajib diisi' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO absensi (jadwal_id, mahasiswa_id, tanggal, pertemuan_ke, status_absensi, keterangan, created_at)
       VALUES (?, ?, ?, ?, ?, ?, CURDATE())`,
      [jadwal_id, mahasiswa_id, tanggal, pertemuan_ke, status_absensi, keterangan ?? null]
    );

    const [rows] = await pool.query('SELECT * FROM absensi WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    // handle duplicate unique key
    res.status(500).json({ message: 'Gagal membuat absensi', error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { status_absensi, keterangan, tanggal, pertemuan_ke, jadwal_id, mahasiswa_id } = req.body || {};

  const [exist] = await pool.query('SELECT * FROM absensi WHERE id = ?', [id]);
  if (!exist.length) return res.status(404).json({ message: 'Absensi tidak ditemukan' });

  try {
    await pool.query(
      `UPDATE absensi
       SET jadwal_id = ?, mahasiswa_id = ?, tanggal = ?, pertemuan_ke = ?, status_absensi = ?, keterangan = ?
       WHERE id = ?`,
      [jadwal_id ?? exist[0].jadwal_id, mahasiswa_id ?? exist[0].mahasiswa_id, tanggal ?? exist[0].tanggal, pertemuan_ke ?? exist[0].pertemuan_ke, status_absensi ?? exist[0].status_absensi, keterangan ?? exist[0].keterangan, id]
    );

    const [rows] = await pool.query('SELECT * FROM absensi WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Gagal update absensi', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM absensi WHERE id = ?', [id]);
  res.json({ message: 'Absensi dihapus' });
};

