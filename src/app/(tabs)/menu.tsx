import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { DISH_TYPES } from "@/features/dish/constants";
import { useGetAllDishes } from "@/features/dish/hooks";
import { getDishCategory } from "@/features/dish/utils";
import Header from "@/shared/components/ui/header";
import Section from "@/shared/components/ui/section";
import { setupDishListeners } from "@/shared/lib/socket/socketListeners"; // Ajusta la ruta
import { DishResponse } from "@/features/dish/types";

export const MenuScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [esCliente, setEsCliente] = useState(false);

  const {
    data: dishes,
    isLoading,
    error,
    refetch,
  } = useGetAllDishes({ type: DISH_TYPES.FOOD.value });

  // Estado optimizado para manejar los platos con WebSocket
  const [optimizedDishes, setOptimizedDishes] = useState<DishResponse[]>([]);

  // Sincronizar los datos iniciales cuando cambian
  useEffect(() => {
    if (dishes) {
      setOptimizedDishes(dishes);
    }
  }, [dishes]);

  // Configurar listeners del WebSocket
  useEffect(() => {
    const { onCreated, onUpdated, onDeleted, cleanup } = setupDishListeners();

    onCreated((newDish) => {
      setOptimizedDishes(prev => {
        // Evitar duplicados
        if (!prev.some(dish => dish.id === newDish.id)) {
          return [...prev, newDish];
        }
        return prev;
      });
    });

    onUpdated((updatedDish) => {
      setOptimizedDishes(prev =>
        prev.map(dish => dish.id === updatedDish.id ? updatedDish : dish)
      );
    });

    onDeleted(({ id }) => {
      setOptimizedDishes(prev => prev.filter(dish => dish.id !== id));
    });

    return cleanup;
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error al cargar los platos: {error.message}</Text>;
  if (!optimizedDishes?.length) return <Text>No hay platos disponibles</Text>;

  const grouped = optimizedDishes.reduce(
    (acc, dish) => {
      const cat = dish.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(dish);
      return acc;
    },
    {} as Record<string, typeof optimizedDishes>
  );

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
            {...{
              modalVisible,
              setModalVisible,
              selectedItem,
              setSelectedItem,
            }}
            esCliente={esCliente}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default MenuScreen;