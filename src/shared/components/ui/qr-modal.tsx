import React, { useState } from "react";
import { ActivityIndicator, Image, Modal, Text, View } from "react-native";

import { saveQrFromUrl } from "@/features/file/utils";
import { Button } from "./button";

interface QRModalProps {
  title?: string;
  visible: boolean;
  qrCodeUrl: string;
  onClose: () => void;
  onSave?: (uri: string) => void;
}

export function QRModal({
  title = "Tu código QR",
  visible,
  qrCodeUrl,
  onClose,
  onSave,
}: QRModalProps) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const savedUri = await saveQrFromUrl(qrCodeUrl);
      onSave?.(savedUri);
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

          <View className="bg-white p-4 items-center justify-center rounded-lg">
            <Image
              source={{ uri: qrCodeUrl }}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </View>

          <View className="flex-row mt-6 gap-4">
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
            >
              {saving && <ActivityIndicator color="#fff" />}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
