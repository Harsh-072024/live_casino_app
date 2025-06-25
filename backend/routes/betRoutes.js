// routes/betRoutes.js
import express from "express";
import {
  placeBet,
  getMyBets,
  resolveBetsForRound,
} from "../controllers/betController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import Bet from "../models/Bet.js"

const router = express.Router();

// 👤 User-only routes
router.post("/", verifyToken, placeBet);           // POST /api/bets
router.get("/my-bets", verifyToken, getMyBets);    // GET /api/bets/my-bets

// 🛠️ Admin-only route
router.post("/resolve/:roundId", verifyToken, isAdmin, async (req, res, next) => {
  try {
    const result = await resolveBetsForRound(req.params.roundId);
    res.status(200).json({
      message: "Round resolved successfully",
      ...result,
    });
  } catch (error) {
    next(error); // pass error to global error handler
  }
});

// ✅ Fetch a specific user's bet for a round
router.get(
  "/user/:userId/round/:roundId",
  verifyToken,
  async (req, res, next) => {
    try {
      const { userId, roundId } = req.params;

      const bet = await Bet.findOne({
        user: userId,
        round: roundId,
      });

      // In the backend route:
if (!bet) {
  return res.json({ bet: null }); // 200 status
}


      res.status(200).json(bet);
    } catch (error) {
      next(error); // 🧨 This triggers 500 if there's an exception
    }
  }
);



export default router;
