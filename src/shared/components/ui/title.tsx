import { Text } from "react-native";

// This is a title component using react-native
// It is a simple title with a font size of 2xl and bold font weight
export default function Title({ children }: { children: string }) {
  return <Text className="text-2xl font-bold">{children}</Text>;
}
