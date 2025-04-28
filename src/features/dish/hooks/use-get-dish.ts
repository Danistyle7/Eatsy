import { useQuery } from "@tanstack/react-query";
import { dishService, DishService } from "../service";
import { DISH_QUERY_KEYS } from "../constants";
import type { DishParams, DishResponse } from "../types";

export const useGetAllDishes = (params?: DishParams) => {
  return useQuery<DishResponse[], Error>({
    queryKey: DISH_QUERY_KEYS.lists(params),
    queryFn: async () => {
      const result = await dishService.getAll(params);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
};

export const useGetDishById = (id: DishResponse["id"], options = {}) => {
  return useQuery<DishResponse, Error>({
    queryKey: DISH_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const result = await dishService.getById(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!id,
    ...options,
  });
};
