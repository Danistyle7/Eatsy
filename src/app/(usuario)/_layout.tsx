import { Tabs } from "expo-router";
import BotonNaranja from "@/shared/components/ui/button";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function TabLayout() {
  const router = useRouter();

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
            <BotonNaranja
              titulo="Salir" // Texto del botón
              onPress={() => {
                // Redirigir al index
                router.push('/');
              }}
            />
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
      />
      <Tabs.Screen
        name="bebidas_usuario"
        options={{
          title: "Bebidas",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-drink" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Estilos para asegurar que el botón esté alineado correctamente
const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Alinea verticalmente el botón con el título
    justifyContent: 'flex-end', // Alinea el botón al final de la cabecera
  },
});
