import { DishForm } from "@/features/dish/components/dish-form";
import { View } from "react-native";

export default function DishRegisterScreen() {
  const handleSubmit = (data: any) => {
    console.log("Formulario enviado", data);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <View className="container bg-white p-4">
        <DishForm onSubmit={handleSubmit} />
      </View>
    </View>
  );
}
