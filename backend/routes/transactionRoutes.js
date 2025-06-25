// routes/transactionRoutes.js
import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getMyTransactions,
  getMyTransactionsByType,
} from "../controllers/transactionController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, createTransaction); // Admin/system triggered
router.get("/", verifyToken, isAdmin, getAllTransactions);
router.get("/my", verifyToken, getMyTransactions); // All types
router.get("/my/type", verifyToken, getMyTransactionsByType); // Filtered

export default router;
