const pool = require('../config/db');

exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'User tidak ditemukan' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  return res.status(400).json({ message: 'Pembuatan user admin/dosen/mahasiswa dibuat lewat endpoint khusus (dosen/mahasiswa).' });
};

exports.update = async (req, res) => {
  return res.status(400).json({ message: 'Update user dibuat lewat endpoint khusus.' });
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
  res.json({ message: 'User dihapus' });
};

