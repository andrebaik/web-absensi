require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const dosenRoutes = require('./routes/dosenRoutes');
const mataKuliahRoutes = require('./routes/mataKuliahRoutes');
const ruanganRoutes = require('./routes/ruanganRoutes');
const jadwalRoutes = require('./routes/jadwalRoutes');
const absensiRoutes = require('./routes/absensiRoutes');
const backupLogRoutes = require('./routes/backupLogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/dosen', dosenRoutes);
app.use('/api/mata-kuliah', mataKuliahRoutes);
app.use('/api/ruangan', ruanganRoutes);
app.use('/api/jadwal', jadwalRoutes);
app.use('/api/absensi', absensiRoutes);
app.use('/api/backup-log', backupLogRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ message: 'Endpoint tidak ditemukan' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => console.log(`ASINETKW Backend berjalan di http://localhost:${PORT}`));
