import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { logTransaction } from "../utils/logTransaction.js";

// ✅ Get logged-in user's balance
export const getBalance = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("balance");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const balance = parseFloat(user.balance).toFixed(2);
  res.status(200).json(new ApiResponse(200, { balance }, "Balance fetched successfully"));
});

// ✅ Admin adds balance to a user
export const updateBalanceByAdmin = asyncHandler(async (req, res) => {
  const { amount, username } = req.body;
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount)) {
    throw new ApiError(400, "Amount must be a valid number");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.balance = (parseFloat(user.balance) + numericAmount).toFixed(2);
  await user.save();

  await logTransaction(user._id, "admin-credit", numericAmount, `Admin added ₹${numericAmount}`, user.balance);

  res.status(200).json(
    new ApiResponse(200, { balance: user.balance }, `Balance ₹${amount} added successfully`)
  );
});

// ✅ Admin deducts balance from a user
export const deductBalanceByAdmin = asyncHandler(async (req, res) => {
  const { amount, username } = req.body;
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new ApiError(400, "Amount must be a positive number");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.balance < numericAmount) {
    throw new ApiError(400, "Insufficient balance");
  }

  user.balance = (parseFloat(user.balance) - numericAmount).toFixed(2);
  await user.save();

  await logTransaction(user._id, "admin-debit", numericAmount, `Admin deducted ₹${numericAmount}`, user.balance);

  res.status(200).json(
    new ApiResponse(200, { balance: user.balance }, `Balance ₹${amount} deducted successfully`)
  );
});

// ✅ Admin fetches all users (username, email, balance)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("username email balance");

  if (!users.length) {
    throw new ApiError(404, "No users found");
  }

  res.status(200).json(new ApiResponse(200, users, "User list fetched successfully"));
});


