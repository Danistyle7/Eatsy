import { io, Socket } from "socket.io-client";

// TODO: mover a core/config

export const createSocket = (): Socket =>
  io("wss://eatzybe-production.up.railway.app/", {
    transports: ["websocket"],
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

export const socketClient = createSocket();
