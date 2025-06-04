import { DishResponse } from "@/features/dish/types";
import { Order, OrderPanel } from "@/features/order/types";
import { parseOrder } from "@/features/order/utils";
import { socketClient } from "./client";

type DishDeleted = {
  id: number;
};

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
  };
};

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
