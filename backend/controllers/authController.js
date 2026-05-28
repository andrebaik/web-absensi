const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

exports.login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const [rows] = await pool.query('SELECT id, name, email, password_hash, role FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const token = signToken(user);
    return res.json({
      success: true,
      token,
      user: { id: user.id, role: user.role, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Gagal login', error: err.message });
  }
};

exports.me = async (req, res) => {
  const u = req.user;
  if (!u) return res.status(401).json({ message: 'Tidak terautentikasi.' });

  return res.json({
    id: u.id,
    role: u.role,
    name: u.name,
    email: u.email,
  });
};

// Placeholder: saat ini frontend belum benar-benar memakai flow reset password untuk sistem SQL.
exports.forgotPassword = async (req, res) => {
  return res.json({ message: 'Fitur forgot-password belum diimplementasikan untuk demo.' });
};

