import { z } from "zod";

import { BaseService } from "@/shared/lib/api/base-service";
import apiClient from "@/shared/lib/api/client";
import type { APIResponse } from "@/shared/lib/api/types/api-response";
import {
  scanTableResponseSchema,
  tableCreateSchema,
  tableParamsSchema,
  tableResponseSchema,
  tableUpdateSchema,
} from "./schema";
import type {
  ScanTableResponse,
  TableCreate,
  TableParams,
  TableResponse,
  TableUpdate,
} from "./types";

/**
 * Servicio para operaciones CRUD de mesas
 * @throws {APIError} - Error estandarizado con código y mensaje
 */
export class TableService extends BaseService {
  async getById(id: TableResponse["id"]): Promise<APIResponse<TableResponse>> {
    try {
      const response = await apiClient.get(`/table/only/${id}`);
      return this.validateResponse(response.data, tableResponseSchema);
    } catch (error) {
      return this.handleError(error, "Mesa no encontrada");
    }
  }

  async getAll(params?: TableParams): Promise<APIResponse<TableResponse[]>> {
    try {
      const validatedParams = tableParamsSchema.parse(params || {});
      const response = await apiClient.get("/table/all", {
        params: validatedParams,
      });
      return this.validateResponse(response.data, z.array(tableResponseSchema));
    } catch (error) {
      return this.handleError(error, "Error al obtener mesas");
    }
  }

  async create(table: TableCreate): Promise<APIResponse<TableResponse>> {
    try {
      const validatedData = tableCreateSchema.parse(table);
      const response = await apiClient.post("/table/create", validatedData);
      return this.validateResponse(response.data, tableResponseSchema);
    } catch (error) {
      return this.handleError(error, "Error al crear mesa");
    }
  }

  async scan(
    qrCode: TableResponse["qrCode"],
    nameCustomer: string
  ): Promise<APIResponse<ScanTableResponse>> {
    try {
      const response = await apiClient.post("/table/scan", {
        qrCode,
        nameCustomer,
      });

      return this.validateResponse(response.data, scanTableResponseSchema);
    } catch (error) {
      return this.handleError(error, "Error al escanear mesas");
    }
  }

  async update(
    id: TableResponse["id"],
    table: TableUpdate
  ): Promise<APIResponse<TableResponse>> {
    try {
      const validatedData = tableUpdateSchema.parse(table);
      const response = await apiClient.patch(
        `/table/update/${id}`,
        validatedData
      );
      return this.validateResponse(response.data, tableResponseSchema);
    } catch (error) {
      return this.handleError(error, "Error al actualizar mesa");
    }
  }

  async delete(id: TableResponse["id"]): Promise<APIResponse<void>> {
    try {
      await apiClient.delete(`/table/delete/${id}`);
      return { success: true, data: undefined };
    } catch (error) {
      return this.handleError(error, "Error al eliminar mesa");
    }
  }

  async pay(id: TableResponse["id"]): Promise<APIResponse<void>> {
    try {
      await apiClient.put(`/table/pay/${id}`);
      return { success: true, data: undefined };
    } catch (error) {
      return this.handleError(error, "Error al pagar mesa");
    }
  }
}

export const tableService = new TableService();
