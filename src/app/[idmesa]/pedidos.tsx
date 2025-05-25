// /app/pedido/[id].tsx
import { useRouter } from "expo-router";
import Header from "@/shared/components/ui/header";
import BotonNaranja from "@/shared/components/ui/button";
import { View, Text, FlatList } from "react-native";
import { useCartStore } from "@/shared/hooks/use_cardstore";
import PedidoItem from "@/shared/components/ui/pedido_detail";
import { idSchema } from "@/shared/schemas";
import { useLocalSearchParams } from "expo-router";
import { useCreateOrder } from "@/features/order/hooks";

export default function PedidoScreen() {
  const { tableCode, idUsuario, idMesa } = useLocalSearchParams();
  const createOrder = useCreateOrder();

  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal); // 👈 obtenemos la función
  const total = getTotal();
  console.log("id del usuario:", idUsuario, idMesa);
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
          <BotonNaranja
            titulo="Confirmar pedido"
            onPress={() => {
              const rawOrder = {
                id_table: Number(idMesa),
                id_customer: Number(idUsuario),
                dishes: items.map((item) => ({
                  id: Number(item.id),
                  quantity: item.count,
                })),
              };

              const formattedOrder = {
                tableId: rawOrder.id_table,
                customerId: rawOrder.id_customer,
                items: rawOrder.dishes.map((dish) => ({
                  dishId: dish.id,
                  quantity: dish.quantity,
                })),
              };

              createOrder.mutate(formattedOrder, {
                onSuccess: (data) => {
                  console.log("Orden creada correctamente:", data);

                  useCartStore.getState().clearCart();

                  router.push({
                    pathname: `/${tableCode}/mesa-pedido`,
                    params: {
                      data: JSON.stringify(data),
                    },
                  });
                },
                onError: (error) => {
                  console.error("Error al crear la orden:", error.message);
                },
              });
            }}
          />
        </View>
      </View>
    </View>
  );
}
