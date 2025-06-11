import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Button } from "@/shared/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTableCode } from "@/storage/hook";
import { clearUserSession } from "@/storage/user-session";
import { groupBy } from "@/shared/lib/utils";

type PedidoItem = {
  id_customer: number;
  name_customer: string;
  id_order_item: number;
  name_dish: string;
  quantity: number;
  price: number;
};

const DetallePedido = () => {
  const router = useRouter();
  const { recibo } = useLocalSearchParams();
  const tableCode = useTableCode();

  let items: PedidoItem[] = [];
  try {
    const parsed = JSON.parse(recibo as string);
    items = parsed?.data ?? [];
  } catch (error) {
    console.error("Error al parsear el recibo:", error);
  }

  const agrupadoPorCliente = groupBy(items, (item) => item.id_customer);

  const volverInicio = async () => {
    try {
      await clearUserSession();
      router.replace("/");
    } catch (error) {
      console.error("Error al limpiar sesión y volver al inicio:", error);
    }
  };

  const totalGeneral = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView className="p-4 bg-white">
        <View className="items-center mb-4">
          <Text className="text-xl font-bold text-orange-600 text-center">
            Detalle Mesa {tableCode}
          </Text>
        </View>

        {!items.length ? (
          <Text className="text-center text-gray-500 text-base mt-10">
            No hay pedidos registrados para esta mesa.
          </Text>
        ) : (
          Object.entries(agrupadoPorCliente).map(([id, platos]) => (
            <View key={id} className="mb-6">
              <Text className="font-semibold text-gray-800 mb-2">
                {platos[0].name_customer}
              </Text>
              {platos.map((plato) => (
                <View
                  key={plato.id_order_item}
                  className="flex-row justify-between px-2 mb-1"
                >
                  <Text className="text-black">
                    x{plato.quantity} {plato.name_dish}
                  </Text>
                  <Text className="text-black">
                    Bs. {(plato.price * plato.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {items.length > 0 && (
        <View className="flex-row justify-between border-t border-gray-300 pt-4 mt-4 px-4">
          <Text className="text-lg font-bold text-orange-600">Total:</Text>
          <Text className="text-lg font-bold text-orange-600">
            Bs. {totalGeneral.toFixed(2)}
          </Text>
        </View>
      )}

      <Text className="text-center text-orange-500 mt-6 text-lg font-semibold">
        Gracias por su visita
      </Text>

      <View className="p-4 items-center">
        <Button title="Volver al inicio" onPress={volverInicio} />
      </View>
    </SafeAreaView>
  );
};

export default DetallePedido;
