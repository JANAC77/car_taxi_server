const express = require('express');
const {
  getAllCars,
  getCar,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/cars');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All routes protected

router.route('/')
  .get(getAllCars)
  .post(createCar);

router.route('/:id')
  .get(getCar)
  .put(updateCar)
  .delete(deleteCar);

module.exports = router;
