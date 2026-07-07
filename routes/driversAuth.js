const express = require('express');
const { register, login, getMe } = require('../controllers/driversAuth');
const { protectDriver } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protectDriver, getMe);

module.exports = router;
