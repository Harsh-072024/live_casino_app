// server.js
import express from "express";
import http from "http"; // Required for socket.io
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import betRoutes from "./routes/betRoutes.js";
import roundRoutes from "./routes/roundRoutes.js";
import teenpattiRoundRoutes  from "./routes/teenpattiRoutes.js"
import transactionRoutes from "./routes/transactionRoutes.js";
import { startAllGames } from "./game/engine.js";


dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app); // Create server for socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Attach socket instance to app (optional, for sharing in routes)
app.set("io", io);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser()); // ✅ Before routes

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/bets", betRoutes); // ✅ Use route
app.use("/api/transactions", transactionRoutes);
app.use("/api/rounds", roundRoutes);
app.use("/api/roundsTeenpatti", teenpattiRoundRoutes);


// // // Handle socket connection
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

startAllGames(io); // ✅ Correct usage


app.get("/", (req, res) => res.send("Server is running..."));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
