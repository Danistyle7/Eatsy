import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

import { DishForm } from "@/features/dish/components/dish-form";
import { defaultDish } from "@/features/dish/constants";
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
  const { mutateAsync: uploadFile, error: errorUpload } = useUploadFile();
  const { mutateAsync: updateDish, error: errorUpdate } = useUpdateDishById();

  const form = useForm({
    resolver: zodResolver(dishUpdateSchema),
    defaultValues: defaultDish,
  });

  useEffect(() => {
    if (dish) form.reset({ ...defaultDish, ...dish });
  }, [dish]);

  if (isLoading) return <Text>Cargando...</Text>;
  if (errorGet) return <Text>Error: {errorGet.message}</Text>;
  if (!dish) return <Text>Plato no encontrado</Text>;

  const isPending = form.formState.isSubmitting;
  const errorMessage = errorUpload?.message || errorUpdate?.message;
  const buttonTitle = isPending ? "Subiendo..." : "Guardar";

  const handleSubmit = async (data: DishUpdate) => {
    try {
      const changes = getChangedFields(dish, data);
      if (Object.keys(changes).length === 0) return router.back();
      if (changes.imageUrl)
        changes.imageUrl = await uploadFile(changes.imageUrl);
      await updateDish({ id, data: changes });
      router.navigate("/menu");
    } catch (error) {
      if (error instanceof ApiError)
        console.error(`${error.code}: ${error.message}`);
      else console.error("Error creating dish", error);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white h-full"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 p-4 justify-between">
        <View className="max-w-2xl mx-auto">
          <Text className="text-2xl font-semibold mb-4 text-black">
            Editar producto
          </Text>

          <DishForm form={form} />
        </View>

        <View className="flex-row gap-4 mt-6 justify-between">
          <Link href="/menu" className="flex-1" asChild>
            <Button
              title="Cancelar"
              disabled={isPending}
              variant="outline"
              className="flex-1"
            />
          </Link>

          <Button
            title={buttonTitle}
            disabled={isPending}
            onPress={form.handleSubmit(handleSubmit)}
            className="flex-1"
          />
        </View>
      </View>
    </ScrollView>
  );
}
