const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  dob: {
    type: Date
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please add a license number'],
    unique: true
  },
  aadhaar: { type: String },
  panCard: { type: String },
  photo: { type: String, select: false }, // Base64 or URL
  licenseImage: { type: String, select: false },
  panImage: { type: String, select: false },
  aadhaarImage: { type: String, select: false },
  vehicleDetails: {
    type: { type: String },
    number: { type: String },
    rcImage: { type: String, select: false },
    pucImage: { type: String, select: false },
    insuranceImage: { type: String, select: false }
  },
  upiId: {
    type: String,
    required: [true, 'Please add a UPI ID']
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  dlExpiry: { type: Date },
  rcExpiry: { type: Date },
  pucExpiry: { type: Date },
  insuranceExpiry: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'Active', 'Inactive'],
    default: 'pending'
  },
  currentCar: {
    type: mongoose.Schema.ObjectId,
    ref: 'Car'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
DriverSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
DriverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Driver', DriverSchema);
