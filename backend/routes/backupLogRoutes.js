const express = require('express');
const router = express.Router();

const c = require('../controllers/backupLogController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/', auth, role('admin'), c.getAll);
router.post('/', auth, role('admin'), c.create);

module.exports = router;

