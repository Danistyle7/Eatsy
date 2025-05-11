import { ScrollView, Text, View } from "react-native";

import { FloatingButton } from "@/shared/components/ui/floating-button";

const TablesScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white px-4 pt-2">
        <Text>Tables</Text>
        {/* Lista de platos (cards) */}
      </ScrollView>

      <FloatingButton href="/table/new" icon="add" />
    </View>
  );
};

export default TablesScreen;
