import { Order, OrderPanel } from "@/features/order/types";
import { socketManager, EventCallback } from "@/shared/lib/socket";

type OrderDeleted = Pick<Order["order"], "id">;

/**
 * createOrderSocket expone métodos para suscribirse a todos los eventos
 * relacionados con "order" sin tener que repetir el nombre del evento.
 *
 * @returns
 * Cada método devuelve una función de unsubscribe, que debe invocarse
 * cuando ya no necesites escuchar ese evento. También devuelve una función
 * para limpiar los listeners.
 *
 * @example
 * const { onCreated, onUpdated, onDeleted, cleanup } = createOrderSocket();
 *
 * const unsubCreate = onCreated(newOrder => { ... });
 * const unsubUpdate = onUpdated(updatedOrder => { ... });
 * const unsubDelete = onDeleted(({ id }) => { ... });
 *
 * // Desuscribe todos los listeners de "order"
 * cleanup();
 *
 * // O puedes usar las funciones individuales para desuscribirte:
 * unsubCreate();
 * unsubUpdate();
 * unsubDelete();
 *
 */
export const createOrderSocket = () => {
  /**
   * Escucha el evento "order_created".
   * @param callback Recibe el objeto OrderResponse.
   * @returns Función para desuscribirse.
   */
  const onCreated = (callback: EventCallback<Order>) => {
    return socketManager.addListener("order_created", callback);
  };

  /**
   * Escucha el evento "order_updated".
   * @param callback Recibe el objeto OrderResponse
   *                 con la información actualizada.
   * @returns Función para desuscribirse.
   */
  const onUpdated = (callback: EventCallback<Order>) => {
    return socketManager.addListener("order_updated", callback);
  };

  /**
   * Escucha el evento "order_deleted".
   * @param callback Recibe un objeto { id: number } con el ID del pedido eliminado.
   * @returns Función para desuscribirse.
   */
  const onDeleted = (callback: EventCallback<OrderDeleted>) => {
    return socketManager.addListener("order_deleted", callback);
  };

  const cleanup = () => {
    socketManager.removeListener("order_created");
    socketManager.removeListener("order_updated");
    socketManager.removeListener("order_deleted");
  };

  return {
    onCreated,
    onUpdated,
    onDeleted,
    cleanup,
  };
};

/**
 * createOrderItemSocket expone métodos para suscribirse a todos los eventos
 * relacionados con "order_item" sin tener que repetir el nombre del evento.
 *
 * @returns
 * Cada método devuelve una función de unsubscribe, que debe invocarse
 * cuando ya no necesites escuchar ese evento. También devuelve una función
 * para limpiar los listeners.
 *
 * @example
 * const { onCreated, onUpdated, cleanup } = createOrderItemSocket();
 *
 * const unsubCreate = onCreated(newOrderItem => { ... });
 * const unsubUpdate = onUpdated(updatedOrderItem => { ... });
 *
 * // Desuscribe todos los listeners de "order_item"
 * cleanup();
 *
 * // O puedes usar las funciones individuales para desuscribirte:
 * unsubCreate();
 * unsubUpdate();
 *
 */
export const createOrderItemSocket = () => {
  /**
   * Escucha el evento "order_item_created".
   * @param callback Recibe el objeto OrderPanel.
   * @returns Función para desuscribirse.
   */
  const onCreated = (callback: EventCallback<OrderPanel>) => {
    return socketManager.addListener("order_item_created", callback);
  };

  /**
   * Escucha el evento "order_item_updated".
   * @param callback Recibe el objeto OrderPanel
   *                 con la información actualizada.
   * @returns Función para desuscribirse.
   */
  const onUpdated = (callback: EventCallback<OrderPanel>) => {
    return socketManager.addListener("order_item_updated", callback);
  };

  const cleanup = () => {
    socketManager.removeListener("order_item_created");
    socketManager.removeListener("order_item_updated");
  };

  return {
    onCreated,
    onUpdated,
    cleanup,
  };
};
