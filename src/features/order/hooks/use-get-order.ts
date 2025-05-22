import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { ORDER_QUERY_KEYS } from "../constants";
import { orderService } from "../service";
import type { OrderParams } from "../types";
import { parseOrder } from "../utils";

export const useGetOrders = (params?: OrderParams) => {
  return useQuery<ReturnType<typeof parseOrder>[], ApiError>({
    queryKey: ORDER_QUERY_KEYS.lists(params),
    queryFn: async () => {
      const result = await orderService.panel(params);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data.map(parseOrder);
    },
  });
};
