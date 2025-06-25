import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
 changePassword,
 getUser,
 resetUserPassword
} from "../controllers/authController.js"; // ✅ include registerUser
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", verifyToken, isAdmin, registerUser); // ✅ add this line
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);
router.post("/refresh-token", refreshToken);
router.put("/change-password", verifyToken, changePassword);
router.get("/me", verifyToken, getUser)
router.post("/reset-password", verifyToken, isAdmin, resetUserPassword);

export default router;
