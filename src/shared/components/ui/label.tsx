import { Text } from "react-native";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export const Label = ({ children, className }: LabelProps) => {
  return <Text className={className}>{children}</Text>;
};

export default Label;
