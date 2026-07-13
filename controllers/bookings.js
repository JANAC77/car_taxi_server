const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Driver = require('../models/Driver');
const Setting = require('../models/Setting');
const Transaction = require('../models/Transaction');
const factory = require('./handlerFactory');

// @desc    Get all bookings (Admin)
// @route   GET /api/v1/bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    const docs = await Booking.find(JSON.parse(queryStr))
      .populate('customer', 'name email phone')
      .populate('driver', 'name phone upiId')
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

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
exports.getBooking = factory.getOne(Booking, { path: 'customer driver' });

// @desc    Create booking (General CRUD)
exports.createBooking = factory.createOne(Booking);

// @desc    Update booking
exports.updateBooking = factory.updateOne(Booking);

// @desc    Delete booking
exports.deleteBooking = factory.deleteOne(Booking);

// @desc    Publish ride (Admin custom creation/selection of customer & ride details)
// @route   POST /api/v1/bookings/publish
exports.publishBooking = async (req, res, next) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      pickupLocation,
      dropLocation,
      pickupDateTime,
      dropDateTime,
      fare,
      timer
    } = req.body;

    if (!customerName || !customerPhone || !pickupLocation || !dropLocation || !pickupDateTime || !dropDateTime || !fare) {
      return res.status(400).json({ success: false, error: 'Please provide all details' });
    }

    // Find or Create Customer
    let customer = await Customer.findOne({
      $or: [
        { phone: customerPhone },
        ...(customerEmail ? [{ email: customerEmail }] : [])
      ]
    });

    if (!customer) {
      const email = customerEmail || `${customerPhone}@tempcabbazar.com`;
      customer = await Customer.create({
        name: customerName,
        phone: customerPhone,
        email
      });
    }

    // Create booking
    const booking = await Booking.create({
      customer: customer._id,
      pickupLocation,
      dropLocation,
      pickupDateTime,
      dropDateTime,
      fare,
      timer,
      status: 'Pending',
      ...(req.body.assignedDriverId && { driver: req.body.assignedDriverId }),
      ...(req.body.carId && { car: req.body.carId }),
      ...(req.body.carType && { carType: req.body.carType })
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get Available Rides for Drivers (status = Pending, driver wallet >= 2000)
// @route   GET /api/v1/bookings/available
exports.getAvailableBookings = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.driver.id);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }

    if (driver.walletBalance < 2000) {
      return res.status(403).json({
        success: false,
        error: 'Wallet balance is below 2000. Please recharge to view or accept rides.',
        walletBalance: driver.walletBalance
      });
    }

    const bookings = await Booking.find({ 
      status: { $in: ['Pending', 'Admin Accepted'] },
      $and: [
        {
          $or: [
            { driver: { $exists: false } },
            { driver: null },
            { driver: driver._id }
          ]
        },
        {
          $or: [
            { carType: { $exists: false } },
            { carType: null },
            { carType: '' },
            { carType: driver.vehicleDetails?.type }
          ]
        }
      ]
    })
      .populate('customer', 'name email phone')
      .sort('-createdAt')
      .allowDiskUse(true);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Driver accepts a ride
// @route   PUT /api/v1/bookings/:id/accept
exports.acceptBooking = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.driver.id);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }

    if (driver.walletBalance < 2000) {
      return res.status(403).json({
        success: false,
        error: 'Wallet balance is below 2000. Please recharge to accept rides.'
      });
    }

    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (!['Pending', 'Admin Accepted'].includes(booking.status)) {
      return res.status(400).json({ success: false, error: 'Ride is already accepted or processing' });
    }

    if (booking.appliedDrivers && booking.appliedDrivers.includes(driver._id)) {
      return res.status(400).json({ success: false, error: 'You have already applied for this ride' });
    }

    if (!booking.appliedDrivers) {
      booking.appliedDrivers = [];
    }
    booking.appliedDrivers.push(driver._id);

    if (booking.availableSeats > 0) {
      booking.availableSeats -= 1;
    }

    if (!booking.startTime) {
      booking.startTime = new Date();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update active ride status (Driver flow: Accepted -> Arrived -> Ongoing -> Completed)
// @route   PUT /api/v1/bookings/:id/status
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentMethod } = req.body;
    const allowedStatuses = ['Arrived', 'Ongoing', 'Completed', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status transition' });
    }

    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    // Ensure the driver updating is the assigned driver
    if (booking.driver.toString() !== req.driver.id) {
      return res.status(403).json({ success: false, error: 'You are not authorized to update this ride' });
    }

    booking.status = status;
    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
    }

    if (status === 'Completed') {
      booking.paymentStatus = 'Completed';

      // Deduct commission from driver wallet
      const driver = await Driver.findById(req.driver.id);
      if (driver) {
        // Fetch commission rate from Setting
        const settings = await Setting.findOne();
        const commission = settings ? settings.commissionPerRide : 100;

        driver.walletBalance -= commission;
        await driver.save();

        // Create transaction log
        await Transaction.create({
          driver: driver._id,
          type: 'Deduction',
          amount: commission,
          status: 'Approved',
          description: `Commission deduction for Ride ${booking._id}`
        });
      }
    }

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get driver's own ride history
// @route   GET /api/v1/bookings/my-trips
exports.getMyTrips = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ driver: req.driver.id })
      .populate('customer', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
