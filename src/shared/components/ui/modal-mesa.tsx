import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const ModalMesa: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  message = "Ya no se podrá pedir más comida.\n ¿Estás seguro?",
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/30 justify-center items-center">
        <View className="w-4/5 bg-white rounded-2xl p-6 shadow-lg items-center">
          <Text className="text-xl font-bold text-orange-500 mb-3">
            Generar detalle
          </Text>
          <Text className="text-base  text-gray-700 mb-5">{message}</Text>

          <View className="flex-row justify-between w-full space-x-2">
            <TouchableOpacity
              onPress={onConfirm}
              className="bg-orange-500 px-5 py-2 rounded-xl "
            >
              <Text className=" text-white font-semibold">Generar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-200 px-5 py-2 rounded-xl"
            >
              <Text className="text-gray-700 font-semibold">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalMesa;
