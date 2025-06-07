// src/app/index.tsx

import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";

// — MÓDULO NATIVO para Android/iOS:
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// — Paquetes para WEB-OAuth:
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, ResponseType } from "expo-auth-session";
import * as GoogleAuth from "expo-auth-session/providers/google";

// Completa automáticamente el popup OAuth en web:
WebBrowser.maybeCompleteAuthSession();

export default function Home() {
  const router = useRouter();

  const WEB_CLIENT_ID =
    "377172189037-9feqnn0emk73bgc5el6f7mtbmg9s9h6r.apps.googleusercontent.com";

  // ── 1. CONFIGURACIÓN de expo-auth-session (web) ───────────────────────────
  const redirectUri = makeRedirectUri({
  preferLocalhost: Platform.OS === "web",
  scheme: "eatsy",
});
  const [request, response, promptAsync] = GoogleAuth.useAuthRequest({
    clientId: WEB_CLIENT_ID,
    responseType: ResponseType.IdToken,
    redirectUri,
    scopes: ["openid", "profile", "email"],
  });

  // ── 2. CONFIGURACIÓN de Google Sign-In (móvil) y manejo de respuesta web ───
  useEffect(() => {
    if (Platform.OS === "web") {
      if (response?.type === "success") {
        const { id_token } = response.params;
        console.log("ID Token (Web):", id_token);
        router.push("/(tabs)/menu");
      } else if (response?.type === "error") {
        Alert.alert("Error de Login", "No se pudo completar el inicio de sesión en la web.");
      }
    } else {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
      });
    }
  }, [response]);

  // ── 3. Handler unificado para el botón ────────────────────────────────────
  const handleGoogleLogin = async () => {
    if (Platform.OS === "web") {
      // dispara el popup OAuth
      await promptAsync();
    } else {
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const userInfo = await GoogleSignin.signIn();
        console.log("Usuario autenticado (Móvil):", userInfo);
        router.push("/(tabs)/menu");
      } catch (error) {
        console.error("Error en Google Sign-In (Móvil):", error);
        Alert.alert("Error", "No se pudo iniciar sesión en móvil.");
      }
    }
  };

  // ── 4. Navegar a escáner QR (todas las plataformas) ──────────────────────
  const handleScanQR = () => {
    router.push("/(scannerqr)/camera_qr");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a Eatsy!</Text>

      {/* Botón web */}
      {Platform.OS === "web" && (
        <TouchableOpacity
          style={[styles.googleButton, !request && { opacity: 0.6 }]}
          onPress={handleGoogleLogin}
          disabled={!request}
        >
          <Text style={styles.googleButtonText}>Continuar con Google</Text>
        </TouchableOpacity>
      )}

      {/* Botón móvil */}
      {Platform.OS !== "web" && (
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
        >
          <Text style={styles.googleButtonText}>Continuar con Google</Text>
        </TouchableOpacity>
      )}

      {/* Escáner QR (siempre) */}
      <TouchableOpacity
        style={[styles.button, styles.userButton]}
        onPress={handleScanQR}
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EF6C00",
    marginBottom: 40,
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "#fff",
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
