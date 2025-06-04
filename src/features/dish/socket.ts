import { DishResponse } from "@/features/dish/types";
import { EventCallback, socketManager } from "@/shared/lib/socket";

type DishDeleted = Pick<DishResponse, "id">;

/**
 * createDishSocket expone métodos para suscribirse a todos los eventos
 * relacionados con "dish" sin tener que repetir el nombre del evento.
 *
 * Cada método devuelve una función de unsubscribe, que debe invocarse
 * cuando ya no necesites escuchar ese evento. También devuelve una función
 * para limpiar los listeners.
 *
 * @example
 * const { onCreated, onUpdated, onDeleted, cleanup } = createDishSocket();
 *
 * const unsubCreate = onCreated(newDish => { ... });
 * const unsubUpdate = onUpdated(updatedDish => { ... });
 * const unsubDelete = onDeleted(({ id }) => { ... });
 *
 * // Desuscribe todos los listeners de "dish"
 * cleanup();
 *
 * // O puedes usar las funciones individuales para desuscribirte:
 * unsubCreate();
 * unsubUpdate();
 * unsubDelete();
 *
 */
export const createDishSocket = () => {
  /**
   * Escucha el evento "dish_created".
   * @param callback Recibe el objeto DishResponse.
   * @returns Función para desuscribirse.
   */
  const onCreated = (callback: EventCallback<DishResponse>) => {
    return socketManager.addListener("dish_created", callback);
  };

  /**
   * Escucha el evento "dish_updated".
   * @param callback Recibe el objeto DishResponse
   *                 con la información actualizada.
   * @returns Función para desuscribirse.
   */
  const onUpdated = (callback: EventCallback<DishResponse>) => {
    return socketManager.addListener("dish_updated", callback);
  };

  /**
   * Escucha el evento "dish_deleted".
   * @param callback Recibe un objeto { id: number } con el ID del plato eliminado.
   * @returns Función para desuscribirse.
   */
  const onDeleted = (callback: EventCallback<DishDeleted>) => {
    return socketManager.addListener("dish_deleted", callback);
  };

  const cleanup = () => {
    socketManager.removeListener("dish_created");
    socketManager.removeListener("dish_updated");
    socketManager.removeListener("dish_deleted");
  };

  return {
    onCreated,
    onUpdated,
    onDeleted,
    cleanup,
  };
};
