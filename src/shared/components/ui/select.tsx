import React from "react";
import { Picker } from "@react-native-picker/picker";
import { View, Text } from "react-native";
import { cn } from "@/shared/lib/utils";

interface SelectProps {
  items: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function Select({
  items,
  selectedValue,
  onValueChange,
  className,
  placeholder,
}: SelectProps) {
  return (
    <Picker
      className={cn(
        "border border-gray-300 rounded-md p-2 md:px-4 text-sm",
        className
      )}
      selectedValue={selectedValue}
      onValueChange={onValueChange}
    >
      {placeholder && <Picker.Item label={placeholder} value="" />}
      {items.map((item) => (
        <Picker.Item key={item.value} label={item.label} value={item.value} />
      ))}
    </Picker>
  );
}
