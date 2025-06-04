import { Socket } from "socket.io-client";

import { socketClient } from "./client";

export type EventCallback<T> = (data: T) => void;
export type EventUnsubscriber = () => void;

export class SocketListenerManager {
  private socket: Socket;
  private listeners: Map<string, (...args: any[]) => void> = new Map();

  constructor(socketInstance: Socket) {
    this.socket = socketInstance;
  }

  addListener<T>(event: string, callback: EventCallback<T>): EventUnsubscriber {
    const handler = (data: T) => callback(data);
    this.listeners.set(event, handler);
    this.socket.on(event, handler);
    return () => this.removeListener(event);
  }

  removeListener(event: string) {
    const handler = this.listeners.get(event);
    if (handler) {
      this.socket.off(event, handler);
      this.listeners.delete(event);
    }
  }

  cleanup() {
    this.listeners.forEach((_, event) => this.removeListener(event));
  }

  setupGlobalListeners() {
    // @IsraelSamcaM
    // creo que esto es opcional, no?
    this.addListener("connect", () => console.log("[WebSocket] ✅ Conectado"));
    this.addListener("disconnect", () =>
      console.log("[WebSocket] ❌ Desconectado")
    );
    this.addListener("connect_error", (err: unknown) => {
      if (err instanceof Error)
        console.error("[WebSocket] ⚠️ Error de conexión:", err.message);
      else console.error("[WebSocket] ⚠️ Unknown error:", err);
    });

    // @IsraelSamcaM Misión:
    // qué es "bind(this)"?
    // para qué sirve esto?
    // qué pasa si no lo usamos?
    return this.cleanup.bind(this);
  }
}

// Instancia compartida global
export const socketManager = new SocketListenerManager(socketClient);
