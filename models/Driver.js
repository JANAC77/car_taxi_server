const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please add a license number'],
    unique: true
  },
  idProof: {
    type: String, // URL to uploaded document
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
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

module.exports = mongoose.model('Driver', DriverSchema);
