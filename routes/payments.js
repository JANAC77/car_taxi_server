const express = require('express');
const {
  getAllPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment
} = require('../controllers/payments');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All routes protected

router.route('/')
  .get(getAllPayments)
  .post(createPayment);

router.route('/:id')
  .get(getPayment)
  .put(updatePayment)
  .delete(deletePayment);

module.exports = router;
