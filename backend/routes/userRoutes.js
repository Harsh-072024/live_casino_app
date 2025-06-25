import express from "express";
import {
  getBalance,
  updateBalanceByAdmin,
  deductBalanceByAdmin,
  getUsers,
  
} from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get user balance
router.get("/balance", verifyToken, getBalance);

// Admin routes
router.put("/admin/user/add", verifyToken, isAdmin, updateBalanceByAdmin);
router.put("/admin/user/deduct", verifyToken, isAdmin, deductBalanceByAdmin);
router.get("/admin/users", verifyToken, isAdmin, getUsers);


export default router;
