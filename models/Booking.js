const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true
  },
  driver: {
    type: mongoose.Schema.ObjectId,
    ref: 'Driver'
  },
  car: {
    type: mongoose.Schema.ObjectId,
    ref: 'Car'
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropLocation: {
    type: String,
    required: true
  },
  journeyDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  landmark: {
    type: String
  },
  tripType: {
    type: String,
    enum: ['One Way Trip', 'Round Trip'],
    default: 'One Way Trip'
  },
  driverCharge: {
    type: String,
    enum: ['Included', 'Excluded'],
    default: 'Included'
  },
  paymentMethod: {
    type: String,
    enum: ['Paid by Cash', 'Paid Online'],
    default: 'Paid by Cash'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
