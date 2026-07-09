const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const Driver = require('../models/Driver');
const factory = require('./handlerFactory');

// Keep original payment handlers
exports.getAllPayments = factory.getAll(Payment);
exports.getPayment = factory.getOne(Payment);
exports.createPayment = factory.createOne(Payment);
exports.updatePayment = factory.updateOne(Payment);
exports.deletePayment = factory.deleteOne(Payment);

// Driver: Request wallet recharge
// @route   POST /api/v1/payments/recharge
exports.requestRecharge = async (req, res, next) => {
  try {
    const { amount, transactionRef } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Please enter a valid amount' });
    }

    const transaction = await Transaction.create({
      driver: req.driver.id,
      type: 'Recharge',
      amount: Number(amount),
      status: 'Pending',
      transactionRef: transactionRef || '',
      description: `Wallet recharge request via UPI`
    });

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Driver: Get own transactions
// @route   GET /api/v1/payments/driver-transactions
exports.getDriverTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ driver: req.driver.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Admin: Get all wallet transactions
// @route   GET /api/v1/payments/transactions
exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find()
      .populate('driver', 'name email phone upiId')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Admin: Approve a pending wallet recharge
// @route   PUT /api/v1/payments/transactions/:id/approve
exports.approveRecharge = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    if (transaction.type !== 'Recharge') {
      return res.status(400).json({ success: false, error: 'Only recharge transactions can be approved/rejected' });
    }

    if (transaction.status !== 'Pending') {
      return res.status(400).json({ success: false, error: 'Transaction is already finalized' });
    }

    transaction.status = 'Approved';
    await transaction.save();

    // Increment driver balance
    const driver = await Driver.findById(transaction.driver);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }

    driver.walletBalance += transaction.amount;
    await driver.save();

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Admin: Reject a pending wallet recharge
// @route   PUT /api/v1/payments/transactions/:id/reject
exports.rejectRecharge = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    if (transaction.type !== 'Recharge') {
      return res.status(400).json({ success: false, error: 'Only recharge transactions can be approved/rejected' });
    }

    if (transaction.status !== 'Pending') {
      return res.status(400).json({ success: false, error: 'Transaction is already finalized' });
    }

    transaction.status = 'Rejected';
    await transaction.save();

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
