const express = require('express');
const {
  getAllSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting
} = require('../controllers/settings');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(getAllSettings) // Public/Driver can read settings
  .post(protect, createSetting);

router.route('/:id')
  .get(getSetting)
  .put(protect, updateSetting)
  .delete(protect, deleteSetting);

module.exports = router;
