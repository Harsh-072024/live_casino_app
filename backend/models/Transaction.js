import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "credit",         // ✅ user deposit
      "debit",          // ✅ user withdrawal
      "bet",            // ✅ balance deduction when placing bet
      "win",            // ✅ winnings credited after bet win
      "tie-refund",     // ✅ refunded if tie
      "admin-credit",   // ✅ admin manually adds balance
      "admin-debit",    // ✅ admin deducts balance
    ],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    default: "",
  },
  balanceAfter: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
