import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// 🛡️ Cookie options based on environment
const getCookieOptions = (maxAge) => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge,
  };
};

// 🔐 REGISTER USER (Admin only)
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role = "user", balance = 0 } = req.body;

  if (!username || !email || !password || !role || balance == null) {
    throw new ApiError(
      400,
      "All fields are required: username, email, password, role, balance"
    );
  }

  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Only admins can register new users.");
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const newUser = await User.create({ username, email, password, role, balance });

  const responseData = {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    balance: newUser.balance,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, responseData, "User registered successfully"));
});

// 🔐 LOGIN
export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) throw new ApiError(404, "User does not exist");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000)) // 15 min
    .cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)) // 7 days
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully"
      )
    );
});

// 🔓 LOGOUT
export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new ApiError(400, "No refresh token provided");

  const user = await User.findById(req.user._id);
  if (user && user.refreshToken === refreshToken) {
    user.refreshToken = null;
    await user.save();
  }

  res
    .clearCookie("accessToken", getCookieOptions(0))
    .clearCookie("refreshToken", getCookieOptions(0))
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

// 🔁 REFRESH TOKEN
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new ApiError(401, "No refresh token provided");

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) throw new ApiError(404, "User not found");
    if (user.refreshToken !== token) {
      throw new ApiError(403, "Refresh token mismatch. Token is stale or reused.");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .cookie("accessToken", newAccessToken, getCookieOptions(15 * 60 * 1000)) // 15 min
      .cookie("refreshToken", newRefreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000)) // 7 days
      .status(200)
      .json(new ApiResponse(200, { accessToken: newAccessToken }, "Token refreshed successfully"));
  } catch (err) {
    throw new ApiError(403, "Token expired or invalid");
  }
});

// 🔐 CHANGE PASSWORD
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) throw new ApiError(401, "Current password is incorrect");

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});

// 👤 GET LOGGED-IN USER
export const getUser = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, req.user, "User profile fetched"));
});

// 🔁 Admin Reset Password
export const resetUserPassword = asyncHandler(async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    throw new ApiError(400, "Username and new password are required");
  }

  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "User not found");

  user.password = newPassword;
  await user.save();

  res.json(new ApiResponse(200, null, `Password reset for ${user.username}`));
});
