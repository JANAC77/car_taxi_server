const express = require('express');
const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  publishBooking,
  getAvailableBookings,
  acceptBooking,
  updateBookingStatus,
  getMyTrips
} = require('../controllers/bookings');
const { protect, protectDriver } = require('../middlewares/auth');

const router = express.Router();

// Driver endpoints (must be defined before /:id parameterized routes)
router.get('/available', protectDriver, getAvailableBookings);
router.get('/my-trips', protectDriver, getMyTrips);
router.put('/:id/accept', protectDriver, acceptBooking);
router.put('/:id/status', protectDriver, updateBookingStatus);

// Admin / General endpoints
router.post('/publish', protect, publishBooking);

router.route('/')
  .get(protect, getAllBookings)
  .post(protect, createBooking);

router.route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

module.exports = router;
