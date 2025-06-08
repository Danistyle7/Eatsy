import { Text, View } from "react-native";

import { cn } from "@/shared/lib/utils";
import { Order } from "../types";
import { OrderCard } from "./order-card";

interface OrderGroupProps {
  label: string;
  color: string;
  items: Order[];
  filterValue: string;
  isUpdating: boolean;
  onChangeStatus: (id: number, status: string) => void;
}

export function OrderGroup({
  label,
  color,
  items,
  filterValue,
  isUpdating,
  onChangeStatus,
}: OrderGroupProps) {
  return (
    <View className="md:flex-1 bg-gray-200 max-w-96 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <View
        className={cn("px-4 py-1 w-full")}
        style={{ backgroundColor: color }}
      >
        <Text className="text-lg font-semibold text-white">{label}</Text>
      </View>

      <View className="flex-1 p-4 gap-2">
        {items.map((item) => (
          <OrderCard
            key={`${item.order.id}-${item.item.id}`}
            data={item}
            filterValue={filterValue}
            isUpdating={isUpdating}
            onChangeStatus={onChangeStatus}
          />
        ))}
      </View>
    </View>
  );
}
