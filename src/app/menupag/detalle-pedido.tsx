import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "@/shared/components/ui/button";

type PedidoAgrupado = {
  usuario: number;
  nombre: string;
  plato: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
};

const DetallePedido = () => {
  const { data, mesa } = useLocalSearchParams();
  const router = useRouter();

  const pedidos: PedidoAgrupado[] = JSON.parse(data as string);

  // Agrupar por usuario
  const pedidosPorUsuario: Record<number, PedidoAgrupado[]> = pedidos.reduce(
    (acc, pedido) => {
      if (!acc[pedido.usuario]) {
        acc[pedido.usuario] = [];
      }
      acc[pedido.usuario].push(pedido);
      return acc;
    },
    {} as Record<number, PedidoAgrupado[]>
  );

  const totalGlobal = pedidos.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles de Recibo - Mesa {mesa}</Text>

      {Object.entries(pedidosPorUsuario).map(([usuario, items]) => {
        const totalUsuario = items.reduce((acc, i) => acc + i.subtotal, 0);
        const nombreCliente = items[0]?.nombre;

        return (
          <View key={usuario} style={styles.section}>
            <Text style={styles.userTitle}>
              Cliente #{usuario}: {nombreCliente}
            </Text>
            {items.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.text}>🍽️ {item.plato}</Text>
                <Text style={styles.text}>Cantidad: {item.cantidad}</Text>
                <Text style={styles.text}>
                  Precio Unitario: Bs. {item.precioUnitario}
                </Text>
                <Text style={styles.text}>Subtotal: Bs. {item.subtotal}</Text>
              </View>
            ))}
            <Text style={styles.userTotal}>
              Total Cliente #{usuario}: Bs. {totalUsuario}
            </Text>
          </View>
        );
      })}

      <Text style={styles.globalTotal}>TOTAL GENERAL: Bs. {totalGlobal}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Volver al inicio" onPress={() => router.push("/")} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#222",
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 12,
  },
  userTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  row: { marginBottom: 8, paddingLeft: 12 },
  text: { fontSize: 16 },
  userTotal: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "right",
    color: "#444",
  },
  globalTotal: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    textAlign: "center",
    color: "#000",
  },
  buttonContainer: {
    marginTop: 32,
    alignItems: "center",
  },
});

export default DetallePedido;
