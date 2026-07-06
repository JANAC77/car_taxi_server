const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Please add a car make']
  },
  model: {
    type: String,
    required: [true, 'Please add a car model']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Please add a registration number'],
    unique: true
  },
  type: {
    type: String,
    enum: ['SUV', 'Sedan', 'Hatchback'],
    required: [true, 'Please specify car type']
  },
  status: {
    type: String,
    enum: ['Available', 'Booked', 'Maintenance'],
    default: 'Available'
  },
  currentDriver: {
    type: mongoose.Schema.ObjectId,
    ref: 'Driver'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Car', CarSchema);
