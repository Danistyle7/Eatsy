import { setupSocketListeners } from "@/shared/lib/socket/socketListeners";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const cleanup = setupSocketListeners();
    return () => {
      cleanup(); 
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a Eatsy!</Text>

      <TouchableOpacity
        style={[styles.button, styles.adminButton]}
        onPress={() => router.push("/(tabs)/menu")}
      >
        <Text style={styles.buttonText}>Entrar como Administrador</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.userButton]}
        onPress={() => router.push("/(scannerqr)/camera_qr")}
      >
        <Text style={styles.buttonText}>Scanear código</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EF6C00",
    marginBottom: 40,
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  adminButton: { backgroundColor: "#FF7043" },
  userButton: { backgroundColor: "#FFA726" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
