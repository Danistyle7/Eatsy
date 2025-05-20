import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

import { DishResponse } from "@/features/dish/types";
import { usePanelOrder } from "@/features/order/hooks/use-panel-order";
import { OrderPanel, OrderResponse } from "@/features/order/types";
import { TableResponse } from "@/features/table/types";
import { getTableStatus } from "@/features/table/utils";
import "@/shared/styles.css";
import { getDishCategory, getDishType } from "@/features/dish/utils";

export default function HomeScreen() {
  const [filter, setFilter] = useState("tables");

  const { data: orders, isLoading, error } = usePanelOrder();

  const filters = [
    { label: "Por mesas", value: "tables" },
    { label: "Estado de preparación", value: "preparing" },
  ];

  const columns = [
    { title: "Pendientes", dataIndex: "pending", bg: "bg-[#F97316]" },
    { title: "Preparando", dataIndex: "preparing", bg: "bg-[#10B981]" },
    { title: "Listas", dataIndex: "prepared", bg: "bg-[#2563EB]" },
    { title: "Rechazado", dataIndex: "rejected", bg: "bg-[#FB6340]" },
  ];

  // control de respuesta de la API
  if (isLoading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error al cargar los platos: {error.message}</Text>;
  // Asegúrate de que dishes no sea undefined, null o está vacío
  if (!orders?.length) return <Text>No hay platos disponibles</Text>;

  const parsed = orders.map((order) => ({
    order,
    table: {
      id: order.itemOrdes[0].id_table,
      number: order.mesa_number,
      status: order.status,
    },
    dishes: order.itemOrdes.map((item) => ({
      id: item.id_dish,
      name: item.name_dish,
      price: item.price,
      status: item.status,
      isAvailable: item.isAvailable,
      imageUrl: item.imageUrl,
      prepTime: item.prepTime,
    })),
  }));

  const items = Object.groupBy(parsed, ({ table, dishes }) => {
    if (filter === "preparing") return dishes[0]?.status;
    if (filter === "tables") return table.number.toString();
    return "all";
  });

  return (
    <ScrollView
      className="flex-1 bg-[#F7FAFC] h-full"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="px-4 pt-2 h-full">
        <View className="flex-row gap-4">
          <Text className="text-lg font-semibold text-gray-700">
            Filtrar por estado:
          </Text>

          <View className="flex-row gap-4">
            {filters.map((item) => (
              <Button
                key={item.value}
                title={item.label}
                onPress={() => setFilter(item.value)}
                variant={filter === item.value ? "default" : "outline"}
                size="sm"
                className="flex-1 min-w-fit"
              />
            ))}
          </View>
        </View>

        <View className="flex-1 flex-row gap-4 mt-4 justify-center">
          {columns.map((column) => (
            <View
              key={column.dataIndex}
              className="flex-1 bg-gray-200 max-w-96 rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <View className={cn("px-4 py-1 w-full", column.bg)}>
                <Text className="text-lg font-semibold text-white">
                  {column.title}
                </Text>
              </View>

              <View className="flex-1 p-4 gap-2">
                {Object.entries(items).map(([statusOrTableNumber, items]) => (
                  <View
                    key={item.name}
                    className="flex-col gap-4 items-center bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <View className="flex-row">
                      <Text className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </Text>
                      <Text className="text-lg font-semibold text-gray-800">
                        {item.status}
                      </Text>
                    </View>

                    <View
                      className={cn("flex-row w-full px-4 py-1", column.bg)}
                    >
                      <Text className="text-sm font-semibold text-white">
                        {item.name}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
