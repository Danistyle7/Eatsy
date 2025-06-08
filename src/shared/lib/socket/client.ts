import { io, Socket } from "socket.io-client";

// TODO: mover a core/config
const env = process.env;
const SOCKET_URL = env.EXPO_PUBLIC_SOCKET_URL || "ws://localhost:8000";

export const createSocket = (): Socket =>
  io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

export const socketClient = createSocket();
