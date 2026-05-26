const express = require('express');
const router = express.Router();
const c = require('../controllers/mataKuliahController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/',        auth, c.getAll);
router.get('/:id',     auth, c.getById);
router.post('/',       auth, role('admin'), c.create);
router.put('/:id',     auth, role('admin'), c.update);
router.delete('/:id',  auth, role('admin'), c.remove);

module.exports = router;
