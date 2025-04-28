import { Text } from "react-native";
import { cn } from "@/shared/lib/utils";

interface LabelProps extends React.ComponentProps<typeof Text> {
  className?: string;
  nativeID?: string;
}

const Label = ({ className, nativeID, ...props }: LabelProps) => {
  return (
    <Text
      className={cn("text-sm font-medium text-[#5e4632] mb-2", className)}
      nativeID={nativeID}
      accessibilityRole="text"
      {...props}
    />
  );
};

export { Label };
