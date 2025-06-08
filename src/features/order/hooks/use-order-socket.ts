import { useRef } from "react";
import { createOrderSocket } from "../socket";

/**
 * useOrderSocket es un hook “ligero” que expone sin más los métodos
 * para suscribirse a eventos de "order" (creado, actualizado, eliminado),
 * sin que tú tengas que invocar directamente orderSocketFactory().
 *
 * Internamente solo inicializa orderSocketFactory() una vez (guardado en useRef),
 * y te devuelve las funciones onCreated, onUpdated y onDeleted.
 *
 * @remarks
 * Cada función debe usarse dentro de un useEffect (o contexto equivalente)
 * para suscribirse/desuscribirse correctamente.
 *
 * @returns Un objeto con las funciones onCreated, onUpdated y onDeleted.
 * Cada llamada a onXxx retorna una función unsubscribe que limpia ese único handler.
 * Además, cleanup() limpia todos los listeners de "order" que hayas creado.
 *
 * @example
 *
 * const { onCreated, onUpdated, onDeleted, cleanup } = useOrderSocket();
 *
 * useEffect(() => {
 *   const unsubCreated = onCreated(order => { ... });
 *   const unsubUpdated = onUpdated(order => { ... });
 *   const unsubDeleted = onDeleted(order => { ... });
 *
 *   // llamada automática cuando el componente desmonte
 *   return cleanup;
 *
 *   // O puedes usar las funciones individuales para desuscribirte:
 *   return () => {
 *     unsubCreated();
 *     unsubUpdated();
 *     unsubDeleted();
 *   };
 * }, [ ... ]);
 */
export const useOrderSocket = () => {
  // Llamamos a la fábrica UNA sola vez y guardamos las funciones en ref
  const factoryRef = useRef(createOrderSocket());

  // Devolvemos la misma referencia cada vez
  return factoryRef.current;
};
