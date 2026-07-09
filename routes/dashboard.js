const express = require('express');
const { getStats, getDriverStats } = require('../controllers/dashboard');
const { protect, protectDriver } = require('../middlewares/auth');

const router = express.Router();

router.get('/stats', protect, getStats);
router.get('/driver-stats', protectDriver, getDriverStats);

module.exports = router;
