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
  carType: {
    type: String
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
  distance: {
    type: Number,
    default: 0
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
  customerName: {
    type: String
  },
  customerPhone: {
    type: String
  },
  vehicleType: {
    type: String
  },
  vehicleNumber: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
