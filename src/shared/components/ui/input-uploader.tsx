import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import { cn } from "@/shared/lib/utils";

import { MaterialIcons } from "@expo/vector-icons";

type ImageUploaderProps = {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
};

export const ImageUploader = ({
  value,
  onChange,
  className,
  placeholder = "Seleccionar imagen",
}: ImageUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const maxSizeMB = 5;

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permisos requeridos", "Necesitamos acceso a tu galería");
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        if (
          result.assets[0].fileSize &&
          result.assets[0].fileSize > maxSizeMB * 1024 * 1024
        ) {
          Alert.alert("Error", `La imagen no puede superar ${maxSizeMB}MB`);
          return;
        }
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Error al cargar la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={cn("mb-4", className)}>
      <Pressable
        onPress={pickImage}
        className={cn(
          "h-40 w-full border-2 rounded-lg items-center justify-center border-gray-300",
          value ? "border-none" : "border-dashed"
        )}
      >
        {value ? (
          <>
            <Image
              source={{ uri: value }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
            <View className="absolute hover:bg-black/30 w-full h-full rounded-lg items-center justify-center">
              <MaterialIcons name="edit" size={24} color="white" />
            </View>
          </>
        ) : (
          <View className="items-center space-y-2">
            {loading ? (
              <ActivityIndicator size="small" color="#6b7280" />
            ) : (
              <>
                <MaterialIcons name="cloud-upload" size={32} color="#6b7280" />
                <Text className="text-gray-500">{placeholder}</Text>
              </>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
};
