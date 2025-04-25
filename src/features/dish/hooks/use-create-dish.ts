import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDish } from "@/features/dish/api";
import { DishCreate, DishResponse } from "../types";
import { DISH_QUERY_KEYS } from "../constants";

type Context = { previous?: DishResponse[] };

/**
 * Crea un nuevo plato con actualización automática de la caché.
 *
 * @returns {UseMutationResult<DishResponse, Error, DishCreate>} - Mutación con:
 *   - `mutate`: Función para ejecutar (recibe `DishCreate`).
 *   - `isPending`: Estado de carga durante la creación.
 *   - `isSuccess`: True si se creó exitosamente.
 *
 * @sideEffects
 * - Actualiza la caché de `['dishes']` con el nuevo plato.
 * - Muestra notificación toast en éxito/error.
 *
 * @example
 * const { mutate, isPending } = useCreateDish();
 *
 * <form onSubmit={(data) => mutate(data)}>
 *   <button disabled={isPending}>
 *     {isPending ? 'Creando...' : 'Crear Plato'}
 *   </button>
 * </form>
 */
export const useCreateDish = () => {
  const queryClient = useQueryClient();

  return useMutation<DishResponse, Error, DishCreate, Context>({
    mutationFn: createDish,
    onMutate: async (newDish) => {
      await queryClient.cancelQueries({ queryKey: DISH_QUERY_KEYS.lists() });
      const previous = queryClient.getQueryData<DishResponse[]>(
        DISH_QUERY_KEYS.lists()
      );

      queryClient.setQueryData(
        DISH_QUERY_KEYS.lists(),
        (old: DishResponse[] = []) => [...old, { ...newDish, id: Date.now() }]
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
