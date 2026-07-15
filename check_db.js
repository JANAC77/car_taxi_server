const mongoose = require('mongoose');

const uri = "mongodb+srv://janarthananc01_db_user:xF6cwYLvLZmsu1L0@cluster0.4znvkrl.mongodb.net/?appName=Cluster0";

const TransactionSchema = new mongoose.Schema({
  driver: mongoose.Schema.ObjectId,
  type: String,
  amount: Number,
  status: String,
  transactionRef: String,
  paymentProof: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Transaction = mongoose.model('Transaction', TransactionSchema, 'transactions');

async function check() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");
    const tx = await Transaction.findOne({ type: 'Recharge' }).sort('-createdAt');
    console.log("Latest Transaction:");
    console.log(tx);
    console.log("Has paymentProof?", !!tx.paymentProof);
    if (tx.paymentProof) {
      console.log("Length of paymentProof:", tx.paymentProof.length);
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

check();
