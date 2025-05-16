import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { Link, Tabs, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Button } from "@/shared/components/ui/button";

export default function TabLayout() {
  const { idmesa } = useLocalSearchParams();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f1f1f1",
        },
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "#4A5568",
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTitleStyle: {
          color: "#2D3748",
          fontWeight: "bold",
        },
        tabBarLabelPosition: "below-icon",
        headerLeft: () => null, // Eliminar el botón de la izquierda
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <Link href="/" asChild>
              <Button title="Inicio" />
            </Link>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="menu_usuario"
        options={{
          title: "Menú",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant-menu" size={size} color={color} />
          ),
        }}
        initialParams={{ idmesa }}
      />
      <Tabs.Screen
        name="bebidas_usuario"
        options={{
          title: "Bebidas",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-drink" size={size} color={color} />
          ),
        }}
        initialParams={{ idmesa }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="pot-steam-outline"
              size={size}
              color={color}
            />
          ),
        }}
        initialParams={{ idmesa }}
      />
      <Tabs.Screen
        name="mesa-pedido"
        options={{
          title: "Mesa",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="concierge-bell" size={size} color={color} />
          ),
        }}
        initialParams={{ idmesa }}
      />
    </Tabs>
  );
}

// Estilos para asegurar que el botón esté alineado correctamente
const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center", // Alinea verticalmente el botón con el título
    justifyContent: "flex-end", // Alinea el botón al final de la cabecera
  },
});
