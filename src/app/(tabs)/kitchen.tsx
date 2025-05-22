import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

import { useGetOrders, useUpdateOrderById } from "@/features/order/hooks";
import { OrderPanel } from "@/features/order/types";
import { getOrderStatus, parseOrder } from "@/features/order/utils";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

import { FontAwesome6 } from "@expo/vector-icons";
import { ORDER_STATUSES } from "@/features/order/constants";
import { ApiError } from "@/shared/lib/api/errors";

// esto puede ir en otro archivos
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return color;
}

const filters = [
  { label: "Estado de preparación", value: "status", fn: getOrderStatus },
  {
    label: "Por mesas",
    value: "number",
    fn: (tableNumber: string) => ({
      label: `Mesa ${tableNumber}`,
      value: Number(tableNumber),
      color: stringToColor(tableNumber),
    }),
  },
] as const;

export default function HomeScreen() {
  const [filter, setFilter] = useState<(typeof filters)[number]>(filters[0]);

  const { data: orders, isLoading, error: errorGet } = useGetOrders();
  const {
    mutate: updateOrder,
    isPending: isUpdating,
    error: errorUpdate,
  } = useUpdateOrderById();

  // control de respuesta de la API
  if (isLoading) return <Text>Cargando...</Text>;
  if (errorGet)
    return <Text>Error al cargar los platos: {errorGet.message}</Text>;
  // Asegúrate de que dishes no sea undefined, null o está vacío
  if (!orders?.length) return <Text>No hay ordenes disponibles</Text>;

  const items = Object.groupBy(
    orders,
    ({
      table: { number },
      item: {
        status: { value: status },
      },
    }) => ({ number, status })[filter.value] as string
  );

  const changeStatus = async (id: number, status: string) => {
    try {
      await updateOrder({ id: id, data: { status } });
    } catch (error) {
      if (error instanceof ApiError)
        console.error(`${error.code}: ${error.message}`);
      else console.error("Error al cambiar el estado del pedido ", error);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#F7FAFC] h-full"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="p-4 h-full">
        <View className="flex-row gap-4">
          <Text className="text-lg font-semibold text-gray-700">
            Filtrar por estado:
          </Text>

          <View className="flex-row gap-4">
            {filters.map((item) => (
              <Button
                key={item.value}
                title={item.label}
                onPress={() => setFilter(item)}
                variant={filter.value === item.value ? "default" : "outline"}
                size="sm"
                className="flex-1 min-w-fit"
              />
            ))}
          </View>
        </View>

        <View className="md:flex-1 md:flex-row gap-4 mt-4 justify-center">
          {Object.entries(items).map(([str, items]) => {
            const { value, label, color } = filter.fn(str);
            return (
              <View
                key={value}
                className="flex-1 bg-gray-200 max-w-96 rounded-lg border border-gray-200 shadow-sm overflow-hidden"
              >
                <View
                  className={cn("px-4 py-1 w-full")}
                  style={{ backgroundColor: color }}
                >
                  <Text className="text-lg font-semibold text-white">
                    {label}
                  </Text>
                </View>

                <View className="flex-1 p-4 gap-2">
                  {items?.map(({ dish, item, table, order }) => (
                    <View
                      key={dish.name}
                      className="flex-col items-center bg-white rounded-lg shadow-sm overflow-hidden"
                    >
                      <View className="flex flex-row w-full p-2 gap-2">
                        <View className="w-20 h-14 overflow-hidden rounded-lg border-gray-300">
                          <Image
                            alt={dish.name}
                            source={{ uri: dish.imageUrl }}
                            className="w-full h-full object-cover object-center"
                          />
                        </View>

                        <View className="flex-grow flex-col max-w-60 w-fit">
                          <Text className="text-base text-center font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                            {dish.name}
                          </Text>

                          <View className="flex flex-row gap-2 justify-around">
                            <Text className="text-lg font-semibold text-gray-400">
                              {/* TODO: Mandas del backend el createdAt del order/item, example: order.createdAt  */}
                              18:15
                            </Text>

                            <Text className="text-lg font-semibold text-gray-400">
                              x{item.quantity}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View
                        className={cn(
                          "flex-row w-full px-4 justify-between items-center"
                        )}
                        style={{ backgroundColor: item.status.color }}
                      >
                        <Text className="text-base font-semibold text-white">
                          {filter.value === "number"
                            ? item.status.label
                            : `Mesa ${table.number}`}
                        </Text>

                        <View className="flex-row gap-2">
                          <Button
                            title="Cancel"
                            variant="ghost"
                            size="icon"
                            onPress={() =>
                              changeStatus(
                                item.id,
                                ORDER_STATUSES.CANCELLED.value
                              )
                            }
                            disabled={isUpdating}
                          >
                            <FontAwesome6
                              name="trash-can"
                              size={16}
                              color="white"
                            />
                          </Button>

                          <Button
                            title="Play"
                            variant="ghost"
                            size="icon"
                            onPress={() =>
                              changeStatus(item.id, item.status.next)
                            }
                            disabled={isUpdating}
                          >
                            <FontAwesome6 name="play" size={16} color="white" />
                          </Button>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
