const pool = require('../config/db');
const bcrypt = require('bcrypt');

function getPasswordFromBody(body) {
  // Password default bila tidak disediakan.
  return body.password || body.password_default || '12345678';
}

async function createUserForDosen({ nama, email, prodi, status, no_hp }, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  // role harus sama dengan enum di schema: 'dosen'
  const [userResult] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, created_at)
     VALUES (?, ?, ?, 'dosen', CURDATE())`,
    [nama, email, passwordHash]
  );

  return userResult.insertId;
}

async function getDosenById(id) {
  const [rows] = await pool.query(
    `SELECT d.*,
            u.email AS user_email,
            u.role  AS user_role
     FROM dosen d
     LEFT JOIN users u ON u.id = d.user_id
     WHERE d.id = ?`,
    [id]
  );
  return rows[0] || null;
}

exports.getAll = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT d.*,
            u.email AS user_email,
            u.role  AS user_role
     FROM dosen d
     LEFT JOIN users u ON u.id = d.user_id
     ORDER BY d.id DESC`
  );
  res.json(rows);
};

exports.getById = async (req, res) => {
  const dosen = await getDosenById(req.params.id);
  if (!dosen) return res.status(404).json({ message: 'Dosen tidak ditemukan' });
  res.json(dosen);
};

exports.getByUserId = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT d.*,
            u.email AS user_email,
            u.role  AS user_role
     FROM dosen d
     LEFT JOIN users u ON u.id = d.user_id
     WHERE d.user_id = ?`,
    [req.params.userId]
  );
  res.json(rows[0] || null);
};

exports.create = async (req, res) => {
  const { nidn, nama, email, prodi, no_hp, status } = req.body;

  if (!nidn || !nama || !email || !prodi || !status) {
    return res.status(400).json({ message: 'nidn, nama, email, prodi, status wajib diisi' });
  }

  const password = getPasswordFromBody(req.body);

  try {
    // Cegah email duplikat
    const [existingUsers] = await pool.query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existingUsers.length) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    // Cegah nidn duplikat
    const [existingDosen] = await pool.query(`SELECT id FROM dosen WHERE nidn = ?`, [nidn]);
    if (existingDosen.length) {
      return res.status(409).json({ message: 'NIDN sudah terdaftar' });
    }

    const userId = await createUserForDosen(
      { nama, email, prodi, status, no_hp },
      password
    );

    const [result] = await pool.query(
      `INSERT INTO dosen (nidn, nama, email, prodi, no_hp, status, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)` ,
      [nidn, nama, email, prodi, no_hp || null, status, userId]
    );

    res.status(201).json({
      message: 'Dosen dan akun user berhasil dibuat',
      dosenId: result.insertId,
      userId,
      // mengembalikan password default tidak ideal; tapi membantu testing.
      passwordCreated: req.body.password ? undefined : password,
    });
  } catch (err) {
    // bisa kena duplikat email/nidn atau error DB lain
    res.status(500).json({ message: 'Gagal membuat dosen dan akun', error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nidn, nama, email, prodi, no_hp, status } = req.body;

  const dosen = await getDosenById(id);
  if (!dosen) return res.status(404).json({ message: 'Dosen tidak ditemukan' });

  try {
    // Jika email diubah, pastikan email tidak dipakai user lain
    if (email && email !== dosen.email) {
      const [existingUsers] = await pool.query(`SELECT id FROM users WHERE email = ? AND id != ?`, [email, dosen.user_id]);
      if (existingUsers.length) return res.status(409).json({ message: 'Email sudah terdaftar' });

      await pool.query(`UPDATE users SET name = ?, email = ?, role = 'dosen' WHERE id = ?`, [nama || dosen.nama, email, dosen.user_id]);
    }

    await pool.query(
      `UPDATE dosen
       SET nidn = ?, nama = ?, email = ?, prodi = ?, no_hp = ?, status = ?
       WHERE id = ?`,
      [nidn || dosen.nidn, nama || dosen.nama, email || dosen.email, prodi || dosen.prodi, no_hp ?? dosen.no_hp, status || dosen.status, id]
    );

    const updated = await getDosenById(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Gagal update dosen', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const dosen = await getDosenById(id);
  if (!dosen) return res.status(404).json({ message: 'Dosen tidak ditemukan' });

  try {
    // Set user_id jadi NULL; users tidak dihapus agar histori tetap aman.
    await pool.query(`UPDATE dosen SET user_id = NULL WHERE id = ?`, [id]);
    await pool.query(`DELETE FROM dosen WHERE id = ?`, [id]);
    res.json({ message: 'Dosen dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus dosen', error: err.message });
  }
};

