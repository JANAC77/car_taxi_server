const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a place name']
  },
  type: {
    type: String,
    enum: ['Pickup', 'Drop', 'Both'],
    default: 'Both'
  },
  baseFare: {
    type: Number,
    default: 50
  },
  ratePerKm: {
    type: Number,
    default: 15
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Place', PlaceSchema);
