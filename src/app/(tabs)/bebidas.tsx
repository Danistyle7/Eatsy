import React, { useState } from "react";
import { ScrollView,View } from "react-native";

import { useGetAllDishes } from "@/features/dish/hooks";
import Header from "@/shared/components/ui/header";
import Section from "@/shared/components/ui/section";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
export const BebidaScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [esCliente, setEsCliente] = useState(false);

  const { data: bebidas, isLoading, error, refetch } = useGetAllDishes({ type: "DRINK" });
 
   useFocusEffect(
     useCallback(() => {
       refetch();
     }, [refetch])
   );
  console.log(bebidas);
  const sampleData = bebidas ?? [];

  const tiposUnicos = Array.from(
    new Set(
      sampleData
        .map((item) => item.category)
        .filter((category) =>
          sampleData.some(
            (item) =>
              item.category === category &&
              item.name.toLowerCase().includes(busqueda.toLowerCase())
          )
        )
    )
  );

  // Función para filtrar por tipo y búsqueda
  const filtrarPorTipo = (category: string) =>
    sampleData.filter(
      (item) =>
        item.category === category &&
        item.name.toLowerCase().includes(busqueda.toLowerCase())
    );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>

    <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
    <Header titulo="Bebidas" busqueda={busqueda} setBusqueda={setBusqueda} />
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
      {tiposUnicos.map((tipo) => {
        const items = filtrarPorTipo(tipo);
        if (items.length === 0) return null; // evita secciones vacías

        return (
          <Section
            key={tipo}
            title={tipo}
            data={items}
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

export default BebidaScreen;
