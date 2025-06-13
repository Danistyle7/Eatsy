import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { DISH_TYPES } from "@/features/dish/constants";
import { useGetDishes } from "@/features/dish/hooks";
import { getDishCategory } from "@/features/dish/utils";
import Header from "@/shared/components/ui/header";
import Section from "@/shared/components/ui/section";

import { createDishSocket } from "@/features/dish/socket";
import ModalDetalle from "@/shared/components/modal-detalle";

export const BebidaScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [esCliente, setEsCliente] = useState(false);

  const { isLoading, error, dishes, setDishes } = useGetDishes({
    type: DISH_TYPES.DRINK.value,
  });
  const { onCreated, onUpdated, onDeleted, cleanup } = createDishSocket();
  useEffect(() => {
    onCreated((newDish) => setDishes((prev = []) => [...prev, newDish]));

    onUpdated((updatedDish) =>
      setDishes((prev = [updatedDish]) =>
        prev.map((dish) => (dish.id === updatedDish.id ? updatedDish : dish))
      )
    );

    onDeleted(({ id }) =>
      setDishes((prev = []) => prev?.filter((dish) => dish.id !== id))
    );

    return cleanup;
  }, []);

  // control de respuesta de la API
  if (isLoading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error al cargar los platos: {error.message}</Text>;
  // Asegúrate de que dishes no sea undefined, null o está vacío
  if (!dishes?.length) return <Text>No hay platos disponibles</Text>;
  const search = busqueda.trim().toLowerCase();

  const filteredDishes = dishes.filter((dish) => {
    const name = dish.name?.toLowerCase() || "";
    const description = dish.description?.toLowerCase() || "";
    return name.includes(search) || description.includes(search);
  });

  const grouped = Object.groupBy(filteredDishes, (dish) => dish.category);
  // const grouped = dishes.reduce(
  //   (acc, dish) => {
  //     const cat = dish.category;
  //     if (!acc[cat]) acc[cat] = [];
  //     acc[cat].push(dish);
  //     return acc;
  //   },
  //   {} as Record<string, typeof dishes>
  // );

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-2">
        <Header
          titulo="Bebidas"
          busqueda={busqueda}
          setBusqueda={setBusqueda}
        />
      </View>

      <ScrollView className="flex-1 bg-white px-4 pt-2">
        {filteredDishes.length === 0 ? (
          <Text className="text-center text-gray-500 mt-10">
            No hay coincidencias con tu búsqueda.
          </Text>
        ) : (
          Object.entries(grouped).map(([category, dishes]) => (
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
          ))
        )}
      </ScrollView>

      <ModalDetalle
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        item={selectedItem}
        modoCliente={esCliente}
      />
    </View>
  );
};

export default BebidaScreen;
