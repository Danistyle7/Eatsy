import { ORDER_STATUSES } from "./constants";
import type { OrderStatus } from "./constants";
import { OrderPanel } from "./types";

export const getOrderStatus = (status: string): OrderStatus => {
  return ORDER_STATUSES[status as keyof typeof ORDER_STATUSES];
};

export const getOrderStatuses = () => {
  return Object.values(ORDER_STATUSES);
};

export function parseOrder(order: OrderPanel) {
  return {
    order: {
      id: order.id_order,
      _base: order,
    },
    item: {
      id: order.id_order_item,
      quantity: order.quantity,
      status: getOrderStatus(order.status),
    },
    table: {
      id: order.id_table,
      number: order.number,
      // status: order.status,
      // qrCode: order.qrCode,
      // qrCodeUrl: order.qrCodeUrl,
    },
    customer: {
      id: order.id_customer,
      name: order.name_customer,
    },
    dish: {
      id: order.id_dish,
      name: order.name_dish,
      description: order.description,
      price: order.price,
      // category: order.category,
      type: order.type,
      isAvailable: order.isAvailable,
      imageUrl: order.imageUrl,
      prepTime: order.prepTime,
    },
  };
}
