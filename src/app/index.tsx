import { useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== "web") {
      GoogleSignin.configure({
        webClientId:
          "377172189037-hph1d8ob0riikerk0bjbq3hqpr24tju.apps.googleusercontent.com", // tu CLIENTE WEB
        offlineAccess: true,
      });
    }
  }, []);

  const handleGoogleLogin = async () => {
    if (Platform.OS === "web") {
      console.log("Modo web: simulando login...");
      router.push("/(tabs)/menu");
      return;
    }

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("Usuario autenticado:", userInfo);
      router.push("/(tabs)/menu");
    } catch (error) {
      console.error("Error en Google Sign-In:", error);
      Alert.alert("Error", "No se pudo iniciar sesión.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a Eatsy!</Text>

      {/* Botón de login con Google */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.googleButtonText}>Continuar con Google</Text>
      </TouchableOpacity>

      {/* Botón para escanear QR */}
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
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  googleButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
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
