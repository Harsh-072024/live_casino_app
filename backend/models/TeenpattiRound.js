
import {mongoose, Schema} from "mongoose";

 const TeenPattiRoundSchema = new mongoose.Schema({
  handA: [{ suit: String, value: String }],
  handB: [{ suit: String, value: String }],
  status: { type: String, enum: ["open", "closed"], default: "open" },
  winner: { type: String, enum: ["A", "B", "Tie"], required: false },
  endTime: Number,
}, { timestamps: true });

// TTL Index
TeenPattiRoundSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 }); 

export default mongoose.model("TeenpattiRound", TeenPattiRoundSchema);