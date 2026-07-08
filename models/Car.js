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
    required: [true, 'Please specify car type']
  },
  seater: {
    type: Number,
    default: 4
  },
  pricePerKm: {
    type: Number,
    default: 0
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
