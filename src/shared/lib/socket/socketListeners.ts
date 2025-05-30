import { Order, OrderPanel, OrderResponse } from "@/features/order/types";
import socket from "./socket";
import { DishResponse } from "@/features/dish/types";
import { parseOrder } from "@/features/order/utils";

type DishDeleted = {
  id: number;
};

export const setupSocketListeners = () => {
  console.log("[WebSocket] Inicializando listeners...");

  socket.on("connection", () => {
    console.log("[WebSocket] ✅ Conectado al servidor");
  });

  socket.on("disconnect", () => {
    console.log("[WebSocket] ❌ Desconectado del servidor");
  });

  socket.on("connect_error", (err) => {
    console.log("[WebSocket] ⚠️ Error de conexión:", err.message);
  });

  socket.on("dish_created", (dish: DishResponse) => {
    console.log("[WebSocket] 🍽️ Plato creado:", dish);
  });

  socket.on("dish_updated", (dish: DishResponse) => {
    console.log("[WebSocket] 🔄 Plato actualizado:", dish);
  });

  socket.on("dish_deleted", ({ id }: DishDeleted) => {
    console.log("[WebSocket] 🗑️ Plato eliminado ID:", id);
  });

  socket.on("order_item_created", (orderItem: unknown) => {
    console.log("[WebSocket] 📦 Item de pedido creado:", orderItem);
  });

  socket.on("order_item_updated", (orderItem: unknown) => {
    console.log("[WebSocket] 🔄 Item de pedido actualizado:", orderItem);
  });

  return () => {
    console.log("[WebSocket] Limpiando listeners...");
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("dish_created");
    socket.off("dish_updated");
    socket.off("dish_deleted");
  };
};

export const setupDishListeners = () => {
  const onCreated = (cb: (dish: DishResponse) => void) =>
    socket.on("dish_created", cb);
  const onUpdated = (cb: (dish: DishResponse) => void) =>
    socket.on("dish_updated", cb);
  const onDeleted = (cb: ({ id }: DishDeleted) => void) =>
    socket.on("dish_deleted", cb);

  return {
    onCreated,
    onUpdated,
    onDeleted,
    cleanup: () => {
      socket.off("dish_created");
      socket.off("dish_updated");
      socket.off("dish_deleted");
    },
  };
};

export const setupOrderListeners = () => {
  const onCreated = (cb: (order: Order) => void) =>
    socket.on("order_item_created", (order: OrderPanel) =>
      cb(parseOrder(order))
    );
  const onUpdated = (cb: (order: Order) => void) =>
    socket.on("order_item_updated", (order: OrderPanel) =>
      cb(parseOrder(order))
    );

  return {
    onCreated,
    onUpdated,
    cleanup: () => {
      socket.off("order_item_created");
      socket.off("order_item_updated");
    },
  };
};
