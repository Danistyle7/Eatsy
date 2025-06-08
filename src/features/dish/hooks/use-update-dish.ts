import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { DISH_QUERY_KEYS } from "../constants";
import { dishService } from "../service";
import type { DishResponse as Dish, DishUpdate } from "../types";

type MutationVariables = { id: Dish["id"]; data: DishUpdate };
type Context = { previous?: Dish };

export const useUpdateDishById = () => {
  const queryClient = useQueryClient();
  return useMutation<Dish, ApiError, MutationVariables, Context>({
    mutationFn: async ({ id, data }) => {
      const result = await dishService.update(id, data);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    onMutate: async ({ id, data }) => {
      const queryKey = DISH_QUERY_KEYS.detail(id);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Dish>(queryKey);

      queryClient.setQueryData(queryKey, (old?: Dish) =>
        old ? { ...old, ...data } : undefined
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
