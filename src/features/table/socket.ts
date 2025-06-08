// table_created, table_occupied, table_updated, table_deleted
import { socketManager, EventCallback } from "@/shared/lib/socket";
import { TableResponse } from "./types";

type TableDeleted = Pick<TableResponse, "id">;

/**
 * createTableSocket expone métodos para suscribirse a todos los eventos
 * relacionados con "table" sin tener que repetir el nombre del evento.
 *
 * @returns
 * Cada método devuelve una función de unsubscribe, que debe invocarse
 * cuando ya no necesites escuchar ese evento. También devuelve una función
 * para limpiar los listeners.
 *
 * @example
 * const { onCreated, onUpdated, onDeleted, onOccupied, cleanup } = createTableSocket();
 *
 * const unsubCreate = onCreated(newTable => { ... });
 * const unsubUpdate = onUpdated(updatedTable => { ... });
 * const unsubDelete = onDeleted(({ id }) => { ... });
 * const unsubOccupied = onOccupied(table => { ... });
 *
 * // Desuscribe todos los listeners de "table"
 * cleanup();
 *
 * // O puedes usar las funciones individuales para desuscribirte:
 * unsubCreate();
 * unsubUpdate();
 * unsubDelete();
 * unsubOccupied();
 *
 */
export const createTableSocket = () => {
  /**
   * Escucha el evento "table_created".
   * @param callback Recibe el objeto TableResponse.
   * @returns Función para desuscribirse.
   */
  const onCreated = (callback: EventCallback<TableResponse>) => {
    return socketManager.addListener("table_created", callback);
  };

  /**
   * Escucha el evento "table_updated".
   * @param callback Recibe el objeto TableResponse
   *                 con la información actualizada.
   * @returns Función para desuscribirse.
   */
  const onUpdated = (callback: EventCallback<TableResponse>) => {
    return socketManager.addListener("table_updated", callback);
  };

  /**
   * Escucha el evento "table_deleted".
   * @param callback Recibe un objeto { id: number } con el ID de la mesa eliminada.
   * @returns Función para desuscribirse.
   */
  const onDeleted = (callback: EventCallback<TableDeleted>) => {
    return socketManager.addListener("table_deleted", callback);
  };

  /**
   * Escucha el evento "table_occupied".
   * @param callback Recibe el objeto TableResponse
   *                 con la información actualizada.
   * @returns Función para desuscribirse.
   */
  const onOccupied = (callback: EventCallback<TableResponse>) => {
    return socketManager.addListener("table_occupied", callback);
  };

  const cleanup = () => {
    socketManager.removeListener("table_created");
    socketManager.removeListener("table_updated");
    socketManager.removeListener("table_deleted");
    socketManager.removeListener("table_occupied");
  };

  return {
    onCreated,
    onUpdated,
    onDeleted,
    onOccupied,
    cleanup,
  };
};
