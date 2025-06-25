import mongoose from "mongoose";

const BetSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  round: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  gameType: {
    type: String,
    enum: ["two-card", "teenpatti"],
    required: true,
  },
  selection: { 
    type: String, 
    enum: ["A", "B"], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ["pending", "won", "lost", "tie"],
    default: "pending",
  },
  winnings: { 
    type: Number, 
    default: 0 
  },
}, { timestamps: true });

// ⏳ TTL Index for auto-deleting after 7 days
BetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

export default mongoose.model("Bet", BetSchema);
