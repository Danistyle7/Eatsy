// src/hooks/useSocketEvent.ts
import { DependencyList, useEffect, useRef } from "react";
import {
  EventCallback,
  socketManager,
} from "@/shared/lib/socket/listener-manager";

/**
 * useSocketEvent suscribe un handler al evento `eventName` en socket.io
 * y devuelve la limpieza automática.
 *
 * @param eventName Nombre del evento socket.io (ej. "dish_created").
 * @param callback  Función que procesa el payload que llega por socket.
 * @param deps      Lista de dependencias: cuando cambian, se re-suscribe.
 * @example
 * useSocketEvent("dish_created", (dish) => {
 *   console.log("Dish created:", dish);
 * });
 */
export const useSocketEvent = <T = unknown>(
  eventName: string,
  callback: EventCallback<T>,
  deps: DependencyList[] = []
) => {
  // Guardamos la referencia al callback para no regenerar handler si cambian props.
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(
    () => {
      // Creamos un handler que siempre invoque al callback más actualizado
      const handler = (payload: T) => {
        callbackRef.current(payload);
      };

      // Nos suscribimos al evento específico
      socketManager.addListener(eventName, handler);

      // Limpieza automática: desuscribir este handler concreto
      return () => {
        socketManager.removeListener(eventName);
      };
    },
    // Re-suscribir si cambia eventName o alguna dependencia extra
    [eventName, ...deps]
  );
};
