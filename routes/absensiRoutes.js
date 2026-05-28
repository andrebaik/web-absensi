const express = require('express');
const router = express.Router();
const c = require('../controllers/absensiController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Spesifik routes harus di atas /:id
router.get('/rekap/admin',                       auth, role('admin'), c.getRekapAdmin);
router.get('/rekap/dosen/:dosenId',              auth, role('dosen', 'admin'), c.getRekapDosen);
router.get('/rekap/mahasiswa/:mahasiswaId',      auth, c.getRekapByMahasiswa);
router.get('/mahasiswa/:mahasiswaId',            auth, c.getByMahasiswa);
router.get('/jadwal/:jadwalId/pertemuan/:pertemuan', auth, c.getByJadwalAndPertemuan);
router.get('/jadwal/:jadwalId',                  auth, c.getByJadwal);
router.get('/',                                  auth, role('admin'), c.getAll);
router.get('/:id',                               auth, c.getById);
router.post('/',                                 auth, role('dosen', 'admin', 'mahasiswa'), c.create);
router.put('/:id',                               auth, role('dosen', 'admin'), c.update);
router.delete('/:id',                            auth, role('admin'), c.remove);

module.exports = router;
