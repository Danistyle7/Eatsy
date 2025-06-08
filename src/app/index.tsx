// src/app/index.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, ResponseType } from "expo-auth-session";
import * as GoogleAuth from "expo-auth-session/providers/google";

import apiClient from "@/shared/lib/api/client";
import { isAxiosError } from "axios";
import { decode as atob } from "base-64";
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

function parseJwt<T = any>(token: string): T {
  const [, payload] = token.split(".");
  const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(b64 + pad);
  const json = decodeURIComponent(
    bin
      .split("")
      .map((c) =>
        "%" + c.charCodeAt(0).toString(16).padStart(2, "0")
      )
      .join("")
  );
  return JSON.parse(json) as T;
}

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const WEB_CLIENT_ID =
    "377172189037-9feqnn0emk73bgc5el6f7mtbmg9s9h6r.apps.googleusercontent.com";

  // 1️⃣ Configuración web
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

  // 2️⃣ Config móvil
  useEffect(() => {
    if (Platform.OS !== "web") {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
      });
    }
  }, []);

  // 3️⃣ Callback web
  useEffect(() => {
    if (Platform.OS === "web" && response?.type === "success") {
      const { id_token } = response.params;
      const { email } = parseJwt<{ email: string }>(id_token);
      checkEmail(email);
    }
    if (Platform.OS === "web" && response?.type === "error") {
      Alert.alert("Error", "No se pudo completar el login en web.");
    }
  }, [response]);

  // 4️⃣ Verificación de email
  async function checkEmail(email: string) {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, status } = await apiClient.post<{
        success: boolean;
        message: string;
        valid: boolean;
      }>(
        "restaurant/email",
        { email },
        { validateStatus: () => true }
      );

      if (status >= 200 && status < 300 && data.valid) {
        router.push("/(tabs)/menu");
      } else {
        setErrorMsg(data.message || "Esta cuenta no está registrada.");
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setErrorMsg(
          err.response?.data?.message || err.message || "Error verificando correo."
        );
      } else {
        console.error(err);
        setErrorMsg("Error desconocido.");
      }
    } finally {
      setLoading(false);
    }
  }

  // 5️⃣ Handler unificado
  const handleGoogleLogin = async () => {
    if (Platform.OS === "web") {
      await promptAsync();
      return;
    }

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      await GoogleSignin.signIn();

      const { idToken } = await GoogleSignin.getTokens();
      if (!idToken) throw new Error("No se obtuvo idToken");

      const { email } = parseJwt<{ email: string }>(idToken);
      await checkEmail(email);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Falló el login móvil.");
    }
  };

  return (
    <View style={styles.outer}>
      <View style={styles.card}>
        <Text style={styles.title}>¡Bienvenido a Eatsy!</Text>

        <TouchableOpacity
          style={[styles.googleButton, loading && { opacity: 0.6 }]}
          onPress={handleGoogleLogin}
          disabled={loading || (Platform.OS === "web" && !request)}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Ionicons
                name="logo-google"
                size={24}
                color="#DB4437"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.googleButtonText}>
                Continuar con Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.userButton]}
          onPress={() => router.push("/(scannerqr)/camera_qr")}
        >
          <Text style={styles.buttonText}>Scanear código</Text>
        </TouchableOpacity>

        {/* MENSAJE DE ERROR ABAJO DE TODO */}
        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EF6C00",
    marginBottom: 24,
    textAlign: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    marginBottom: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
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
  error: {
    color: "#D32F2F",
    backgroundColor: "#FFEBEE",
    padding: 8,
    borderRadius: 4,
    width: "100%",
    textAlign: "center",
    marginTop: 8,
  },
});
