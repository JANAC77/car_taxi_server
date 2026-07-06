const Booking = require('../models/Booking');
const factory = require('./handlerFactory');

exports.getAllBookings = async (req, res, next) => {
  try {
    const docs = await Booking.find()
      .populate('customer', 'name email')
      .populate('driver', 'name phone')
      .populate('car', 'make model registrationNumber')
      .sort('-createdAt');

    res.status(200).json({ 
      success: true, 
      count: docs.length,
      data: docs 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getBooking = factory.getOne(Booking, { path: 'customer driver car' });
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
