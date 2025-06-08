import { useRef } from "react";
import { createTableSocket } from "../socket";

/**
 * useTableSocket es un hook “ligero” que expone sin más los métodos
 * para suscribirse a eventos de "table" (creado, actualizado, eliminado, ocupado),
 * sin que tú tengas que invocar directamente tableSocketFactory().
 *
 * Internamente solo inicializa tableSocketFactory() una vez (guardado en useRef),
 * y te devuelve las funciones onCreated, onUpdated y onDeleted.
 *
 * @remarks
 * Cada función debe usarse dentro de un useEffect (o contexto equivalente)
 * para suscribirse/desuscribirse correctamente.
 *
 * @returns Un objeto con las funciones onCreated, onUpdated y onDeleted.
 * Cada llamada a onXxx retorna una función unsubscribe que limpia ese único handler.
 * Además, cleanup() limpia todos los listeners de "table" que hayas creado.
 *
 * @example
 *
 * const { onCreated, onUpdated, onDeleted, cleanup } = useTableSocket();
 *
 * useEffect(() => {
 *   const unsubCreated = onCreated(table => { ... });
 *   const unsubUpdated = onUpdated(table => { ... });
 *   const unsubDeleted = onDeleted(table => { ... });
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
export const useTableSocket = () => {
  // Llamamos a la fábrica UNA sola vez y guardamos las funciones en ref
  const factoryRef = useRef(createTableSocket());

  // Devolvemos la misma referencia cada vez
  return factoryRef.current;
};
