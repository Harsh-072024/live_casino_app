import { createTeenpattiRoundService } from "../../services/teenpattiService.js";
import TeenpattiRound from "../../models/TeenpattiRound.js";
import {
  getThreeRandomCards,
  determineTeenPattiWinner,
} from "../../utils/gameUtils/Teenpatti20Utils.js";
import { resolveBetsForRound } from "../../controllers/betController.js";

const runTeenPattiGame = (io) => {
  const startRound = async () => {
    try {
      const handA = getThreeRandomCards();
      const handB = getThreeRandomCards();

      const round = await createTeenpattiRoundService(handA, handB);
      if (!round) {
        console.error("❌ Failed to create Teen Patti Round");
        return setTimeout(startRound, 5000);
      }

      console.log(`🆕 Teen Patti Round started: ${round._id}`);
      if (io.engine.clientsCount > 0) {
        io.emit("bettingRound", {
          gameType: "teenpatti",
          roundId: round._id,
          message: "🎯 Place your bets for Teen Patti!",
          roundStartTime: Date.now(),
        });
      }

      setTimeout(async () => {
        try {
          let winnerResult = determineTeenPattiWinner(handA, handB);

          // ✅ Adjust winner to match schema
          if (winnerResult === "Player A") winnerResult = "A";
          if (winnerResult === "Player B") winnerResult = "B";

          await TeenpattiRound.findByIdAndUpdate(round._id, {
            winner: winnerResult,
            status: "closed",
          });

          const { winnersData } = await resolveBetsForRound(
            round._id,
            "teenpatti"
          );

          if (io.engine.clientsCount > 0) {
            io.emit("roundResult", {
              gameType: "teenpatti",
              roundId: round._id,
              handA,
              handB,
              winner: winnerResult,
              winners: winnersData,
            });
          }

          console.log(
            `✅ Teen Patti Round ${round._id} resolved with winner: ${winnerResult}`
          );
          setTimeout(startRound, 5000);
        } catch (err) {
          console.error("❌ Error resolving Teen Patti round:", err.message);
          setTimeout(startRound, 5000);
        }
      }, 20000);
    } catch (err) {
      console.error("❌ Error starting Teen Patti round:", err.message);
      setTimeout(startRound, 5000);
    }
  };

  // Start first round
  startRound();
};

export default runTeenPattiGame;
