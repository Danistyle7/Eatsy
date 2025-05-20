import { OrderCreate, OrderParams, OrderResponse } from "./types";

export const ORDER_QUERY_KEYS = {
  all: ["order"],
  lists: (params?: OrderParams) => [...ORDER_QUERY_KEYS.all, "list", params],
  details: () => [...ORDER_QUERY_KEYS.all, "detail"],
  detail: (id: OrderResponse["id_order"]) => [
    ...ORDER_QUERY_KEYS.details(),
    id,
  ],
};
