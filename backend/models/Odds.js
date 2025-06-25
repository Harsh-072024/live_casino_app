const OddsSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
  option: { type: String, enum: ["A", "B"], required: true },
  odds: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("Odds", OddsSchema);
