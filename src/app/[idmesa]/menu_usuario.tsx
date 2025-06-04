import Header from "@/shared/components/ui/header";
import { useGetDishes } from "@/features/dish/hooks";
import Section from "@/shared/components/ui/section";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DISH_TYPES } from "@/features/dish/constants";
import { getDishCategory } from "@/features/dish/utils";
import { setupDishListeners } from "@/shared/lib/socket/socketListeners";
export const MenuScreenUsuario = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [esCliente, setEsCliente] = useState(true);
  const { idmesa, tableCode } = useLocalSearchParams();

  const { isLoading, error, dishes, setDishes } = useGetDishes({
    type: DISH_TYPES.FOOD.value,
    isAvailable: esCliente,
  });

  console.log(idmesa);
  useEffect(() => {
    const { onCreated, onUpdated, onDeleted, cleanup } = setupDishListeners();

    onCreated((newDish) => setDishes((prev = []) => [...prev, newDish]));

    onUpdated((updatedDish) =>
      setDishes((prev = [updatedDish]) =>
        prev.map((dish) => (dish.id === updatedDish.id ? updatedDish : dish))
      )
    );

    onDeleted(({ id }) =>
      setDishes((prev = []) => prev.filter((dish) => dish.id !== id))
    );

    return cleanup;
  }, []);

  // control de respuesta de la API
  if (isLoading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error al cargar los platos: {error.message}</Text>;
  // Asegúrate de que dishes no sea undefined, null o está vacío
  if (!dishes?.length) return <Text>No hay platos disponibles</Text>;
  const grouped = Object.groupBy(dishes, (dish) => dish.category);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Header
          titulo="Menú"
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          mostrarAgregar={false}
          idmesa={idmesa} // 👈 pásalo como prop
        />
      </View>

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingHorizontal: 16,
          paddingTop: 8,
        }}
      >
        {/* Secciones dinámicas por cada tipo único */}
        {Object.entries(grouped).map(([category, dishes]) => {
          return (
            <Section
              key={getDishCategory(category).label}
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
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MenuScreenUsuario;
