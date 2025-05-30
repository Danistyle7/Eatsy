import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { OrderGroup } from "@/features/order/components/order-groups";
import { filters } from "@/features/order/constants";
import { useGetOrders, useUpdateOrderById } from "@/features/order/hooks";
import { Order } from "@/features/order/types";
import { getOrderStatuses } from "@/features/order/utils";
import { Button } from "@/shared/components/ui/button";
import { ApiError } from "@/shared/lib/api/errors";
import { setupOrderListeners } from "@/shared/lib/socket/socketListeners";

export default function Screen() {
  const orderStatuses = getOrderStatuses();
  const [filter, setFilter] = useState<(typeof filters)[number]>(filters[0]);

  const { isLoading, error: errorGet, orders, setOrders } = useGetOrders();
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrderById();

  useEffect(() => {
    const { onCreated, onUpdated, cleanup } = setupOrderListeners();

    onCreated((newOrder: Order) => {
      setOrders((prev = []) => [...prev, newOrder]);
    });
    onUpdated((updatedOrder: Order) => {
      setOrders((prev = []) =>
        prev.map((order) =>
          order.item.id === updatedOrder.item.id
            ? { ...order, ...updatedOrder } // TODO: Mandar el table_number del backend
            : order
        )
      );
    });
    // onCreated((newOrder) => setOrders((prev = []) => [...prev, newOrder]));

    // onUpdated((updatedOrder) =>
    //   setOrders((prev = []) =>
    //     prev.map((order) =>
    //       order.id_order === updatedOrder.id_order ? updatedOrder : order
    //     )
    //   )
    // );

    return cleanup;
  }, []);

  if (isLoading) return <Text>Cargando...</Text>;
  if (errorGet)
    return <Text>Error al cargar los platos: {errorGet.message}</Text>;
  if (!orders?.length) return <Text>No hay ordenes disponibles</Text>;

  const orderStatusValues = orderStatuses.map(({ value }) => value);
  const grouped = Object.groupBy(
    orders.sort((a, b) => {
      if (a.table.id !== b.table.id) return a.table.id - b.table.id;
      const aStatus = orderStatusValues.indexOf(a.item.status.value);
      const bStatus = orderStatusValues.indexOf(b.item.status.value);
      return aStatus - bStatus;
    }),
    ({
      table: { number },
      item: {
        status: { value: status },
      },
    }) => ({ number, status })[filter.value] as string
  );
  const groupedItems =
    filter.value === "status"
      ? getOrderStatuses()
          .filter(({ value }) => value !== "PAID" && value !== "DELIVERED")
          .map(({ value, label, color }) => ({
            value,
            label,
            color,
            items: grouped[value] || [],
          }))
      : Object.entries(grouped).map(([key, items]) => {
          const { value, label, color } = filter.fn(key);
          return { value, label, color, items: items ?? [] };
        });

  const changeStatus = async (id: number, status: string) => {
    try {
      await updateOrder({ id, data: { status } });
    } catch (error) {
      if (error instanceof ApiError)
        console.error(`${error.code}: ${error.message}`);
      else console.error("Error al cambiar el estado del pedido", error);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#F7FAFC]"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="p-4">
        <View className="md:flex-row gap-4">
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
          {groupedItems.map(({ value, label, color, items }) => (
            <OrderGroup
              key={value}
              label={label}
              color={color}
              items={items}
              filterValue={filter.value}
              isUpdating={isUpdating}
              onChangeStatus={changeStatus}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
