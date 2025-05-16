import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

import "@/shared/styles.css";

export default function HomeScreen() {
  const [filter, setFilter] = useState("tables");

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

  const data = [
    { name: "Mesa 1", status: "Preparando" },
    { name: "Mesa 2", status: "Preparando" },
    { name: "Mesa 3", status: "Preparando" },
  ];

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
                {data.map((item) => (
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
