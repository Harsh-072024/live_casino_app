const MatchSchema = new mongoose.Schema({
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  startTime: { type: Date, required: true },
  result: { type: String, enum: ["A", "B", "draw", "pending"], default: "pending" },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model("Match", MatchSchema);
