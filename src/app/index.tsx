import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a Eatsy!</Text>  .
         
      <TouchableOpacity
        style={[styles.button, styles.adminButton]}
        onPress={() => router.push("/(tabs)/menu")}
      >
        <Text style={styles.buttonText}>Entrar como Administrador</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.userButton]}
        onPress={() => router.push("/(usuario)/menu_usuario")}
      >
        <Text style={styles.buttonText}>Entrar como Usuario</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EF6C00",
    marginBottom: 40,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  adminButton: {
    backgroundColor: "#FF7043",
  },
  userButton: {
    backgroundColor: "#FFA726",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
