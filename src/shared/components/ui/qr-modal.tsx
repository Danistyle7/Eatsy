// QRModal.jsx
import React, { useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import QRCode from "react-native-qrcode-svg";
import { Button } from "./button";

interface QRModalProps {
  title?: string;
  visible: boolean;
  value: string;
  onClose: () => void;
  onSave?: (uri: string) => void;
}

export default function QRModal({
  title = "Tu código QR",
  visible,
  value,
  onClose,
  onSave,
}: QRModalProps) {
  const qrRef = useRef(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!qrRef.current) return;
    try {
      setSaving(true);
      // Captura el QR como imagen PNG
      const uri = await captureRef(qrRef.current, {
        format: "png",
        quality: 1,
      });
      // Pide permisos para guardar en galería
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") throw new Error("Permiso denegado");
      // Mueve el archivo a la galería
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("QR Codes", asset, false);
      onSave && onSave(uri);
    } catch (e) {
      console.error("Error guardando QR:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-md">
          <Text className="text-xl font-semibold text-center mb-4 text-[#F97316]">
            {title}
          </Text>

          <View
            ref={qrRef}
            className="bg-white p-4 items-center justify-center rounded-lg"
          >
            <QRCode value={value || " "} size={200} />
          </View>

          <View className="flex-row mt-6 space-x-4">
            <Button
              title="Cerrar"
              onPress={onClose}
              variant="outline"
              className="flex-1"
            />
            <Button
              title="Guardar"
              onPress={handleSave}
              disabled={saving}
              className="flex-1"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
