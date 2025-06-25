import { verifyToken } from "../middlewares/authMiddleware.js";
import express from "express";
import Round from "../models/Round.js";
import { getRecentWinners, getCurrentRound } from "../controllers/roundController.js";

 const router = express.Router();
// route: GET /api/rounds/open
router.get("/open", verifyToken, async (req, res) => {
  const rounds = await Round.find({ status: "open" });
  res.status(200).json(rounds);
});

router.get("/recent-winners", getRecentWinners);

// Route to fetch the current active round
router.get("/current", getCurrentRound);
export default router;