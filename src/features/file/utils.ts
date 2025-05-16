import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export async function saveQrFromUrl(qrCodeUrl: string) {
  // detecta stub web: si downloadAsync admite solo 1 arg
  const isStubWeb = FileSystem.downloadAsync.length === 1;

  if (Platform.OS !== "web" && !isStubWeb) {
    // --- RUTA NATIVE (Android/iOS) ---
    const fileUri = FileSystem.cacheDirectory + "qr.png";
    // aquí downloadAsync es (url, fileUri)
    const { uri } = await FileSystem.downloadAsync(qrCodeUrl, fileUri);
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") throw new Error("Permiso denegado");
    const asset = await MediaLibrary.createAssetAsync(uri);
    await MediaLibrary.createAlbumAsync("QR Codes", asset, false);
    return asset.uri;
  } else {
    // --- RUTA WEB (o stub) ---
    // simplemente forzamos la descarga con <a download>
    const response = await fetch(qrCodeUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return qrCodeUrl;
  }
}
