const Driver = require('../models/Driver');
const jwt = require('jsonwebtoken');

const sendTokenResponse = (driver, statusCode, res) => {
  const token = jwt.sign({ id: driver._id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

  res.status(statusCode).json({
    success: true,
    token
  });
};

// @desc    Register driver
// @route   POST /api/v1/driver-auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name, email, password, phone, dob, licenseNumber, aadhaar, panCard,
      photo, licenseImage, panImage, aadhaarImage, vehicleDetails, upiId,
      dlExpiry, rcExpiry, pucExpiry, insuranceExpiry
    } = req.body;
    
    const driver = await Driver.create({
      name, email, password, phone, dob, licenseNumber, aadhaar, panCard,
      photo, licenseImage, panImage, aadhaarImage, vehicleDetails, upiId,
      dlExpiry, rcExpiry, pucExpiry, insuranceExpiry,
      status: 'pending',
      walletBalance: 0
    });

    sendTokenResponse(driver, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Login driver
// @route   POST /api/v1/driver-auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const driver = await Driver.findOne({ email }).select('+password');
    if (!driver) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await driver.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (driver.status === 'pending') {
      return res.status(403).json({ success: false, error: 'Your account is under verification' });
    }
    
    if (driver.status === 'rejected') {
      return res.status(403).json({ success: false, error: 'Your account has been rejected by admin' });
    }

    sendTokenResponse(driver, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get current logged in driver
// @route   GET /api/v1/driver-auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.driver.id);
    res.status(200).json({
      success: true,
      data: driver
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
