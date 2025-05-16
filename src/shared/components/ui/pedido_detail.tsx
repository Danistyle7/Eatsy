// /shared/components/pedido/PedidoItem.tsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Dish, useCartStore } from "@/shared/hooks/use_cardstore"; // Asegúrate de tener la interfaz `Dish` exportada
import { Feather, EvilIcons } from "@expo/vector-icons";

interface Props {
  item: Dish;
}

export default function PedidoItem({ item }: Props) {
  const incrementar = useCartStore((state) => state.incrementarItem);
  const decrementar = useCartStore((state) => state.decrementarItem);
  const eliminar = useCartStore((state) => state.removeItem);

  return (
    <View className="flex-row items-center gap-2 p-1 border-b border-gray-300">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-32 h-16 rounded-lg "
        resizeMode="cover"
      />
      <View className="flex-1 ">
        <Text className="text-lg font-semibold  text-black">{item.name}</Text>

        <View className=" flex-row text-black  gap-3 justify-between">
          <View>
            <Text className="text-base">Bs. {item.price}</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity onPress={() => incrementar(item.id)}>
              <EvilIcons name="plus" size={24} color="#EF6C00" />
            </TouchableOpacity>
            <Text> {item.count} </Text>
            <TouchableOpacity onPress={() => decrementar(item.id)}>
              <EvilIcons name="minus" size={24} color="#EF6C00" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => eliminar(item.id)} className="p-2">
        <Feather name="trash" size={30} color="#EF6C00" />
      </TouchableOpacity>
    </View>
  );
}
