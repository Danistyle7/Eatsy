// components/ui/radio-group.tsx
import { Pressable, Text, View } from "react-native";

import { cn } from "@/shared/lib/utils";
import { Option } from "@/shared/schemas";

type RadioGroupProps = {
  options: Option[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
};

export const RadioGroup = ({
  options,
  selectedValue,
  onValueChange,
  className,
  itemClassName,
  labelClassName,
}: RadioGroupProps) => {
  return (
    <View className={cn("space-y-4", className)}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        const isDisabled = option.disabled;

        return (
          <Pressable
            key={option.value}
            onPress={() => !isDisabled && onValueChange(option.value)}
            className={cn(
              "flex-row items-center space-x-3",
              isDisabled && "opacity-50",
              itemClassName
            )}
            accessibilityRole="radio"
            accessibilityState={{
              checked: isSelected,
              disabled: isDisabled,
            }}
            disabled={isDisabled}
          >
            {/* Radio circle */}
            <View
              className={cn(
                "w-6 h-6 rounded-full border-2 items-center justify-center",
                isSelected ? "border-[#7f5af0]" : "border-gray-400",
                isDisabled && "border-gray-300"
              )}
            >
              {isSelected && (
                <View className="w-3 h-3 bg-[#7f5af0] rounded-full" />
              )}
            </View>

            {/* Label */}
            <Text
              className={cn(
                "text-[#5e4632] font-medium",
                isDisabled && "text-gray-400",
                labelClassName
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
