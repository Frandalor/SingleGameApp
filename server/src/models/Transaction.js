import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Player,
    required: true,
  },
  type: { type: String, enum: ['add', 'remove'] },
  amount: { type: Number, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
