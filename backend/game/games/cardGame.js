import { createRound, closeRound } from "../../controllers/roundController.js";
import { resolveBetsForRound } from "../../controllers/betController.js";
import {
  getRandomCard,
  determineWinner,
} from "../../utils/gameUtils/cardUtils.js";
import Round from "../../models/Round.js";

const runCardGame = async (io) => {
  const startRound = async () => {
    try {
      const card1 = getRandomCard();
      const card2 = getRandomCard();

      const round = await createRound(card1, card2);
      console.log(`🆕 Round started: ${round._id}`);

      if (io.engine.clientsCount > 0) {
        io.emit("bettingRound", {
          roundId: round._id,
          message: "🎯 Place your bets!",
          roundStartTime: Date.now(),
          gameType: "two-card",
        });
      }

      // ⏳ Wait 20 seconds for bets
      setTimeout(async () => {
        try {
          const winner = determineWinner(card1, card2);

          await Round.findByIdAndUpdate(round._id, {
            winner,
            status: "closed",
          });

          const { winnersData } = await resolveBetsForRound(round._id, "two-card");

          if (io.engine.clientsCount > 0) {
            io.emit("roundResult", {
              roundId: round._id,
              card1,
              card2,
              winner,
              winners: winnersData,
              gameType: "two-card",
            });
          }

          console.log(`✅ Round ${round._id} resolved with winner: ${winner}`);

          // 💤 Wait 5 seconds before starting the next round
          setTimeout(() => {
            startRound();
          }, 5000);
        } catch (err) {
          console.error("❌ Error resolving round:", err.message);
          setTimeout(startRound, 5000);
        }
      }, 20000);
    } catch (err) {
      console.error("❌ Error starting round:", err.message);
      setTimeout(startRound, 5000);
    }
  };
  startRound();
};

export default runCardGame;
