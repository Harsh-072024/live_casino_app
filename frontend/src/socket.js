// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_SOCKET_URL
    : "/";

const socket = io(SOCKET_URL, {
  withCredentials: true, // if needed
});

export default socket;
