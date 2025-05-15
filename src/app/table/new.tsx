import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
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
  const buttonSuccessTitle = isPending ? "Subiendo..." : "Guardar";

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
      <View className="flex-1 p-4 justify-between">
        <View className="max-w-2xl mx-auto">
          <View className="flex-1 items-center justify-center w-full min-h-60 z-0">
            <MaterialCommunityIcons
              name="chef-hat"
              size={150}
              color="rgba(239, 108, 0, 1)"
            />
            <Text className="text-2xl font-semibold mb-4 text-black">
              Añadir mesa
            </Text>
          </View>

          <TableForm form={form} />
        </View>

        <View className="flex-row gap-4">
          <Link href=".." className="flex-1" asChild>
            <Button
              title="Cancelar"
              disabled={isPending}
              variant="outline"
              className="flex-1"
            />
          </Link>

          <Button
            title={buttonSuccessTitle}
            disabled={isPending}
            onPress={form.handleSubmit(handleSubmit)}
            className="flex-1"
          />
        </View>
        {/* </View> */}
      </View>
    </ScrollView>
  );
};

export default NewTableScreen;
