// components/ui/switch.tsx
import { Pressable, View } from "react-native";
import { cn } from "@/shared/lib/utils";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  trackColor?: {
    false?: string;
    true?: string;
  };
  thumbColor?: {
    false?: string;
    true?: string;
  };
  accessibilityLabel?: string;
};

export const Switch = ({
  checked,
  onChange,
  disabled = false,
  className,
  trackColor = {
    false: "#e2e8f0", // gray-300
    true: "#F97316", // primary
  },
  thumbColor = {
    false: "#ffffff", // white
    true: "#ffffff", // white
  },
  accessibilityLabel = "Switch",
}: SwitchProps) => {
  const handlePress = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel}
      className={cn("h-6 w-11 rounded-full", className, {
        "opacity-50": disabled,
      })}
      style={{
        backgroundColor: checked ? trackColor.true : trackColor.false,
      }}
    >
      <View
        className="h-5 w-5 rounded-full absolute top-0.5 transition-all duration-200"
        style={{
          backgroundColor: checked ? thumbColor.true : thumbColor.false,
          left: checked ? 20 : 2, // 20 = container width (11) - thumb width (5) - margin (2*2)
        }}
      />
    </Pressable>
  );
};
