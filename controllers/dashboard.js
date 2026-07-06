const Customer = require('../models/Customer');
const Driver = require('../models/Driver');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

exports.getStats = async (req, res, next) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const activeDrivers = await Driver.countDocuments({ status: 'Active' });
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Calculate revenue from completed bookings
    const completedBookings = await Booking.find({ status: 'Completed' });
    const totalRevenue = completedBookings.reduce((acc, curr) => acc + curr.fare, 0);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeDrivers,
        totalCars,
        totalBookings,
        totalRevenue
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
