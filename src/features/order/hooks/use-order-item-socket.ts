import { useRef } from "react";
import { createOrderItemSocket } from "../socket";

/**
 * useOrderItemSocket es un hook “ligero” que expone sin más los métodos
 * para suscribirse a eventos de "order_item" (creado, actualizado),
 * sin que tú tengas que invocar directamente orderItemSocketFactory().
 *
 * Internamente solo inicializa orderItemSocketFactory() una vez (guardado en useRef),
 * y te devuelve las funciones onCreated, onUpdated y onDeleted.
 *
 * @remarks
 * Cada función debe usarse dentro de un useEffect (o contexto equivalente)
 * para suscribirse/desuscribirse correctamente.
 *
 * @returns Un objeto con las funciones onCreated, onUpdated y onDeleted.
 * Cada llamada a onXxx retorna una función unsubscribe que limpia ese único handler.
 * Además, cleanup() limpia todos los listeners de "order_item" que hayas creado.
 *
 * @example
 *
 * const { onCreated, onUpdated, onDeleted, cleanup } = useOrderItemSocket();
 *
 * useEffect(() => {
 *   const unsubCreated = onCreated(orderItem => { ... });
 *   const unsubUpdated = onUpdated(orderItem => { ... });
 *
 *   // llamada automática cuando el componente desmonte
 *   return cleanup;
 *
 *   // O puedes usar las funciones individuales para desuscribirte:
 *   return () => {
 *     unsubCreated();
 *     unsubUpdated();
 *   };
 * }, [ ... ]);
 */
export const useOrderItemSocket = () => {
  // Llamamos a la fábrica UNA sola vez y guardamos las funciones en ref
  const factoryRef = useRef(createOrderItemSocket());

  // Devolvemos la misma referencia cada vez
  return factoryRef.current;
};
