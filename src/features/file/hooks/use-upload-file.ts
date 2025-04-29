import { useMutation } from "@tanstack/react-query";
import { fileService } from "../service";
import type { ImageUpload, ImageUploadResponse } from "../types";

export const useUploadFile = () => {
  return useMutation<ImageUploadResponse, Error, ImageUpload>({
    mutationFn: async (file) => {
      const result = await fileService.uploadImage(file);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
};
