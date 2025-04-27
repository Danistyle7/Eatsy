import { z } from "zod";
import { isAxiosError } from "axios";

import { APIResponse } from "@/shared/types/api-response";

export abstract class BaseService {
  protected validateResponse<TData>(
    data: unknown,
    schema: z.ZodSchema<TData>
  ): APIResponse<TData> {
    try {
      return { success: true, data: schema.parse(data) };
    } catch (error) {
      return this.handleError(error, "Respuesta inválida del servidor");
    }
  }

  protected handleError(error: unknown, context: string): APIResponse<never> {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `${context}: ${error.errors
          .map((e) => `${e.path.join(".")} (${e.message})`)
          .join(", ")}`,
      };
    }

    if (isAxiosError(error)) {
      const status = error.response?.status?.toString() || "NETWORK_ERROR";
      const message = error.response?.data?.message || error.message;
      return {
        success: false,
        error: `${context}: ${message}`,
        code: status,
      };
    }

    return {
      success: false,
      error: `${context}: Error desconocido`,
    };
  }
}
