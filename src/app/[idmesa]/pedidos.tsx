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
import { usePedidoStore } from "@/shared/hooks/use_pedido";
export default function PedidoScreen() {
  const [loading, setLoading] = useState(false);
  const { tableCode, idUsuario, idMesa, nombreUsuario } =
    useLocalSearchParams();
  const createOrder = useCreateOrder();

  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const total = getTotal();

  console.log("id del usuario:", idUsuario, idMesa);

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
        console.log("Orden creada correctamente:", data);
        useCartStore.getState().clearCart();

        const nuevosPedidos = items.map((item) => ({
          id: item.id.toString(),
          nombre: item.name.toString(),
          precio: item.price,
          cantidad: item.count,
          usuario: String(nombreUsuario),
          estado: "Pendiente" as const,
          imagen: item.imageUrl || "https://via.placeholder.com/150",
        }));

        usePedidoStore.getState().agregarPedidos(nuevosPedidos);
        router.push({ pathname: `/${tableCode}/mesa-pedido` });
      },
      onError: (error) => {
        console.error("Error al crear la orden:", error.message);
      },
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
          idmesa={tableCode}
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
