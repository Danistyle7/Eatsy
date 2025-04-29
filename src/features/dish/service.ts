import { z } from "zod";

import {
  dishCreateSchema,
  dishParamsSchema,
  dishResponseSchema,
  dishUpdateSchema,
} from "@/features/dish/schema";
import type {
  DishCreate,
  DishParams,
  DishResponse,
  DishUpdate,
} from "@/features/dish/types";
import { BaseService } from "@/shared/lib/api/base-service";
import apiClient from "@/shared/lib/api/client";
import type { APIResponse } from "@/shared/lib/api/types/api-response";

/**
 * Servicio para operaciones CRUD de platos
 * @throws {APIError} - Error estandarizado con código y mensaje
 */
export class DishService extends BaseService {
  async getById(id: DishResponse["id"]): Promise<APIResponse<DishResponse>> {
    try {
      const response = await apiClient.get(`/dish/only/${id}`);
      return this.validateResponse(response.data, dishResponseSchema);
    } catch (error) {
      return this.handleError(error, "Plato no encontrado");
    }
  }

  async getAll(params?: DishParams): Promise<APIResponse<DishResponse[]>> {
    try {
      const validatedParams = dishParamsSchema.parse(params || {});
      const response = await apiClient.get("/dish/filter", {
        params: validatedParams,
      });
      return this.validateResponse(response.data, z.array(dishResponseSchema));
    } catch (error) {
      return this.handleError(error, "Error al obtener platos");
    }
  }

  async create(dish: DishCreate): Promise<APIResponse<DishResponse>> {
    try {
      const validatedData = dishCreateSchema.parse(dish);
      const response = await apiClient.post("/dish/create", validatedData);
      return this.validateResponse(response.data, dishResponseSchema);
    } catch (error) {
      return this.handleError(error, "Error al crear plato");
    }
  }

  async update(
    id: DishResponse["id"],
    dish: DishUpdate
  ): Promise<APIResponse<DishResponse>> {
    try {
      const validatedData = dishUpdateSchema.parse(dish);
      const response = await apiClient.patch(
        `/dish/update/${id}`,
        validatedData
      );
      return this.validateResponse(response.data, dishResponseSchema);
    } catch (error) {
      return this.handleError(error, "Error al actualizar plato");
    }
  }

  async delete(id: DishResponse["id"]): Promise<APIResponse<void>> {
    try {
      await apiClient.delete(`/dish/delete/${id}`);
      return { success: true, data: undefined };
    } catch (error) {
      return this.handleError(error, "Error al eliminar plato");
    }
  }
}

export const dishService = new DishService();
