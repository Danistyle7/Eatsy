import { TableResponse } from "@/features/table/types";
import socket from "./socket";
import { DishResponse } from "@/features/dish/types";

type DishDeleted = {
    id: number;
};

type TableDeleted = {
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

    // Eventos de mesas
    socket.on("table_created", (table: TableResponse) => {
        console.log("[WebSocket] 🏷️ Mesa creada:", table);
    });

    socket.on("table_occupied", (table: TableResponse) => {
        console.log("[WebSocket] 🪑 Mesa ocupada:", table);
    });

    socket.on("table_updated", (table: TableResponse) => {
        console.log("[WebSocket] 🪑 Mesa editada:", table);
    });
    
    socket.on("table_deleted", ({ id }: TableDeleted) => {
        console.log("[WebSocket] 🗑️ Mesa eliminada ID:", id);
    });

    return () => {
        console.log("[WebSocket] Limpiando listeners...");
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("dish_created");
        socket.off("dish_updated");
        socket.off("dish_deleted");
        socket.off("table_created");
        socket.off("table_occupied");
        socket.off("table_updated");
        socket.off("table_deleted");
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

export const setupTableListeners = () => {
    const onCreated = (cb: (table: TableResponse) => void) => socket.on("table_created", cb);
    const onOccupied = (cb: (table: TableResponse) => void) => socket.on("table_occupied", cb);
    const onDeleted = (cb: ({ id }: TableDeleted) => void) => socket.on("table_deleted", cb);
    const onUpdated = (cb: ({ id }: TableDeleted) => void) => socket.on("table_updated", cb);

    return {
        onCreated,
        onOccupied,
        onDeleted,
        onUpdated,
        cleanup: () => {
            socket.off("table_created");
            socket.off("table_occupied");
            socket.off("table_deleted");
            socket.off("table_updated");
        }
    };
};