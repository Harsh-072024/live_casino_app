import TeenpattiRound from "../models/TeenpattiRound.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import { determineTeenPattiWinner } from "../utils/gameUtils/Teenpatti20Utils.js"; // ✅ Import this

/**
 * ✅ Create Teen Patti Round
 */
export const createTeenpattiRound = async (req, res) => {
  try {
    const { handA, handB } = req.body;

    if (!handA || !handB || handA.length !== 3 || handB.length !== 3) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Both hands must have 3 cards"));
    }

    const endTime = Date.now() + 20000;

    const round = await TeenpattiRound.create({
      handA,
      handB,
      status: "open",
      endTime,
    });

    res.json(new ApiResponse(201, round, "Teen Patti Round Created"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/**
 * ✅ Close Teen Patti Round and set the winner
 */
export const closeRound = async (req, res) => {
  try {
    const { roundId } = req.params;

    if (!roundId) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Round ID is required"));
    }

    // ✅ Find the round first
    const round = await TeenpattiRound.findById(roundId);
    if (!round) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Round not found"));
    }

    // ✅ Check that the hands are present
    if (!round.handA || !round.handB) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid hands"));
    }

    // ✅ Use determineTeenPattiWinner to get "A", "B", or "Tie"
    const winner = determineTeenPattiWinner(round.handA, round.handB);

    // ✅ Update status and winner
    round.status = "closed";
    round.winner = winner;

    const updatedRound = await round.save();

    res.json(new ApiResponse(200, updatedRound, "Teen Patti Round Closed"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/**
 * ✅ Get Recent Teen Patti Winners
 */
export const getRecentWinners = async (req, res) => {
  try {
    const recentRounds = await TeenpattiRound.find({
      status: "closed",
      winner: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .limit(7)
      .select("winner createdAt");

    res.json(new ApiResponse(200, recentRounds, "Fetched recent Teen Patti winners"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

/**
 * ✅ Get Current Teen Patti Round
 */
export const getCurrentRound = async (req, res) => {
  try {
    const currentRound = await TeenpattiRound.findOne({ status: "open" }).sort({ createdAt: -1 }); 

    if (!currentRound) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No open Teen Patti round found"));
    }

    const remaining = Math.max(
      0,
      Math.ceil((currentRound.endTime - Date.now()) / 1000)
    );

    res.json(new ApiResponse(200, {
      roundId: currentRound._id,
      endTime: currentRound.endTime,
      remaining,
    }, "Current Teen Patti Round retrieved"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};
