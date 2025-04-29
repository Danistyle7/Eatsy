import { DishForm } from "@/features/dish/components/dish-form";
import { useCreateDish } from "@/features/dish/hooks";
import { View } from "react-native";

export default function DishRegisterScreen() {
  const { mutateAsync: createDish, error } = useCreateDish();

  const handleSubmit = async (data: any) => {
    try {
      const newDish = await createDish(data);
      console.log("Formulario enviado", newDish);
    } catch (err) {
      console.error(err);
      console.log(error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <View className="container bg-white p-4">
        <DishForm onSubmit={handleSubmit} />
      </View>
    </View>
  );
}
