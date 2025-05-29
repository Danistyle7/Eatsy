import socket from "./socket";
import { DishResponse } from "@/features/dish/types";

type DishDeleted = {
    id: number;
};

export const setupSocketListeners = () => {
    console.log("[WebSocket] Inicializando listeners...");

    socket.on("connect", () => {
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
    const onCreated = (cb: (dish: DishResponse) => void) => socket.on("dish_created", cb);
    const onUpdated = (cb: (dish: DishResponse) => void) => socket.on("dish_updated", cb);
    const onDeleted = (cb: ({ id }: DishDeleted) => void) => socket.on("dish_deleted", cb);

    return {
        onCreated,
        onUpdated,
        onDeleted,
        cleanup: () => {
            socket.off("dish_created");
            socket.off("dish_updated");
            socket.off("dish_deleted");
        }
    };
};