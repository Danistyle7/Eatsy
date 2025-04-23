import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteDishById } from "@/api/dish";
import { DishResponse } from "@/schemas/dish";

type Context = { previousDishes?: DishResponse[] };

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
      await queryClient.cancelQueries({ queryKey: ["dishes"] });
      const previousDishes = queryClient.getQueryData<DishResponse[]>([
        "dishes",
      ]);

      queryClient.setQueryData(["dishes"], (old: DishResponse[] = []) =>
        old.filter((dish) => dish.id !== id)
      );

      return { previousDishes };
    },
    onError: (_, __, context) => {
      if (context?.previousDishes) {
        queryClient.setQueryData(["dishes"], context.previousDishes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
    },
  });
};
