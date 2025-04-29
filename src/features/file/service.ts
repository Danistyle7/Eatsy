import { BaseService } from "@/shared/lib/api/base-service";
import apiClient from "@/shared/lib/api/client";
import type { APIResponse } from "@/shared/lib/api/types/api-response";
import { imageUrlResponseSchema } from "./schemas";

export class FileService extends BaseService {
  async uploadImage(fileUri: string): Promise<APIResponse<string>> {
    try {
      const formData = new FormData();

      // Convertir la URI base64 a Blob (solo si es necesario)
      // Si la URI es local (file://), omitir este paso.
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Obtener tipo MIME desde el blob
      const mimeType = blob.type.split("/")[1];
      const allowedTypes = ["jpeg", "jpg", "png", "webp"];

      if (!allowedTypes.includes(mimeType)) {
        return {
          success: false,
          error: "Formato de imagen no válido",
        };
      }

      // Generar nombre de archivo con extensión correcta
      const fileName = `dish_${Date.now()}.${mimeType}`;

      formData.append("image", blob, fileName);

      const responseUpload = await apiClient.post(
        "/multimedia/upload",
        formData
      );
      return this.validateResponse(responseUpload.data, imageUrlResponseSchema);
    } catch (error) {
      return this.handleError(error, "Error al subir imagen");
    }
  }
}

export const fileService = new FileService();
