import { useRef } from "react";
import { createDishSocket } from "../socket";

/**
 * useDishSocket es un hook “ligero” que expone sin más los métodos
 * para suscribirse a eventos de "dish" (creado, actualizado, eliminado),
 * sin que tú tengas que invocar directamente dishSocketFactory().
 *
 * Internamente solo inicializa dishSocketFactory() una vez (guardado en useRef),
 * y te devuelve las funciones onCreated, onUpdated y onDeleted.
 *
 * Cada función debe usarse dentro de un useEffect (o contexto equivalente)
 * para suscribirse/desuscribirse correctamente.
 *
 * @returns Un objeto con las funciones onCreated, onUpdated y onDeleted.
 * Cada llamada a onXxx retorna una función unsubscribe que limpia ese único handler.
 * Además, cleanup() limpia todos los listeners de "dish" que hayas creado.
 *
 * @example
 *
 * const { onCreated, onUpdated, onDeleted, cleanup } = useDishSocket();
 *
 * useEffect(() => {
 *   const unsubCreated = onCreated(dish => { ... });
 *   const unsubUpdated = onUpdated(dish => { ... });
 *   const unsubDeleted = onDeleted(dish => { ... });
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
export const useDishSocket = () => {
  // Llamamos a la fábrica UNA sola vez y guardamos las funciones en ref
  const factoryRef = useRef(createDishSocket());

  // Devolvemos la misma referencia cada vez
  return factoryRef.current;
};
