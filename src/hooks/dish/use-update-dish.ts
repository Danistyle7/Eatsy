import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDishById } from "@/api/dish";
import { DishResponse, DishUpdate } from "@/schemas/dish";

type MutationVariables = { id: DishResponse["id"]; data: DishUpdate };
type Context = { previousDish?: DishResponse };

/**
 * Actualiza un plato existente con rollback automático en errores.
 *
 * @returns {UseMutationResult<DishResponse, Error, { id: DishResponse["id"]; data: DishUpdate }>} - Mutación con:
 *   - `mutate`: Función que recibe `{ id, data }`.
 *   - `variables`: Parámetros de la mutación activa.
 *
 * @behavior
 * 1. Actualización optimista: Modifica la caché antes de la respuesta del servidor.
 * 2. Rollback: Revierte cambios si falla la petición.
 * 3. Invalidación: Recupera datos frescos al finalizar.
 *
 * @example
 * const { mutate } = useUpdateDishById();
 * mutate({ id: 1, data: { price: 9.99 } });
 */
export const useUpdateDishById = () => {
  const queryClient = useQueryClient();

  return useMutation<DishResponse, Error, MutationVariables, Context>({
    mutationFn: ({ id, data }) => updateDishById(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["dish", id] });
      const previousDish = queryClient.getQueryData<DishResponse>(["dish", id]);

      queryClient.setQueryData(["dish", id], (old?: DishResponse) => {
        if (!old) return;
        return { ...old, ...data };
      });

      return { previousDish };
    },
    onError: (_, { id }, context) => {
      queryClient.setQueryData(["dish", id], context?.previousDish);
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["dish", id] });
    },
  });
};
