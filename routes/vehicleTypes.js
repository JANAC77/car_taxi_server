const express = require('express');
const {
  getAllVehicleTypes,
  getVehicleType,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType
} = require('../controllers/vehicleTypes');

// Assuming you have a protect middleware (if not, we can adjust)
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(protect, getAllVehicleTypes)
  .post(protect, createVehicleType);

router.route('/:id')
  .get(protect, getVehicleType)
  .put(protect, updateVehicleType)
  .delete(protect, deleteVehicleType);

module.exports = router;
