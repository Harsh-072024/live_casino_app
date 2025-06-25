import runCardGame from "./games/cardGame.js";
import runTeenPattiGame from "./games/runTeenpattiGame.js";

export const startAllGames = (io) => {
  try {
    console.log("🎮 Starting All Games...");

    runCardGame(io);
    console.log("✅ Card Game Started");

    runTeenPattiGame(io);
    console.log("✅ Teen Patti Game Started");

    // If you add more games, just import and call here.
  } catch (error) {
    console.error("❌ Error starting games:", error.message);
  }
};
