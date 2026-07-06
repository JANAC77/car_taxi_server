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

router.use(protect); // All routes protected

router.route('/')
  .get(getAllSettings)
  .post(createSetting);

router.route('/:id')
  .get(getSetting)
  .put(updateSetting)
  .delete(deleteSetting);

module.exports = router;
