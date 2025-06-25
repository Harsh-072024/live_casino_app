import TeenpattiRound from "../models/TeenpattiRound.js";

export const createTeenpattiRoundService = async (handA, handB) => {
  try {
    const endTime = Date.now() + 20000;

    const round = await TeenpattiRound.create({
      handA,
      handB,
      status: "open",
      endTime,
    });

    return round;
  } catch (error) {
    console.error("Error creating Teen Patti round:", error);
    throw new Error(error.message || "Unable to create Teen Patti round");
  }
};
