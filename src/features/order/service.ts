import { z } from "zod";

import { BaseService } from "@/shared/lib/api/base-service";
import apiClient from "@/shared/lib/api/client";
import type { APIResponse } from "@/shared/lib/api/types/api-response";
import {
  orderCreateSchema,
  orderPanelSchema,
  orderResponseSchema,
} from "./schema";
import type {
  OrderCreate,
  OrderPanel,
  OrderParams,
  OrderResponse,
} from "./types";

/**
 * Servicio para operaciones CRUD de platos
 * @throws {APIError} - Error estandarizado con código y mensaje
 */
export class OrderService extends BaseService {
  async create(dish: OrderCreate): Promise<APIResponse<OrderResponse>> {
    try {
      const data = orderCreateSchema.parse(dish);
      const response = await apiClient.post("/order/create", {
        id_table: data.tableId,
        id_customer: data.customerId,
        dishes: data.items.map(({ dishId: id, quantity }) => ({
          id,
          quantity,
        })),
      });
      return this.validateResponse(response.data, orderResponseSchema);
    } catch (error) {
      return this.handleError(error, "Error al crear plato");
    }
  }

  async panel(params?: OrderParams): Promise<APIResponse<OrderPanel[]>> {
    try {
      const response = await apiClient.get("/order/panel", {
        params,
      });
      return this.validateResponse(response.data, z.array(orderPanelSchema));
    } catch (error) {
      return this.handleError(error, "Error al crear plato");
    }
  }
}

export const orderService = new OrderService();
