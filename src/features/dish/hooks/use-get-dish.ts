import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { DISH_QUERY_KEYS } from "../constants";
import { dishService } from "../service";
import type { DishParams, DishResponse } from "../types";

export const useGetAllDishes = (params?: DishParams) => {
  return useQuery<DishResponse[], Error>({
    queryKey: DISH_QUERY_KEYS.lists(params),
    queryFn: async () => {
      const result = await dishService.getAll(params);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
  });
};

export const useGetDishById = (id: DishResponse["id"], options = {}) => {
  return useQuery<DishResponse, Error>({
    queryKey: DISH_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const result = await dishService.getById(id);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
    enabled: !!id,
    ...options,
  });
};
