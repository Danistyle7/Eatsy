import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useGetAllDishes } from "@/features/dish/hooks";

import "@/shared/styles.css";
import { Link } from "expo-router";
import { Button } from "@/shared/components/ui/button";

export default function HomeScreen() {
  const { data: dishes, isLoading, error } = useGetAllDishes({});
  console.log(dishes, isLoading, error);

  const featuredRecipe = {
    title: "Pasta Carbonara",
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop",
    time: "30 min",
    difficulty: "Media",
  };

  const categories = [
    { name: "Italiana", icon: "🍝" },
    { name: "Mexicana", icon: "🌮" },
    { name: "Asiática", icon: "🍜" },
    { name: "Postres", icon: "🍰" },
  ];

  return (
    <ScrollView className="flex-1 bg-[#F7FAFC]">
      <Link href="/dish/new" asChild>
        <Button title="Agregar" />
      </Link>

      <View className="p-5 pt-10">
        <Text className="text-2xl font-bold">¡Bienvenido a Eatsy!</Text>
        <Text className="text-xl mt-5">
          ¡Disfruta de nuestras recetas deliciosas y fáciles de preparar!
        </Text>
      </View>

      <View className="p-5">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Receta Destacada
        </Text>

        <TouchableOpacity className="bg-white rounded-xl overflow-hidden shadow-md">
          <Image
            source={{ uri: featuredRecipe.image }}
            className="w-full h-52"
            resizeMode="cover"
          />
          <View className="p-4">
            <Text className="text-lg font-bold text-gray-800">
              {featuredRecipe.title}
            </Text>
            <View className="flex-row mt-2">
              <Text className="text-gray-500 mr-4">
                ⏱ {featuredRecipe.time}
              </Text>
              <Text className="text-gray-500">
                📊 {featuredRecipe.difficulty}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View className="p-5">
        <Text className="text-xl font-bold text-gray-800 mb-4">Categorías</Text>

        <View className="flex-row flex-wrap justify-between">
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] bg-white p-5 rounded-lg items-center mb-4 shadow-sm"
            >
              <Text className="text-3xl mb-2">{category.icon}</Text>
              <Text className="text-sm font-medium text-gray-800">
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
