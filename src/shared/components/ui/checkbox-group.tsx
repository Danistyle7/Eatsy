// components/ui/checkbox-group.tsx
import { Pressable, Text, View } from "react-native";

import { cn } from "@/shared/lib/utils";
import { Option } from "@/shared/schemas";

type CheckboxGroupProps = {
  options: Option[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
};

export const CheckboxGroup = ({
  options,
  selectedValues,
  onValueChange,
  showSelectAll = false,
  selectAllLabel = "Seleccionar todos",
  className,
  itemClassName,
  labelClassName,
}: CheckboxGroupProps) => {
  const enabledOptions = options.filter((opt) => !opt.disabled);
  const allSelected = enabledOptions.every((opt) =>
    selectedValues.includes(opt.value)
  );

  const handleSelectAll = () => {
    const newValues = allSelected
      ? selectedValues.filter(
          (v) => !enabledOptions.some((opt) => opt.value === v)
        )
      : [
          ...new Set([
            ...selectedValues,
            ...enabledOptions.map((opt) => opt.value),
          ]),
        ];

    onValueChange(newValues);
  };

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onValueChange(newValues);
  };

  return (
    <View className={cn("flex flex-col gap-3", className)}>
      {showSelectAll && (
        <Pressable
          onPress={handleSelectAll}
          className={cn("flex-row items-center gap-3", itemClassName)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: allSelected }}
        >
          <View
            className={cn(
              "w-5 h-5 border-2 rounded-sm items-center justify-center",
              allSelected ? "border-primary bg-primary/10" : "border-gray-400"
            )}
          >
            {allSelected && <Text className="text-primary text-lg">✓</Text>}
          </View>
          <Text className={cn("text-foreground font-medium", labelClassName)}>
            {selectAllLabel}
          </Text>
        </Pressable>
      )}

      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        const isDisabled = option.disabled;

        return (
          <Pressable
            key={option.value}
            onPress={() => !isDisabled && handleToggle(option.value)}
            className={cn(
              "flex-row items-center gap-3",
              isDisabled && "opacity-50",
              itemClassName
            )}
            accessibilityRole="checkbox"
            accessibilityState={{
              checked: isSelected,
              disabled: isDisabled,
            }}
            disabled={isDisabled}
          >
            <View
              className={cn(
                "w-5 h-5 border-2 rounded-sm items-center justify-center",
                isSelected ? "border-primary bg-primary/10" : "border-gray-400",
                isDisabled && "border-gray-300"
              )}
            >
              {isSelected && <Text className="text-primary text-lg">✓</Text>}
            </View>
            <Text
              className={cn(
                "text-foreground font-medium",
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
