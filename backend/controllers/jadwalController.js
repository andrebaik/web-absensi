const pool = require('../config/db');

function timeToMinutes(t) {
  // t: '08:00:00' atau '08:00'
  const s = String(t).slice(0,5);
  const [hh, mm] = s.split(':').map(Number);
  return hh * 60 + mm;
}

exports.getAll = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT j.*,
            mk.kode_mk, mk.nama_mk,
            d.nidn, d.nama AS dosen_nama,
            r.kode_ruangan, r.nama_ruangan
     FROM jadwal j
     JOIN mata_kuliah mk ON mk.id = j.mata_kuliah_id
     JOIN dosen d ON d.id = j.dosen_id
     JOIN ruangan r ON r.id = j.ruangan_id
     ORDER BY j.id DESC`
  );
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT j.*,
            mk.kode_mk, mk.nama_mk,
            d.nidn, d.nama AS dosen_nama,
            r.kode_ruangan, r.nama_ruangan
     FROM jadwal j
     JOIN mata_kuliah mk ON mk.id = j.mata_kuliah_id
     JOIN dosen d ON d.id = j.dosen_id
     JOIN ruangan r ON r.id = j.ruangan_id
     WHERE j.id = ?`,
    [req.params.id]
  );

  if (!rows.length) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
  res.json(rows[0]);
};

exports.getByDosen = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT j.*,
            mk.kode_mk, mk.nama_mk,
            d.nidn, d.nama AS dosen_nama,
            r.kode_ruangan, r.nama_ruangan
     FROM jadwal j
     JOIN mata_kuliah mk ON mk.id = j.mata_kuliah_id
     JOIN dosen d ON d.id = j.dosen_id
     JOIN ruangan r ON r.id = j.ruangan_id
     WHERE j.dosen_id = ?
     ORDER BY j.id DESC`,
    [req.params.dosenId]
  );
  res.json(rows);
};

exports.getByKelas = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT j.*,
            mk.kode_mk, mk.nama_mk,
            d.nidn, d.nama AS dosen_nama,
            r.kode_ruangan, r.nama_ruangan
     FROM jadwal j
     JOIN mata_kuliah mk ON mk.id = j.mata_kuliah_id
     JOIN dosen d ON d.id = j.dosen_id
     JOIN ruangan r ON r.id = j.ruangan_id
     WHERE j.kelas = ?
     ORDER BY j.id DESC`,
    [req.params.kelas]
  );
  res.json(rows);
};

async function findConflict({ hari, jam_mulai, jam_selesai, dosen_id, ruangan_id, kelas, excludeId = null }) {
  const newStart = timeToMinutes(jam_mulai);
  const newEnd = timeToMinutes(jam_selesai);

  const params = [hari];
  let q = `SELECT * FROM jadwal WHERE hari = ?`;
  if (excludeId) {
    q += ` AND id != ?`;
    params.push(excludeId);
  }

  const [rows] = await pool.query(q, params);

  return rows.filter(j => {
    const exStart = timeToMinutes(j.jam_mulai);
    const exEnd = timeToMinutes(j.jam_selesai);
    const overlap = newStart < exEnd && newEnd > exStart;
    if (!overlap) return false;
    return (
      j.dosen_id === dosen_id ||
      j.ruangan_id === ruangan_id ||
      j.kelas === kelas
    );
  });
}

exports.create = async (req, res) => {
  const { mata_kuliah_id, dosen_id, kelas, ruangan_id, hari, jam_mulai, jam_selesai } = req.body || {};

  if (!mata_kuliah_id || !dosen_id || !kelas || !ruangan_id || !hari || !jam_mulai || !jam_selesai) {
    return res.status(400).json({ message: 'mata_kuliah_id, dosen_id, kelas, ruangan_id, hari, jam_mulai, jam_selesai wajib diisi' });
  }

  try {
    const conflicts = await findConflict({ hari, jam_mulai, jam_selesai, dosen_id, ruangan_id, kelas });
    if (conflicts.length) return res.status(409).json({ error: true, conflicts });

    const [result] = await pool.query(
      `INSERT INTO jadwal (mata_kuliah_id, dosen_id, kelas, ruangan_id, hari, jam_mulai, jam_selesai)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [mata_kuliah_id, dosen_id, kelas, ruangan_id, hari, jam_mulai, jam_selesai]
    );

    const [rows] = await pool.query('SELECT * FROM jadwal WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat jadwal', error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { mata_kuliah_id, dosen_id, kelas, ruangan_id, hari, jam_mulai, jam_selesai } = req.body || {};

  const [exist] = await pool.query('SELECT * FROM jadwal WHERE id = ?', [id]);
  if (!exist.length) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });

  const payload = {
    mata_kuliah_id: mata_kuliah_id ?? exist[0].mata_kuliah_id,
    dosen_id: dosen_id ?? exist[0].dosen_id,
    kelas: kelas ?? exist[0].kelas,
    ruangan_id: ruangan_id ?? exist[0].ruangan_id,
    hari: hari ?? exist[0].hari,
    jam_mulai: jam_mulai ?? exist[0].jam_mulai,
    jam_selesai: jam_selesai ?? exist[0].jam_selesai,
  };

  try {
    const conflicts = await findConflict({ ...payload, excludeId: id });
    if (conflicts.length) return res.status(409).json({ error: true, conflicts });

    await pool.query(
      `UPDATE jadwal
       SET mata_kuliah_id = ?, dosen_id = ?, kelas = ?, ruangan_id = ?, hari = ?, jam_mulai = ?, jam_selesai = ?
       WHERE id = ?`,
      [payload.mata_kuliah_id, payload.dosen_id, payload.kelas, payload.ruangan_id, payload.hari, payload.jam_mulai, payload.jam_selesai, id]
    );

    const [rows] = await pool.query('SELECT * FROM jadwal WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Gagal update jadwal', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM jadwal WHERE id = ?', [id]);
  res.json({ message: 'Jadwal dihapus' });
};

