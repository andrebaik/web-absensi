const pool = require('../config/db');

exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM mata_kuliah ORDER BY id DESC');
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM mata_kuliah WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Mata kuliah tidak ditemukan' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const { kode_mk, nama_mk, sks, semester, prodi } = req.body || {};
  if (!kode_mk || !nama_mk || sks == null || semester == null || !prodi) {
    return res.status(400).json({ message: 'kode_mk, nama_mk, sks, semester, prodi wajib diisi' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO mata_kuliah (kode_mk, nama_mk, sks, semester, prodi)
       VALUES (?, ?, ?, ?, ?)`,
      [kode_mk, nama_mk, sks, semester, prodi]
    );
    const [rows] = await pool.query('SELECT * FROM mata_kuliah WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat mata kuliah', error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { kode_mk, nama_mk, sks, semester, prodi } = req.body || {};

  const [exist] = await pool.query('SELECT * FROM mata_kuliah WHERE id = ?', [id]);
  if (!exist.length) return res.status(404).json({ message: 'Mata kuliah tidak ditemukan' });

  try {
    await pool.query(
      `UPDATE mata_kuliah
       SET kode_mk = ?, nama_mk = ?, sks = ?, semester = ?, prodi = ?
       WHERE id = ?`,
      [kode_mk ?? exist[0].kode_mk, nama_mk ?? exist[0].nama_mk, sks ?? exist[0].sks, semester ?? exist[0].semester, prodi ?? exist[0].prodi, id]
    );
    const [rows] = await pool.query('SELECT * FROM mata_kuliah WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Gagal update mata kuliah', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM mata_kuliah WHERE id = ?', [id]);
  res.json({ message: 'Mata kuliah dihapus' });
};

