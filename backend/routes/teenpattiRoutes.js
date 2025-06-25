import { verifyToken } from "../middlewares/authMiddleware.js";
import express from "express";
import TeenpattiRound from "../models/TeenpattiRound.js";
import { getRecentWinners, getCurrentRound } from "../controllers/teenpattiController.js";

 const router = express.Router();
// route: GET /api/rounds/open
router.get("/open", verifyToken, async (req, res) => {
  const rounds = await TeenpattiRound.find({ status: "open" });
  res.status(200).json(rounds);
});

router.get("/recent-winners", getRecentWinners);

// Route to fetch the current active round
router.get("/current", getCurrentRound);
export default router;