// screens/MesaScreen.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { PedidoItem } from "@/shared/components/ui/pedido-item";
import type { PedidoItemProps } from "@/shared/components/ui/pedido-item";
import Header from "@/shared/components/ui/header";
import { useLocalSearchParams } from "expo-router";

const pedidos: PedidoItemProps[] = [
  {
    id: "1",
    nombre: "Silpancho de res",
    precio: 55,
    cantidad: 1,
    usuario: "Usuario 1",
    estado: "Pendiente",
    imagen: "https://i.imgur.com/PltE8gB.jpg",
  },
  {
    id: "2",
    nombre: "Chicharron de cerdo",
    precio: 140,
    cantidad: 2,
    usuario: "Usuario 1",
    estado: "En preparación",
    imagen: "https://i.imgur.com/hp5mn5U.jpg",
  },
  {
    id: "3",
    nombre: "Silpancho de res",
    precio: 55,
    cantidad: 1,
    usuario: "Usuario 2",
    estado: "Listo",
    imagen: "https://i.imgur.com/PltE8gB.jpg",
  },
  {
    id: "4",
    nombre: "Chicharron de cerdo",
    precio: 140,
    cantidad: 2,
    usuario: "Usuario 1",
    estado: "Rechazado",
    imagen: "https://i.imgur.com/hp5mn5U.jpg",
  },
];

export default function MesaScreen() {
  const { tableCode } = useLocalSearchParams();
  const totalProductos = pedidos.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = pedidos.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <View style={styles.container}>
      <Header
        titulo="Estado de pedidos"
        mostrarBusqueda={false}
        mostrarAgregar={false}
        idmesa={tableCode}
      />

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PedidoItem {...item} />}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Total: {totalProductos} Productos</Text>
        <Text style={styles.footerText}>Bs. {totalPrecio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  list: {
    paddingBottom: 80,
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 16,
    right: 16,
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
