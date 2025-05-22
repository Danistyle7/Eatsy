import { OrderParams, OrderResponse } from "./types";

export const ORDER_QUERY_KEYS = {
  all: ["order"],
  lists: (params?: OrderParams) => [...ORDER_QUERY_KEYS.all, "list", params],
  details: () => [...ORDER_QUERY_KEYS.all, "detail"],
  detail: (id: OrderResponse["id_order"]) => [
    ...ORDER_QUERY_KEYS.details(),
    id,
  ],
};

export const ORDER_STATUSES = {
  PENDING: {
    value: "PENDING",
    label: "Pendiente",
    color: "#F97316",
    next: "IN_PREPARATION",
  },
  IN_PREPARATION: {
    value: "IN_PREPARATION",
    label: "En preparación",
    color: "#10B981",
    next: "READY",
  },
  READY: {
    value: "READY",
    label: "Listo",
    color: "#2563EB",
    next: "DELIVERED",
  },
  DELIVERED: {
    value: "DELIVERED",
    label: "Entregado",
    color: "#F7FAFC",
    next: "PAID",
  },
  CANCELLED: {
    value: "CANCELLED",
    label: "Cancelado",
    color: "#FB6340",
    next: "CANCELLED",
  },
  PAID: {
    value: "PAID",
    label: "Pagado",
    color: "#2563EB",
    next: "PAID",
  },
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];
