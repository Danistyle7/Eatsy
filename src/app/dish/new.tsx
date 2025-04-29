import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { DishForm } from "@/features/dish/components/dish-form";
import { useCreateDish } from "@/features/dish/hooks";
import { ApiError } from "@/shared/lib/api/errors";

export default function DishRegisterScreen() {
  const router = useRouter();
  const { mutateAsync: createDish, isPending, error } = useCreateDish();

  const handleSubmit = async (data: any) => {
    try {
      const newDish = await createDish(data);
      console.log("Dish created successfully", newDish);
      router.back();
    } catch (error) {
      if (error instanceof ApiError)
        console.error(`${error.code}: ${error.message}`);
      else console.error("Error creating dish", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <View className="container bg-white p-4">
        <DishForm onSubmit={handleSubmit} isPending={isPending} />
        {error && (
          <View className="bg-red-500 p-4 rounded-md mt-4">
            <Text className="text-white">{error.message}</Text>
          </View>
        )}
        {isPending && (
          <View className="bg-yellow-500 p-4 rounded-md mt-4">
            <Text className="text-white">Guardando...</Text>
          </View>
        )}
      </View>
    </View>
  );
}
