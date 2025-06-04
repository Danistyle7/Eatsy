import { DishResponse } from "@/features/dish/types";
import { Order, OrderPanel } from "@/features/order/types";
import { parseOrder } from "@/features/order/utils";
import { TableResponse } from "@/features/table/types";
import { socketClient } from "./client";

// Referencias a hooks y funciones de socket
import { useDishSocket } from "@/features/dish/hooks";
import { createDishSocket } from "@/features/dish/socket";
import { useOrderItemSocket } from "@/features/order/hooks";
import { createOrderItemSocket } from "@/features/order/socket";
import { useTableSocket } from "@/features/table/hooks";
import { createTableSocket } from "@/features/table/socket";
import { useSocketEvent } from "./hooks";
import { SocketListenerManager } from "./listener-manager";

type DishDeleted = {
  id: number;
};

type TableDeleted = {
  id: number;
};

/**
 * setupSocketListeners inicializa los listeners de los eventos de socket.io
 * y los maneja de forma correcta.
 *
 * @deprecated Este método está en desuso y se recomienda usar
 * `SocketListenerManager` en su lugar, o su hook correspondiente.
 *
 * @see SocketListenerManager
 * @see useSocketEvent
 */
export const setupSocketListeners = () => {
  console.log("[WebSocket] Inicializando listeners...");

  socketClient.on("connection", () => {
    console.log("[WebSocket] ✅ Conectado al servidor");
  });

  socketClient.on("disconnect", () => {
    console.log("[WebSocket] ❌ Desconectado del servidor");
  });

  socketClient.on("connect_error", (err) => {
    console.log("[WebSocket] ⚠️ Error de conexión:", err.message);
  });

  socketClient.on("dish_created", (dish: DishResponse) => {
    console.log("[WebSocket] 🍽️ Plato creado:", dish);
  });

  socketClient.on("dish_updated", (dish: DishResponse) => {
    console.log("[WebSocket] 🔄 Plato actualizado:", dish);
  });

  socketClient.on("dish_deleted", ({ id }: DishDeleted) => {
    console.log("[WebSocket] 🗑️ Plato eliminado ID:", id);
  });

  // Eventos de mesas
  socketClient.on("table_created", (table: TableResponse) => {
    console.log("[WebSocket] 🏷️ Mesa creada:", table);
  });

  socketClient.on("table_occupied", (table: TableResponse) => {
    console.log("[WebSocket] 🪑 Mesa ocupada:", table);
  });

  socketClient.on("table_updated", (table: TableResponse) => {
    console.log("[WebSocket] 🪑 Mesa editada:", table);
  });

  socketClient.on("table_deleted", ({ id }: TableDeleted) => {
    console.log("[WebSocket] 🗑️ Mesa eliminada ID:", id);
  });

  socketClient.on("order_item_created", (orderItem: unknown) => {
    console.log("[WebSocket] 📦 Item de pedido creado:", orderItem);
  });

  socketClient.on("order_item_updated", (orderItem: unknown) => {
    console.log("[WebSocket] 🔄 Item de pedido actualizado:", orderItem);
  });

  return () => {
    console.log("[WebSocket] Limpiando listeners...");
    socketClient.off("connect");
    socketClient.off("disconnect");
    socketClient.off("connect_error");
    socketClient.off("dish_created");
    socketClient.off("dish_updated");
    socketClient.off("dish_deleted");
    socketClient.off("table_created");
    socketClient.off("table_occupied");
    socketClient.off("table_updated");
    socketClient.off("table_deleted");
    socketClient.off("order_item_created");
    socketClient.off("order_item_updated");
  };
};

/**
 * setupDishListeners inicializa los listeners de los eventos de socket.io
 * relacionados con "dish" y los maneja de forma correcta.
 *
 * @deprecated
 * Este método está en desuso y se recomienda usar
 * `createDishSocket()` en su lugar, o su hook correspondiente.
 * @see createDishSocket
 * @see useDishSocket
 */
export const setupDishListeners = () => {
  const onCreated = (cb: (dish: DishResponse) => void) =>
    socketClient.on("dish_created", cb);
  const onUpdated = (cb: (dish: DishResponse) => void) =>
    socketClient.on("dish_updated", cb);
  const onDeleted = (cb: ({ id }: DishDeleted) => void) =>
    socketClient.on("dish_deleted", cb);

  return {
    onCreated,
    onUpdated,
    onDeleted,
    cleanup: () => {
      socketClient.off("dish_created");
      socketClient.off("dish_updated");
      socketClient.off("dish_deleted");
    },
  };
};

/**
 * setupTableListeners inicializa los listeners de los eventos de socket.io
 * relacionados con "table" y los maneja de forma correcta.
 *
 * @deprecated
 * Este método está en desuso y se recomienda usar
 * `createTableSocket()` en su lugar, o su hook correspondiente.
 * @see createTableSocket
 * @see useTableSocket
 */
export const setupTableListeners = () => {
  const onCreated = (cb: (table: TableResponse) => void) =>
    socketClient.on("table_created", cb);
  const onOccupied = (cb: (table: TableResponse) => void) =>
    socketClient.on("table_occupied", cb);
  const onDeleted = (cb: ({ id }: TableDeleted) => void) =>
    socketClient.on("table_deleted", cb);
  const onUpdated = (cb: ({ id }: TableDeleted) => void) =>
    socketClient.on("table_updated", cb);

  return {
    onCreated,
    onOccupied,
    onDeleted,
    onUpdated,
    cleanup: () => {
      socketClient.off("table_created");
      socketClient.off("table_occupied");
      socketClient.off("table_deleted");
      socketClient.off("table_updated");
    },
  };
};

/**
 * setupOrderListeners inicializa los listeners de los eventos de socket.io
 * relacionados con "order" y los maneja de forma correcta.
 *
 * @deprecated Este método está en desuso y se recomienda usar
 * `createOrderItemSocket()` en su lugar, o su hook correspondiente.
 * @see createOrderItemSocket
 * @see useOrderItemSocket
 */
export const setupOrderListeners = () => {
  const onCreated = (cb: (order: Order) => void) =>
    socketClient.on("order_item_created", (order: OrderPanel) =>
      cb(parseOrder(order))
    );
  const onUpdated = (cb: (order: Order) => void) =>
    socketClient.on("order_item_updated", (order: OrderPanel) =>
      cb(parseOrder(order))
    );

  return {
    onCreated,
    onUpdated,
    cleanup: () => {
      socketClient.off("order_item_created");
      socketClient.off("order_item_updated");
    },
  };
};
