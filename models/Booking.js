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
  pickupDateTime: {
    type: Date,
    required: true
  },
  dropDateTime: {
    type: Date,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Arrived', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
