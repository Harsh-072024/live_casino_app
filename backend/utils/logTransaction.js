import Transaction from "../models/Transaction.js";

export const logTransaction = async (userId, type, amount, reason = "N/A", balanceAfter) => {
  try {
    const transaction = await Transaction.create({
      user: userId,
      type,
      amount: parseFloat(amount).toFixed(2),
      reason,
      balanceAfter: parseFloat(balanceAfter).toFixed(2),
    });

    return transaction; // return it so you can access in controller if needed
  } catch (error) {
    console.error("Transaction logging failed:", error.message);
    throw new Error("Failed to log transaction");
  }
};
