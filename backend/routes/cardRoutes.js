import express from "express";
import { getRandomCard, determineWinner } from "../utils/gameUtils/cardUtils.js";

const router = express.Router();

router.get("/draw", (req, res) => {
  try {
    const card1 = getRandomCard();
    const card2 = getRandomCard();
    const winner = determineWinner(card1, card2);
    res.status(200).json({ card1, card2, winner });
  } catch (err) {
    console.error("❌ Error in /draw:", err.message);
    res.status(500).json({ message: "Failed to draw cards", error: err.message });
  }
});


export default router;
