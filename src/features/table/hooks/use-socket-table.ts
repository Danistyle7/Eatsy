import { useEffect, useState } from "react";
import { TableResponse, TableStatus } from "@/features/table/types";
import { setupTableListeners } from "@/shared/lib/socket/socketListeners";

// Referencias a hooks y funciones de socket
import { useTableSocket } from "@/features/table/hooks";
import { createTableSocket } from "@/features/table/socket";

type UseTablesOptions = {
  includeDeleted?: boolean; // Opcional: si quieres mostrar mesas "eliminadas"
};

// deprecated
/**
 * @deprecated
 * Este hook está en desuso y se recomienda usar `useTableSocket()` en su lugar.
 * @see useTableSocket
 * @see createTableSocket
 */
export const useTablesWithWebSocket = (
  initialTables: TableResponse[] | undefined,
  options: UseTablesOptions = { includeDeleted: false }
) => {
  const [tables, setTables] = useState<TableResponse[]>([]);

  // Filtrado inicial
  useEffect(() => {
    if (initialTables) {
      const filteredTables = options.includeDeleted
        ? initialTables
        : initialTables.filter((table) => table.status !== "DELETED");
      setTables(filteredTables);
    }
  }, [initialTables, options.includeDeleted]);

  // Configurar listeners de WebSocket
  useEffect(() => {
    const { onCreated, onOccupied, onDeleted, cleanup } = setupTableListeners();

    onCreated((newTable) => {
      // Solo añadir si no está eliminada (o si se incluyen eliminadas)
      if (options.includeDeleted || newTable.status !== "DELETED") {
        setTables((prev) =>
          prev.some((t) => t.id === newTable.id) ? prev : [...prev, newTable]
        );
      }
    });

    onOccupied((updatedTable) => {
      setTables((prev) => {
        // Si la mesa ahora está eliminada y no las mostramos, quitarla
        if (!options.includeDeleted && updatedTable.status === "DELETED") {
          return prev.filter((t) => t.id !== updatedTable.id);
        }

        // Actualizar la mesa
        return prev.map((t) => (t.id === updatedTable.id ? updatedTable : t));
      });
    });

    onDeleted(({ id }) => {
      if (!options.includeDeleted) {
        setTables((prev) => prev.filter((t) => t.id !== id));
      }
    });

    return cleanup;
  }, [options.includeDeleted]);

  return tables;
};
