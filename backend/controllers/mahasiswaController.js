const pool = require('../config/db');
const bcrypt = require('bcrypt');

function getPasswordFromBody(body) {
  return String(body.nim).trim();
}

async function createUserForMahasiswa({ nama, email, prodi, kelas, semester, status }, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const [userResult] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, created_at)
     VALUES (?, ?, ?, 'mahasiswa', CURDATE())`,
    [nama, email, passwordHash]
  );

  return userResult.insertId;
}

async function getMahasiswaById(id) {
  const [rows] = await pool.query(
    `SELECT m.*,
            u.email AS user_email,
            u.role  AS user_role
     FROM mahasiswa m
     LEFT JOIN users u ON u.id = m.user_id
     WHERE m.id = ?`,
    [id]
  );
  return rows[0] || null;
}

exports.getAll = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT m.*,
            u.email AS user_email,
            u.role  AS user_role
     FROM mahasiswa m
     LEFT JOIN users u ON u.id = m.user_id
     ORDER BY m.id DESC`
  );
  res.json(rows);
};

exports.getById = async (req, res) => {
  const mahasiswa = await getMahasiswaById(req.params.id);
  if (!mahasiswa) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
  res.json(mahasiswa);
};

exports.getByUserId = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT m.*,
            u.email AS user_email,
            u.role  AS user_role
     FROM mahasiswa m
     LEFT JOIN users u ON u.id = m.user_id
     WHERE m.user_id = ?`,
    [req.params.userId]
  );
  res.json(rows[0] || null);
};

exports.create = async (req, res) => {
  const { nim, nama, email, prodi, kelas, semester, status } = req.body;

  if (!nim || !nama || !email || !prodi || !kelas || semester == null || !status) {
    return res.status(400).json({ message: 'nim, nama, email, prodi, kelas, semester, status wajib diisi' });
  }

  const password = getPasswordFromBody(req.body);

  try {
    const [existingUsers] = await pool.query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existingUsers.length) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    const [existingMahasiswa] = await pool.query(`SELECT id FROM mahasiswa WHERE nim = ?`, [nim]);
    if (existingMahasiswa.length) {
      return res.status(409).json({ message: 'NIM sudah terdaftar' });
    }

    const userId = await createUserForMahasiswa(
      { nama, email, prodi, kelas, semester, status },
      password
    );

    const [result] = await pool.query(
      `INSERT INTO mahasiswa (nim, nama, email, prodi, kelas, semester, status, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
      [nim, nama, email, prodi, kelas, semester, status, userId]
    );

    res.status(201).json({
      message: 'Mahasiswa dan akun user berhasil dibuat',
      mahasiswaId: result.insertId,
      userId,
      passwordCreated: req.body.password ? undefined : password,
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat mahasiswa dan akun', error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nim, nama, email, prodi, kelas, semester, status } = req.body;

  const mahasiswa = await getMahasiswaById(id);
  if (!mahasiswa) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });

  try {
    if (email && email !== mahasiswa.email) {
      const [existingUsers] = await pool.query(
        `SELECT id FROM users WHERE email = ? AND id != ?`,
        [email, mahasiswa.user_id]
      );
      if (existingUsers.length) return res.status(409).json({ message: 'Email sudah terdaftar' });

      await pool.query(`UPDATE users SET name = ?, email = ?, role = 'mahasiswa' WHERE id = ?`, [nama || mahasiswa.nama, email, mahasiswa.user_id]);
    }

    await pool.query(
      `UPDATE mahasiswa
       SET nim = ?, nama = ?, email = ?, prodi = ?, kelas = ?, semester = ?, status = ?
       WHERE id = ?`,
      [nim || mahasiswa.nim, nama || mahasiswa.nama, email || mahasiswa.email, prodi || mahasiswa.prodi, kelas || mahasiswa.kelas, semester ?? mahasiswa.semester, status || mahasiswa.status, id]
    );

    const updated = await getMahasiswaById(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Gagal update mahasiswa', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const mahasiswa = await getMahasiswaById(id);
  if (!mahasiswa) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });

  try {
    await pool.query(`UPDATE mahasiswa SET user_id = NULL WHERE id = ?`, [id]);
    await pool.query(`DELETE FROM mahasiswa WHERE id = ?`, [id]);
    res.json({ message: 'Mahasiswa dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus mahasiswa', error: err.message });
  }
};

