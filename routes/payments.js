const express = require('express');
const {
  getAllPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  requestRecharge,
  getDriverTransactions,
  getAllTransactions,
  approveRecharge,
  rejectRecharge
} = require('../controllers/payments');
const { protect, protectDriver } = require('../middlewares/auth');

const router = express.Router();

// Driver wallet endpoints
router.post('/recharge', protectDriver, requestRecharge);
router.get('/driver-transactions', protectDriver, getDriverTransactions);

// Admin wallet endpoints
router.get('/transactions', protect, getAllTransactions);
router.put('/transactions/:id/approve', protect, approveRecharge);
router.put('/transactions/:id/reject', protect, rejectRecharge);

// Standard bookings payment endpoints (Admin protected)
router.use(protect);
router.route('/')
  .get(getAllPayments)
  .post(createPayment);

router.route('/:id')
  .get(getPayment)
  .put(updatePayment)
  .delete(deletePayment);

module.exports = router;
