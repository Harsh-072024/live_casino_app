import mongoose from "mongoose";

const TwoCardRoundSchema = new mongoose.Schema({
  cardA: { suit: String, value: String },
  cardB: { suit: String, value: String },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  winner: { type: String, enum: ["A", "B", "Tie"], required: false },
  endTime: Number,
}, { timestamps: true });

// TTL Index
TwoCardRoundSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 }); 

export default mongoose.model("Round", TwoCardRoundSchema);
