const express = require('express');
const {
  getAllPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/places');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All routes protected

router.route('/')
  .get(getAllPlaces)
  .post(createPlace);

router.route('/:id')
  .get(getPlace)
  .put(updatePlace)
  .delete(deletePlace);

module.exports = router;
