import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { DISH_TYPES } from "@/features/dish/constants";
import { useDishSocket, useGetDishes } from "@/features/dish/hooks";
import { getDishCategory } from "@/features/dish/utils";
import ModalDetalle from "@/shared/components/modal-detalle";
import Header from "@/shared/components/ui/header";
import Section from "@/shared/components/ui/section";
import { groupBy } from "@/shared/lib/utils";

import { useTableCode } from "@/storage/hook";
export const BebidaScreenUsuario = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [esCliente, setEsCliente] = useState(true);
  const tableCode = useTableCode();
  const { isLoading, error, dishes, setDishes } = useGetDishes({
    type: DISH_TYPES.DRINK.value,
    isAvailable: esCliente,
  });
  const { onCreated, onUpdated, onDeleted, cleanup } = useDishSocket();

  useEffect(() => {
    onCreated((newDish) => {
      setDishes((prev) => [...(prev ?? []), newDish]);
    });

    onUpdated((updatedDish) =>
      setDishes((prev = []) =>
        !updatedDish.isAvailable
          ? prev.filter((dish) => dish.id !== updatedDish.id)
          : prev.some((dish) => dish.id === updatedDish.id)
            ? prev.map((dish) =>
                dish.id === updatedDish.id ? updatedDish : dish
              )
            : [...prev, updatedDish]
      )
    );

    onDeleted(({ id }) => {
      setDishes((prev) => (prev ?? []).filter((dish) => dish.id !== id));
    });

    return () => {
      cleanup();
    };
  }, []);
  // control de respuesta de la API
  if (isLoading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error al cargar los platos: {error.message}</Text>;
  // Asegúrate de que dishes no sea undefined, null o está vacío
  if (!dishes.length) return <Text>No hay platos disponibles</Text>;

  if (!dishes?.length) return <Text>No hay platos disponibles</Text>;
  const search = busqueda.trim().toLowerCase();

  const filteredDishes = dishes.filter((dish) => {
    const name = dish.name?.toLowerCase() || "";
    const description = dish.description?.toLowerCase() || "";
    return name.includes(search) || description.includes(search);
  });
  const grouped = groupBy(filteredDishes, (dish) => dish.category);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Header
          titulo="Bebidas"
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          mostrarAgregar={false}
          idmesa={tableCode ?? ""}
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
      <ModalDetalle
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        item={selectedItem}
        modoCliente={esCliente}
      />
    </View>
  );
};

export default BebidaScreenUsuario;
