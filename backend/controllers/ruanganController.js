const pool = require('../config/db');

exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM ruangan ORDER BY id DESC');
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM ruangan WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Ruangan tidak ditemukan' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const { kode_ruangan, nama_ruangan, kapasitas, lokasi, status } = req.body || {};
  if (!kode_ruangan || !nama_ruangan || kapasitas == null || !lokasi || !status) {
    return res.status(400).json({ message: 'kode_ruangan, nama_ruangan, kapasitas, lokasi, status wajib diisi' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO ruangan (kode_ruangan, nama_ruangan, kapasitas, lokasi, status)
       VALUES (?, ?, ?, ?, ?)`,
      [kode_ruangan, nama_ruangan, kapasitas, lokasi, status]
    );
    const [rows] = await pool.query('SELECT * FROM ruangan WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat ruangan', error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { kode_ruangan, nama_ruangan, kapasitas, lokasi, status } = req.body || {};

  const [exist] = await pool.query('SELECT * FROM ruangan WHERE id = ?', [id]);
  if (!exist.length) return res.status(404).json({ message: 'Ruangan tidak ditemukan' });

  try {
    await pool.query(
      `UPDATE ruangan
       SET kode_ruangan = ?, nama_ruangan = ?, kapasitas = ?, lokasi = ?, status = ?
       WHERE id = ?`,
      [kode_ruangan ?? exist[0].kode_ruangan, nama_ruangan ?? exist[0].nama_ruangan, kapasitas ?? exist[0].kapasitas, lokasi ?? exist[0].lokasi, status ?? exist[0].status, id]
    );

    const [rows] = await pool.query('SELECT * FROM ruangan WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Gagal update ruangan', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM ruangan WHERE id = ?', [id]);
  res.json({ message: 'Ruangan dihapus' });
};

