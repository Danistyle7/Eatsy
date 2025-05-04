import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

import { DishForm } from "@/features/dish/components/dish-form";
import { DISH_CATEGORIES, DISH_TYPES } from "@/features/dish/constants";
import { useGetDishById, useUpdateDishById } from "@/features/dish/hooks";
import { dishUpdateSchema } from "@/features/dish/schema";
import { DishUpdate } from "@/features/dish/types";
import { useUploadFile } from "@/features/file/hooks";
import { Button } from "@/shared/components/ui/button";
import { ApiError } from "@/shared/lib/api/errors";
import { getChangedFields } from "@/shared/lib/utils";

export default function EditDishScreen() {
  const router = useRouter();
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = Number(idString);

  const { data: dish, isLoading, error: errorGet } = useGetDishById(id);
  const {
    mutateAsync: uploadFile,
    isPending: isUploading,
    error: errorUpload,
  } = useUploadFile();
  const {
    mutateAsync: updateDish,
    isPending: idUpdating,
    error: errorUpdate,
  } = useUpdateDishById();

  const form = useForm({
    resolver: zodResolver(dishUpdateSchema),
    defaultValues: {
      name: "",
      price: 0,
      isAvailable: true,
      category: DISH_CATEGORIES.APPETIZER.value,
      type: DISH_TYPES.FOOD.value,
      prepTime: 0,
    },
  });

  useEffect(() => {
    if (dish)
      form.reset({
        ...dish,
        description: dish.description || "",
        imageUrl: dish.imageUrl || "",
      });
  }, [dish]);

  const isPending = idUpdating || isUploading;
  const errorMessage = errorUpload?.message || errorUpdate?.message;
  const buttonTitle =
    form.formState.isSubmitting || isPending ? "Subiendo..." : "Guardar";

  if (isLoading) return <Text>Cargando...</Text>;
  if (errorGet) return <Text>Error: {errorGet.message}</Text>;
  if (!dish) return <Text>Plato no encontrado</Text>;

  const handleSubmit = async (data: DishUpdate) => {
    try {
      const changes = getChangedFields(dish, data);
      if (Object.keys(changes).length === 0) return router.back();
      const imageUrl = changes.imageUrl
        ? await uploadFile(changes.imageUrl)
        : dish.imageUrl;
      await updateDish({ id, data: { ...data, imageUrl } });
      router.back();
    } catch (error) {
      if (error instanceof ApiError)
        console.error(`${error.code}: ${error.message}`);
      else console.error("Error creating dish", error);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 p-4 min-h-screen">
        <View className="max-w-2xl mx-auto w-full">
          <Text className="text-2xl font-semibold mb-4">Editar producto</Text>

          <DishForm form={form} />

          <View className="flex-row gap-4 mt-6 justify-between">
            <Button
              title="Cancelar"
              onPress={router.back}
              variant="outline"
              className="flex-1"
            />

            <Button
              title={buttonTitle}
              onPress={form.handleSubmit(handleSubmit)}
              className="flex-1"
            />
          </View>
        </View>

        {errorMessage && (
          <View className="bg-red-500 p-4 rounded-md mt-4">
            <Text className="text-white">{errorMessage}</Text>
          </View>
        )}

        {isPending && (
          <View className="bg-yellow-500 p-4 rounded-md mt-4">
            <Text className="text-white">Guardando...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
