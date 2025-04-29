import { z } from "zod";
import { isAxiosError } from "axios";

import { APIResponse } from "@/shared/lib/api/types/api-response";
import { ApiError } from "./errors";
import { apiResponseSchema } from "@/shared/lib/api/schema";

export abstract class BaseService {
  protected validateResponse<TData>(
    data: unknown,
    schema: z.ZodSchema<TData>
  ): APIResponse<TData> {
    try {
      const response = apiResponseSchema.parse(data);
      if (!response.success) throw new ApiError(response.message, 400);
      return { success: true, data: schema.parse(response.data) };
    } catch (error) {
      return this.handleError(error, "Respuesta inválida del servidor");
    }
  }

  protected handleError(error: unknown, context: string): APIResponse<never> {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: `${context}: ${error.message}`,
        code: error.code,
      };
    }

    if (error instanceof z.ZodError)
      return {
        success: false,
        error: `${context}: ${error.errors
          .map((e) => `${e.path.join(".")} (${e.message})`)
          .join(", ")}`,
      };

    if (isAxiosError(error)) {
      const status = error.response?.status?.toString() || "NETWORK_ERROR";
      const message = error.response?.data?.message || error.message;
      return {
        success: false,
        error: `${context}: ${message}`,
        code: status,
      };
    }

    if (error instanceof Error)
      return { success: false, error: `${context}: ${error.message}` };

    return { success: false, error: `${context}: Error desconocido` };
  }
}
