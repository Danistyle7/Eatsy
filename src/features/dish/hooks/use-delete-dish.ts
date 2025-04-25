import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteDishById } from "@/features/dish/api";
import { DishResponse } from "../types";
import { DISH_QUERY_KEYS } from "../constants";

type Context = { previous?: DishResponse[] };

/**
 * Elimina un plato por ID con actualización optimista de la UI.
 *
 * @returns {UseMutationResult<void, Error, DishResponse["id"]>} - Mutación con:
 *   - `mutate`: Función que recibe el ID a eliminar.
 *   - `status`: Estado actual ('idle', 'pending', 'error', 'success').
 *
 * @errorHandling
 * - Muestra toast.error si falla.
 * - Revierte cambios en la caché automáticamente.
 *
 * @note
 * Para confirmación antes de eliminar, envolver en un modal:
 *
 * @example
 * const { mutate } = useDeleteDishById();
 * <Button onClick={() => confirmModal(() => mutate(1))}>
 *   Eliminar
 * </Button>
 */
export const useDeleteDishById = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DishResponse["id"], Context>({
    mutationFn: deleteDishById,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: DISH_QUERY_KEYS.lists() });
      const previous = queryClient.getQueryData<DishResponse[]>(
        DISH_QUERY_KEYS.lists()
      );

      queryClient.setQueryData(
        DISH_QUERY_KEYS.lists(),
        (old: DishResponse[] = []) => old.filter((dish) => dish.id !== id)
      );

      return { previous };
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DISH_QUERY_KEYS.lists(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DISH_QUERY_KEYS.lists() });
    },
  });
};
