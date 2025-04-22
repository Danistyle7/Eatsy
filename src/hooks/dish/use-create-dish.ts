import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDish } from "@/api/dish";
import { DishCreate, DishResponse } from "@/schemas/dish";

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

  return useMutation<DishResponse, Error, DishCreate>({
    mutationFn: createDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
    },
  });
};
