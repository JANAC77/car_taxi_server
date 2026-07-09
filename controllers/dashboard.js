const Customer = require('../models/Customer');
const Driver = require('../models/Driver');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

// Admin Stats
exports.getStats = async (req, res, next) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const activeDrivers = await Driver.countDocuments({ status: 'approved' }); // approved or Active
    const totalBookings = await Booking.countDocuments();

    // Calculate total admin earnings (commission deduction sum)
    const completedBookings = await Booking.find({ status: 'Completed' });
    const totalRevenue = completedBookings.reduce((acc, curr) => acc + curr.fare, 0);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeDrivers,
        totalBookings,
        totalRevenue
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Driver Stats
// @route   GET /api/v1/dashboard/driver-stats
exports.getDriverStats = async (req, res, next) => {
  try {
    const driverId = req.driver.id;
    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }

    const completedBookings = await Booking.find({ driver: driverId, status: 'Completed' });
    const rideCount = completedBookings.length;
    const grossEarnings = completedBookings.reduce((acc, curr) => acc + curr.fare, 0);

    // Calculate document expiry warnings (less than 30 days remaining)
    const warnings = [];
    const now = new Date();
    const alertThreshold = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

    const docChecks = [
      { label: 'Driving License', key: 'dlExpiry', name: 'DL' },
      { label: 'Vehicle Registration (RC)', key: 'rcExpiry', name: 'RC' },
      { label: 'Pollution Under Control (PUC)', key: 'pucExpiry', name: 'PUC' },
      { label: 'Vehicle Insurance', key: 'insuranceExpiry', name: 'Insurance' }
    ];

    docChecks.forEach(doc => {
      const expDate = driver[doc.key];
      if (!expDate) {
        warnings.push({
          document: doc.name,
          message: `${doc.label} expiry date not set. Please update in profile.`,
          type: 'warning'
        });
      } else {
        const diff = new Date(expDate) - now;
        if (diff < 0) {
          warnings.push({
            document: doc.name,
            message: `${doc.label} has EXPIRED! Please renew immediately.`,
            type: 'danger'
          });
        } else if (diff < alertThreshold) {
          const daysLeft = Math.ceil(diff / (24 * 60 * 60 * 1000));
          warnings.push({
            document: doc.name,
            message: `${doc.label} expires in ${daysLeft} days.`,
            type: 'warning'
          });
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        rideCount,
        grossEarnings,
        walletBalance: driver.walletBalance || 0,
        warnings,
        upiId: driver.upiId,
        status: driver.status
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
