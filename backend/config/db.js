require('dotenv').config();
const mysql = require('mysql2/promise');

function mustGet(name) {
  const value = process.env[name];
  if (value === undefined || value === null || value === '') {
    throw new Error(`[DB] Missing required environment variable: ${name}`);
  }
  return value;
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: mustGet('DB_USER'),
  // DB_PASSWORD boleh kosong untuk skenario XAMPP root (password tidak diset)
  password: process.env.DB_PASSWORD ?? '',
  database: mustGet('DB_NAME'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});


module.exports = pool;
