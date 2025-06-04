import { useEffect, useState } from "react";
import { DishResponse } from "@/features/dish/types";
import { setupDishListeners } from "@/shared/lib/socket/socketListeners";

type UseDishesOptions = {
  filterType: "FOOD" | "DRINK";
  isAdmin?: boolean;
};

export const useDishesWithWebSocket = (
  initialDishes: DishResponse[] | undefined,
  { filterType, isAdmin = false }: UseDishesOptions
) => {
  const [dishes, setDishes] = useState<DishResponse[]>([]);

  // Sincronizar datos iniciales
  useEffect(() => {
    if (initialDishes) {
      const filtered = isAdmin
        ? initialDishes.filter((d) => d.type === filterType)
        : initialDishes.filter((d) => d.type === filterType && d.isAvailable);
      setDishes(filtered);
    }
  }, [initialDishes, filterType, isAdmin]);

  // Configurar WebSocket
  useEffect(() => {
    const { onCreated, onUpdated, onDeleted, cleanup } = setupDishListeners();

    onCreated((newDish) => {
      if (newDish.type === filterType) {
        setDishes((prev) => {
          // Para admin: añadir siempre, para cliente: solo si está disponible
          const shouldAdd = isAdmin || newDish.isAvailable;
          return shouldAdd && !prev.some((d) => d.id === newDish.id)
            ? [...prev, newDish]
            : prev;
        });
      }
    });

    onUpdated((updatedDish) => {
      if (updatedDish.type === filterType) {
        setDishes((prev) => {
          // Para admin: actualizar siempre
          if (isAdmin) {
            return prev.map((d) => (d.id === updatedDish.id ? updatedDish : d));
          }
          // Para cliente:
          // - Si ahora está disponible: añadir o actualizar
          // - Si ahora no está disponible: remover
          if (updatedDish.isAvailable) {
            return prev.some((d) => d.id === updatedDish.id)
              ? prev.map((d) => (d.id === updatedDish.id ? updatedDish : d))
              : [...prev, updatedDish];
          } else {
            return prev.filter((d) => d.id !== updatedDish.id);
          }
        });
      }
    });

    onDeleted(({ id }) => {
      setDishes((prev) => prev.filter((d) => d.id !== id));
    });

    return cleanup;
  }, [filterType, isAdmin]);

  return dishes;
};
