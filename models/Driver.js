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
  photo: { type: String }, // Base64 or URL
  licenseImage: { type: String },
  panImage: { type: String },
  aadhaarImage: { type: String },
  vehicleDetails: {
    type: { type: String },
    number: { type: String },
    rcImage: { type: String }
  },
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
DriverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
DriverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Driver', DriverSchema);
