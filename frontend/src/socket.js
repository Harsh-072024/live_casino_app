import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SOCKET_URL // ✅ https://live-casino-app.onrender.com
    : import.meta.env.VITE_SOCKET_URL; // ✅ SAME in production too

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;
