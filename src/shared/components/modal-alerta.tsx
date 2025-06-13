import React from "react";
import { Modal, Text, View, TouchableOpacity } from "react-native";

interface ModalAlertaProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
}

const ModalAlerta: React.FC<ModalAlertaProps> = ({
  visible,
  message,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white p-6 rounded-2xl w-11/12 max-w-md items-center">
          <Text className="text-base text-gray-800 text-center mb-4">
            {message}
          </Text>
          <TouchableOpacity
            onPress={onConfirm}
            className="bg-orange-500 px-5 py-2 rounded-xl "
          >
            <Text className="text-white font-semibold">Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalAlerta;
