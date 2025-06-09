import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/shared/lib/api/errors";
import { ORDER_QUERY_KEYS } from "../constants";
import { orderService } from "../service";
import type { OrderParams } from "../types";
import { parseOrder } from "../utils";

type Order = ReturnType<typeof parseOrder>;

export const useGetOrders = (params?: OrderParams) => {
  const queryClient = useQueryClient();
  const queryKey = ORDER_QUERY_KEYS.lists(params);
  const query = useQuery<Order[], ApiError>({
    queryKey,
    queryFn: async () => {
      const result = await orderService.panel(params);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data.map(parseOrder);
    },
  });
  const setOrders = (
    uploader: Order[] | ((oldData: Order[] | undefined) => Order[])
  ) => {
    queryClient.setQueryData(queryKey, uploader);
  };
  return { orders: query.data || [], setOrders, ...query };
};

export const useGetOrderByTableId = (id: Order["table"]["id"]) => {
  const queryClient = useQueryClient();
  const queryKey = ORDER_QUERY_KEYS.lists({ tableId: id });
  const query = useQuery<Order[], ApiError>({
    queryKey,
    queryFn: async () => {
      const result = await orderService.getByTableId(id);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data.map(parseOrder);
    },
    staleTime: 0, // Los datos se consideran "viejos" de inmediato
    refetchOnMount: "always", // Siempre vuelve a hacer fetch al montar
  });
  const setOrder = (
    updater: Order[] | ((oldData: Order[] | undefined) => Order[])
  ) => {
    queryClient.setQueryData<Order[]>(queryKey, updater);
  };
  return { orders: query.data || [], setOrder, ...query };
};

export const useGetOrdersReadyByTableId = (id: Order["table"]["id"]) => {
  const queryClient = useQueryClient();
  const queryKey = ORDER_QUERY_KEYS.lists({ tableId: id, status: "READY" });
  const query = useQuery<Order[], ApiError>({
    queryKey,
    queryFn: async () => {
      const result = await orderService.getReadyByTableId(id);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data.map(parseOrder);
    },
    staleTime: 0, // Los datos se consideran "viejos" de inmediato
    refetchOnMount: "always", // Siempre vuelve a hacer fetch al montar
  });
  const setOrder = (
    updater: Order[] | ((oldData: Order[] | undefined) => Order[])
  ) => {
    queryClient.setQueryData<Order[]>(queryKey, updater);
  };
  return { orders: query.data || [], setOrder, ...query };
};
