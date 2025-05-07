import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

import { DishForm } from "@/features/dish/components/dish-form";
import { defaultDish } from "@/features/dish/constants";
import { useCreateDish } from "@/features/dish/hooks";
import { dishCreateSchema } from "@/features/dish/schema";
import { DishCreate } from "@/features/dish/types";
import { useUploadFile } from "@/features/file/hooks";
import { Button } from "@/shared/components/ui/button";
import { ApiError } from "@/shared/lib/api/errors";

export default function DishRegisterScreen() {
  const router = useRouter();

  const { mutateAsync: createDish, error: errorCreate } = useCreateDish();
  const { mutateAsync: uploadFile, error: errorUpload } = useUploadFile();

  const form = useForm({
    resolver: zodResolver(dishCreateSchema),
    defaultValues: defaultDish,
  });

  const isPending = form.formState.isSubmitting;
  const errorMessage = errorUpload?.message || errorCreate?.message;
  const buttonTitle = isPending ? "Subiendo..." : "Guardar";

  const handleSubmit = async (data: DishCreate) => {
    try {
      const imageUrl = await uploadFile(data.imageUrl);
      await createDish({ ...data, imageUrl });
      router.back();
    } catch (error) {
      if (error instanceof ApiError)
        console.error(`${error.code}: ${error.message}`);
      else console.error("Error creating dish", error);
    }
  };

  const handleBack = () => {
    if (isPending) return;
    router.back();
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 p-4 h-full">
        <View className="max-w-2xl mx-auto w-full">
          <Text className="text-2xl font-semibold mb-4 text-black">
            Añadir producto
          </Text>

          <DishForm form={form} />

          <View className="flex-row gap-4 mt-6 justify-between">
            <Button
              title="Cancelar"
              onPress={handleBack}
              disabled={isPending}
              variant="outline"
              className="flex-1"
            />

            <Button
              title={buttonTitle}
              disabled={isPending}
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
