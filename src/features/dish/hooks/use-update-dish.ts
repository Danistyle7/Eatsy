import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dishService } from "../service";
import { DISH_QUERY_KEYS } from "../constants";
import type { DishResponse, DishUpdate } from "../types";

type MutationVariables = { id: DishResponse["id"]; data: DishUpdate };
type Context = { previous?: DishResponse };

export const useUpdateDishById = () => {
  const queryClient = useQueryClient();

  return useMutation<DishResponse, Error, MutationVariables, Context>({
    mutationFn: async ({ id, data }) => {
      const result = await dishService.update(id, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: DISH_QUERY_KEYS.detail(id) });
      const previous = queryClient.getQueryData<DishResponse>(
        DISH_QUERY_KEYS.detail(id)
      );

      queryClient.setQueryData(
        DISH_QUERY_KEYS.detail(id),
        (old?: DishResponse) => (old ? { ...old, ...data } : undefined)
      );

      return { previous };
    },
    onError: (_, { id }, context) => {
      queryClient.setQueryData(DISH_QUERY_KEYS.detail(id), context?.previous);
    },
    onSettled: (data, _, { id }) => {
      queryClient.invalidateQueries({ queryKey: DISH_QUERY_KEYS.detail(id) });
      if (data)
        queryClient.invalidateQueries({ queryKey: DISH_QUERY_KEYS.lists() });
    },
  });
};
