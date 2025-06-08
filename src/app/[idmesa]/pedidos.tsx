// /app/pedido/[id].tsx
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Header from "@/shared/components/ui/header";
import { View, Text, FlatList } from "react-native";
import { useCartStore } from "@/shared/hooks/use_cardstore";
import PedidoItem from "@/shared/components/ui/pedido_detail";
import { useLocalSearchParams } from "expo-router";
import { useCreateOrder } from "@/features/order/hooks";
import { Button } from "@/shared/components/ui/button";
import { useTableCode, useUserId, useTableId } from "@/storage/hook";
export default function PedidoScreen() {
  const tableCode = useTableCode();
  const idUsuario = useUserId();
  const idMesa = useTableId();
  const [loading, setLoading] = useState(false);

  useLocalSearchParams();
  const createOrder = useCreateOrder();

  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const total = getTotal();

  const handleConfirmarPedido = () => {
    setLoading(true);

    const formattedOrder = {
      tableId: Number(idMesa),
      customerId: Number(idUsuario),
      items: items.map((item) => ({
        dishId: Number(item.id),
        quantity: item.count,
      })),
    };

    createOrder.mutate(formattedOrder, {
      onSuccess: (data) => {
        useCartStore.getState().clearCart();

        router.push({ pathname: `/${tableCode}/mesa-pedido` });
      },
      onError: (error) => {},
      onSettled: () => {
        setLoading(false);
      },
    });
  };
  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-2">
        {/* <BotonNaranja titulo="Atras" onPress={router.back} /> */}
        <Header
          titulo="Pedidos"
          mostrarBusqueda={false}
          mostrarAgregar={false}
          idmesa={tableCode ?? ""}
        />
      </View>

      {items.length === 0 ? (
        <Text className="text- mt-4 text-gray-600">
          No hay platos en el pedido aún.
        </Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PedidoItem item={item} />}
          contentContainerStyle={{ paddingBottom: 90 }}
        />
      )}
      <View className="absolute bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-300 items-center ">
        <View className="flex-row justify-between w-full px-14">
          <Text className="text-lg font-semibold text-orange-500">Total</Text>
          <Text className="text-lg font-semibold text-black">
            Bs. {total.toFixed(2)}
          </Text>
        </View>
        <View className=" items-center p-1">
          <Button
            title={loading ? "Confirmando..." : "Confirmar pedido"}
            onPress={handleConfirmarPedido}
            disabled={loading || items.length === 0}
            className=" mt-2 mb-4 items-center"
          />
        </View>
      </View>
    </View>
  );
}
