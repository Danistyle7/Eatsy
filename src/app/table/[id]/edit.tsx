import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";

import { TableForm } from "@/features/table/components/table-form";
import { defaultTable } from "@/features/table/constants";
import { useGetTableById, useUpdateTableById } from "@/features/table/hooks";
import { tableUpdateSchema } from "@/features/table/schema";
import { TableUpdate } from "@/features/table/types";
import { Button } from "@/shared/components/ui/button";
import { ApiError } from "@/shared/lib/api/errors";
import { getChangedFields } from "@/shared/lib/utils";

const EditTableScreen = () => {
  const router = useRouter();
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = Number(idString);

  const { data: table, isLoading, error: errorGet } = useGetTableById(id);
  const { mutateAsync: updateTable, error: errorUpdate } = useUpdateTableById();

  const form = useForm({
    resolver: zodResolver(tableUpdateSchema),
    defaultValues: defaultTable,
  });

  useEffect(() => {
    if (table) form.reset({ ...defaultTable, ...table });
  }, [table]);

  if (isLoading) return <Text>Cargando...</Text>;
  if (errorGet) return <Text>Error: {errorGet.message}</Text>;
  if (!table) return <Text>Mesa no encontrada</Text>;

  const isPending = form.formState.isSubmitting;
  const errorMessage = errorUpdate?.message;
  const buttonSuccessTitle = isPending ? "Subiendo..." : "Guardar";

  const handleSubmit = async (data: TableUpdate) => {
    try {
      const changes = getChangedFields(table, data);
      if (Object.keys(changes).length === 0) return;
      await updateTable({ id, data: changes });
      router.push("/tables");
    } catch (error) {
      if (error instanceof ApiError)
        console.error(`${error.code}: ${error.message}`);
      else console.error("Error creating table", error);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white h-full"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 p-4 justify-between">
        <View className="max-w-full md:max-w-2xl mx-auto">
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
          <Link href="/tables" className="flex-1" asChild>
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
      </View>
    </ScrollView>
  );
};

export default EditTableScreen;
