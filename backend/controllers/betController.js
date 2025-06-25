import asyncHandler from "express-async-handler";
import Bet from "../models/Bet.js";
import Round from "../models/Round.js";
import TeenpattiRound from "../models/TeenpattiRound.js";
import User from "../models/User.js";
import { logTransaction } from "../utils/logTransaction.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const placeBet = asyncHandler(async (req, res) => {
  const { roundId, gameType, selection, amount } = req.body;
  const userId = req.user._id;

  if (!roundId || !gameType || !selection || !amount) {
    throw new ApiError(400, "All fields required");
  }

  // Find the round based on gameType
  const round =
    gameType === "two-card"
      ? await Round.findById(roundId)
      : await TeenpattiRound.findById(roundId);

  if (!round || round.status !== "open") {
    throw new ApiError(400, "Round not open for betting");
  }

  const user = await User.findById(userId);
  if (user.balance < amount) {
    throw new ApiError(400, "Insufficient balance");
  }

  // Deduct balance
  user.balance -= amount;
  await user.save();

  await logTransaction(user._id, "bet", amount, `Bet on ${selection} in ${gameType} round ${roundId}`, user.balance);

  const bet = await Bet.create({
    user: userId,
    round: roundId,
    gameType,
    selection,
    amount,
  });

  res.status(201).json(new ApiResponse(201, bet, "Bet placed"));
});

// ✅ Resolve bets when round ends
// ✅ Resolve bets when round ends
const resolveBetsForRound = async (roundId, gameType) => {
  if (!gameType) {
    throw new Error("gameType is required for resolveBetsForRound");
  }

  const Model = gameType === "two-card" ? Round : TeenpattiRound;

  const round = await Model.findById(roundId);
  if (!round) {
    throw new Error("Round not found");
  }

  const bets = await Bet.find({ round: roundId, gameType, status: "pending" }).populate("user");
  const winnersData = [];

  for (const bet of bets) {
    let winnings = 0;

    if (round.winner === "tie") {
      bet.status = "tie";
      winnings = bet.amount;
      bet.winnings = winnings;
      bet.user.balance += winnings;

      await bet.user.save();
      await logTransaction(bet.user._id, "credit", winnings, `Refund for tie in ${gameType} Round ${roundId}`, bet.user.balance);
    } else if (bet.selection === round.winner) {
      bet.status = "won";
      winnings = bet.amount * 2;
      bet.winnings = winnings;
      bet.user.balance += winnings;

      await bet.user.save();
      await logTransaction(bet.user._id, "win", winnings, `Winnings for ${gameType} Round ${roundId}`, bet.user.balance);
      winnersData.push({ userId: bet.user._id, amountWon: winnings, newBalance: bet.user.balance });
    } else {
      bet.status = "lost";
      bet.winnings = 0;

      await logTransaction(bet.user._id, "debit", 0, `Lost bet in ${gameType} Round ${roundId}`, bet.user.balance);
    }

    await bet.save();
  }

  await Model.findByIdAndUpdate(roundId, { status: "closed" });
  return { totalBets: bets.length, winnersData };
};


const getMyBets = asyncHandler(async (req, res) => {
  const bets = await Bet.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, bets, "User bets retrieved"));
});

// ✅ Export
export {
  placeBet,
  resolveBetsForRound,
  getMyBets,
};
