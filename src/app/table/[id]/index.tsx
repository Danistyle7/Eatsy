import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native";

import { useGetTableById } from "@/features/table/hooks";

export default function Screen() {
  const router = useRouter();
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const id = Number(idString);
  // TODO: verificar si esto funciona correctamente
  // Si id no es un número, mostrar un mensaje de error
  if (isNaN(id)) return <Text>Invalid table ID</Text>;

  const { table, isLoading, error: errorGet } = useGetTableById(id);

  if (isLoading) return <Text>Cargando...</Text>;
  if (errorGet) return <Text>Error: {errorGet.message}</Text>;
  if (!table) return <Text>Table not found</Text>;

  return <Text>Table</Text>;
}
