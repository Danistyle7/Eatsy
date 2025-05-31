import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { DISH_TYPES } from "@/features/dish/constants";
import { useGetAllDishes } from "@/features/dish/hooks";
import { getDishCategory } from "@/features/dish/utils";
import Header from "@/shared/components/ui/header";
import Section from "@/shared/components/ui/section";
import { useDishesWithWebSocket } from "@/features/dish/hooks/use-socket-dish";

export const MenuScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [esCliente, setEsCliente] = useState(false);

  const { data, isLoading, error, refetch } = useGetAllDishes({ 
    type: DISH_TYPES.FOOD.value 
  });
  
  const dishes = useDishesWithWebSocket(data, {
    filterType: "FOOD",
    isAdmin: true
  });

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  if (isLoading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!dishes?.length) return <Text>No hay platos disponibles</Text>;

  const grouped = dishes.reduce((acc, dish) => {
    const cat = dish.category;
    acc[cat] = [...(acc[cat] || []), dish];
    return acc;
  }, {} as Record<string, typeof dishes>);

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-2">
        <Header titulo="Menú" busqueda={busqueda} setBusqueda={setBusqueda} />
      </View>

      <ScrollView className="flex-1 bg-white px-4 pt-2">
        {Object.entries(grouped).map(([category, dishes]) => (
          <Section
            key={category}
            title={getDishCategory(category).label}
            data={dishes}
            {...{ modalVisible, setModalVisible, selectedItem, setSelectedItem, esCliente }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default MenuScreen;