const mongoose = require('mongoose');

const VehicleTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a vehicle type name'],
    unique: true
  },
  baseFare: {
    type: Number,
    default: 0
  },
  seater: {
    type: Number,
    default: 4
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VehicleType', VehicleTypeSchema);
