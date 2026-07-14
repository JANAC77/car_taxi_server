const mongoose = require('mongoose');

const VehicleTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a vehicle type name'],
    unique: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VehicleType', VehicleTypeSchema);
