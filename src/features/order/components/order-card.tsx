import { Image, Text, View } from "react-native";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { ORDER_STATUSES } from "../constants";

import { FontAwesome6 } from "@expo/vector-icons";

export function OrderCard({
  data,
  filterValue,
  isUpdating,
  onChangeStatus,
}: any) {
  const { dish, item, table } = data;

  return (
    <View className="flex-col items-center bg-white rounded-lg shadow-sm overflow-hidden">
      <View className="flex flex-row w-full p-2 gap-2">
        <View className="w-20 h-14 overflow-hidden rounded-lg border-gray-300">
          <Image
            alt={dish.name}
            source={{ uri: dish.imageUrl }}
            className="w-full h-full object-cover"
          />
        </View>

        <View className="flex-grow flex-col max-w-60 w-fit">
          <Text className="text-base text-center font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
            {dish.name}
          </Text>

          <View className="flex flex-row gap-2 justify-around">
            <Text className="text-lg font-semibold text-gray-400">18:15</Text>
            <Text className="text-lg font-semibold text-gray-400">
              x{item.quantity}
            </Text>
          </View>
        </View>
      </View>

      <View
        className={cn("flex-row w-full px-4 justify-between items-center")}
        style={{ backgroundColor: item.status.color }}
      >
        <Text className="text-base font-semibold text-white">
          {filterValue === "number"
            ? item.status.label
            : `Mesa ${table.number}`}
        </Text>

        <View className="flex-row gap-2">
          <Button
            title="Cancel"
            variant="ghost"
            size="icon"
            onPress={() =>
              onChangeStatus(item.id, ORDER_STATUSES.CANCELLED.value)
            }
            disabled={isUpdating}
          >
            <FontAwesome6 name="trash-can" size={16} color="white" />
          </Button>

          <Button
            title="Play"
            variant="ghost"
            size="icon"
            onPress={() => onChangeStatus(item.id, item.status.next)}
            disabled={isUpdating}
          >
            <FontAwesome6 name="play" size={16} color="white" />
          </Button>
        </View>
      </View>
    </View>
  );
}
