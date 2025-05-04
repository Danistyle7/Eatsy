export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: unknown;

  constructor(
    message: string,
    statusCode: number,
    options?: {
      code?: string;
      details?: unknown;
    }
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = options?.code || "UNKNOWN_ERROR";
    this.details = options?.details || null;

    // Mantiene el stack trace para debugging (opcional)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  // Método para serializar el error (útil para respuestas API)
  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        details: this.details,
      },
    };
  }
}
