const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'Cab Taxi Co.'
  },
  companyEmail: {
    type: String
  },
  companyPhone: {
    type: String
  },
  logo: {
    type: String // URL to uploaded logo
  },
  websiteBanner: {
    type: String // URL to uploaded banner
  },
  whatsappEnabled: {
    type: Boolean,
    default: false
  },
  smsApiEnabled: {
    type: Boolean,
    default: false
  },
  adminUpiId: {
    type: String,
    default: ''
  },
  commissionPerRide: {
    type: Number,
    default: 100
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Setting', SettingSchema);
