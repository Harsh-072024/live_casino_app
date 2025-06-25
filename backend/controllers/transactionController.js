import asyncHandler from "express-async-handler";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { logTransaction } from "../utils/logTransaction.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ Create a new transaction (admin use)
export const createTransaction = asyncHandler(async (req, res) => {
  const { username, type, amount, description } = req.body;

  const allowedTypes = ["deposit", "withdraw", "bet", "win", "admin-credit", "admin-debit"];
  if (!allowedTypes.includes(type)) {
    throw new ApiError(400, "Invalid transaction type");
  }

  if (!username || !amount || isNaN(amount)) {
    throw new ApiError(400, "Username and valid amount are required");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let newBalance = parseFloat(user.balance);
  const numericAmount = parseFloat(amount);

  // Admin actions update balance
  if (type === "admin-credit") {
    newBalance += numericAmount;
  } else if (type === "admin-debit") {
    if (newBalance < numericAmount) {
      throw new ApiError(400, "Insufficient user balance for deduction");
    }
    newBalance -= numericAmount;
  }

  // Save updated balance (for admin actions only)
  if (type.startsWith("admin")) {
    user.balance = newBalance.toFixed(2);
    await user.save();
  }

  const transaction = await logTransaction(
    user._id,
    type,
    numericAmount,
    description || "N/A",
    newBalance
  );

  res.status(201).json(new ApiResponse(201, transaction, "Transaction created"));
});

// ✅ Get all transactions (admin only)
export const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find()
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, transactions, "All transactions retrieved"));
});

// ✅ Get logged-in user's transactions
// ✅ Get logged-in user's transactions (with pagination)
export const getMyTransactions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const query = { user: req.user._id };
  const total = await Transaction.countDocuments(query);
  const transactions = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json(new ApiResponse(200, {
    transactions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }, "Your transactions"));
});


// ✅ Get logged-in user's transactions by type
export const getMyTransactionsByType = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const query = { user: req.user._id };
  if (type) query.type = type;

  const total = await Transaction.countDocuments(query);
  const transactions = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json(new ApiResponse(200, {
    transactions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }, `Transactions for ${type || "all"}`));
});

