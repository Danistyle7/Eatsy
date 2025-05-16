import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

import { TableForm } from "@/features/table/components/table-form";
import { defaultTable } from "@/features/table/constants";
import { tableCreateSchema } from "@/features/table/schema";
import { TableCreate } from "@/features/table/types";
import { Button } from "@/shared/components/ui/button";

const NewTableScreen = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(tableCreateSchema),
    defaultValues: defaultTable,
  });

  const isPending = form.formState.isSubmitting;
  const buttonTitle = isPending ? "Subiendo..." : "Guardar";

  const handleSubmit = async (data: TableCreate) => {
    console.log("se envió a la API", data);
  };

  const handleBack = () => {
    if (isPending) return;
    router.back();
  };

  return (
    <ScrollView
      className="flex-1 bg-white h-full"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 p-4 h-full">
        <View className="max-w-2xl mx-auto size-full">
          <Text className="text-2xl font-semibold mb-4 text-black">
            Añadir mesa
          </Text>

          <View className="flex-1 items-center justify-center w-full h-full z-0">
            <MaterialCommunityIcons
              name="chef-hat" // Nombre correcto del ícono
              size={150}
              color="rgba(239, 108, 0, 1)" // Naranja con transparencia
            />
            <Text className="text-2xl font-semibold mb-4 text-black">
              Añadir mesa
            </Text>
          </View>

          <TableForm form={form} />

          <View className="flex-row gap-4 mt-6 justify-between h-fit">
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
      </View>
    </ScrollView>
  );
};

export default NewTableScreen;
