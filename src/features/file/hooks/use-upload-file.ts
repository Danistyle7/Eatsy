import { useMutation } from "@tanstack/react-query";
import { fileService } from "../service";
import type { ImageUpload, ImageUploadResponse } from "../types";
import { ApiError } from "@/shared/lib/api/errors";

export const useUploadFile = () => {
  return useMutation<ImageUploadResponse, Error, ImageUpload>({
    mutationFn: async (file) => {
      const result = await fileService.uploadImage(file);
      if (!result.success)
        throw new ApiError(result.error, parseInt(result.code || "500"));
      return result.data;
    },
  });
};
