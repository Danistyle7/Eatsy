import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/shared/components/ui/button";
import { saveUserSession } from "@/storage/user-session";
import { clearUserSession } from "@/storage/user-session";
type BarCodeScannedEvent = {
  type: string;
  data: string;
};

export default function Scanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = async ({ type, data }: BarCodeScannedEvent) => {
    if (!scanned) {
      setScanned(true);
      await clearUserSession();
      await saveUserSession({
        userId: null,
        userName: null,
        tableId: null,
        tableCode: data.toString(),
      });

      router.replace({
        pathname: "/(scannerqr)/confirmar_mesa",
      });
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Necesitamos acceso a la cámara para escanear el código QR</Text>
        <Button title="Permitir" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()} // ⬅️ Volver a la pantalla anterior
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.scanText}>Manten la camara enfocada</Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 50,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    backgroundColor: "#00000080",
    padding: 10,
    borderRadius: 8,
  },
  scanText: {
    fontSize: 20,
    color: "white",
    backgroundColor: "#000000a0",
    padding: 10,
    borderRadius: 8,
  },
});
