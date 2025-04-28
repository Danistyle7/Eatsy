import { useRef } from "react";

/**
 * Polyfill para generar IDs únicos en React Native
 * React.useId() no está disponible en React Native
 */
export const useAutoId = (id?: string): string => {
  const autoId = useRef(`id-${Math.random().toString(36).slice(2, 9)}`);
  return id || autoId.current;
};
