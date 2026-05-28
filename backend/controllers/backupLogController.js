const pool = require('../config/db');

async function getAdminName(adminId) {
  if (!adminId) return null;
  const [rows] = await pool.query('SELECT name FROM users WHERE id = ?', [adminId]);
  return rows[0]?.name ?? null;
}

exports.getAll = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.*, u.name AS admin_name
     FROM backup_log b
     LEFT JOIN users u ON u.id = b.admin_id
     ORDER BY b.id DESC`
  );

  res.json(rows);
};

exports.create = async (req, res) => {
  const { nama_data } = req.body;
  const adminId = req.user?.id ?? null;

  if (!nama_data) {
    return res.status(400).json({ message: 'nama_data wajib diisi' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO backup_log (nama_data, admin_id, tanggal_backup)
       VALUES (?, ?, CURDATE())`,
      [nama_data, adminId]
    );

    const created = {
      id: result.insertId,
      nama_data,
      admin_id: adminId,
      tanggal_backup: new Date().toISOString().slice(0, 10),
    };

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat backup log', error: err.message });
  }
};

