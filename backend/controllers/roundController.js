import Round from "../models/Round.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Store new round from engine
export const createRound = async (cardA, cardB, winner) => {
   const endTime = Date.now() + 20000; // 20 seconds from now
  const round = await Round.create({
    cardA,
    cardB,
    winner,
    status: "open",
    endTime,
  });
  return round;
};

// ✅ Close round when done
export const closeRound = async (roundId) => {
  await Round.findByIdAndUpdate(roundId, { status: "closed" });
};
// update code using async Handler, apiResponse, ApiError

export const getRecentWinners = asyncHandler( async (req, res) => {
  const recentRounds = await Round.find({status : "closed", winner: {$ne: null}})
    .sort({createdAt: -1})
    .limit(7)
    .select("winner createdAt")
    res.status(200).json(new ApiResponse(200, recentRounds, "Fetched recent winners"));
})


// GET /rounds/current
export const getCurrentRound = asyncHandler(async (req, res) => {
  const currentRound = await Round.findOne({ status: "open" }).sort({ createdAt: -1 }); 

  if (!currentRound) {
    return res.status(404).json(new ApiResponse(404, null, "No open round found"));
  }

  const remaining = Math.max(0, Math.ceil((currentRound.endTime - Date.now()) / 1000));

  res.json(new ApiResponse(200, {
    roundId: currentRound._id,
    endTime: currentRound.endTime,
    remaining,
  }, "Current round retrieved"));
});



