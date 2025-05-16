import { Link } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { useGetAllTables } from "@/features/table/hooks";
import { TableResponse } from "@/features/table/types";
import { getTableStatus } from "@/features/table/utils";
import { Button } from "@/shared/components/ui/button";
import { FloatingButton } from "@/shared/components/ui/floating-button";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import QRModal from "@/shared/components/ui/qr-modal";

const TablesScreen = () => {
  const [qrValue, setQrValue] = useState("");
  const { data: tables, isLoading, error } = useGetAllTables();

  if (isLoading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error al cargar mesas: {error.message}</Text>;
  if (!tables?.length) return <Text>No hay mesas disponibles</Text>;

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white px-4 pt-2">
        <View className="flex-1 bg-white gap-2">
          {tables.map((table) => (
            <View
              key={table.id}
              className="flex-row bg-white px-4 py-2 border border-[#F97316] rounded-xl justify-between"
            >
              <View className="flex-row gap-2 items-center">
                <Text className="text-lg font-semibold text-gray-800">
                  Mesa {table.number}
                </Text>
                <Text>{getTableStatus(table.status).icon}</Text>
              </View>

              <View className="flex-row">
                <Link href={`/table/${table.id}/edit`} asChild>
                  <Button title="Editar" size="icon" variant="ghost">
                    <AntDesign name="edit" size={24} color="black" />
                  </Button>
                </Link>

                <Button
                  title="Ver QR"
                  size="icon"
                  variant="ghost"
                  onPress={() => setQrValue(table.qrCode)}
                >
                  <MaterialCommunityIcons
                    name="qrcode"
                    size={24}
                    color="black"
                  />
                </Button>

                <Button
                  title="Eliminar"
                  size="icon"
                  variant="ghost"
                  onPress={() => console.log("Eliminar mesa", table)}
                >
                  <FontAwesome6 name="trash-can" size={24} color="black" />
                </Button>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <QRModal
        title="Código QR de la mesa"
        visible={!!qrValue}
        value={qrValue}
        onClose={() => setQrValue("")}
        onSave={console.log}
      />

      <FloatingButton href="/table/new" icon="add" />
    </View>
  );
};

export default TablesScreen;
