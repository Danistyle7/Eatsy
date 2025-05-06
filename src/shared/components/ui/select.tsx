import { Picker } from "@react-native-picker/picker";
import React from "react";

import { cn } from "@/shared/lib/utils";

import AntDesign from "@expo/vector-icons/AntDesign";

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
        "border border-gray-300 p-2 md:px-4 text-sm bg-[#EDEDED] rounded-2xl",
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
