const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.ObjectId,
    ref: 'Driver',
    required: true
  },
  type: {
    type: String,
    enum: ['Recharge', 'Deduction'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Approved' // Recharges default to Pending, Deductions are pre-Approved
  },
  transactionRef: {
    type: String // Optional reference details for recharges
  },
  paymentProof: {
    type: String // Path/URL to the uploaded proof of payment image
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
