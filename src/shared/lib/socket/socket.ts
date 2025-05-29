import { io } from "socket.io-client";
const env = process.env;
const SOCKET_URL = env.EXPO_PUBLIC_SOCKET_URL || "ws://localhost:8000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;