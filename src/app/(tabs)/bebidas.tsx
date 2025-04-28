import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import Header from "@/shared/components/ui/header";
import { QueryClientProvider } from "@tanstack/react-query";
import { useGetAllDishes } from "@/features/dish/hooks";
import Section from "@/shared/components/ui/section";

export const BebidaScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const queryResult = useGetAllDishes();
  const [esCliente, setEsCliente] = useState(false);

  console.log(queryResult.data);
  const sampleData = queryResult.data ?? [];

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
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingTop: 8,
      }}
    >
      {/* Header */}
      <Header
        titulo="Bebidas"
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onAgregarPress={() => console.log("Agregar presionado")}
      />

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
  );
};

export default BebidaScreen;
