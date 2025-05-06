import { cn } from "@/shared/lib/utils";
import { forwardRef } from "react";
import { TextInput } from "react-native";

interface InputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
  className?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "w-full rounded-2xl border border-gray-300 px-3 py-2 md:px-4",
          "shadow-inner text-[#5e4632] text-sm bg-[#EDEDED]",
          "focus:border-primary focus:ring-0", // Estados de focus
          props.editable === false && "opacity-50 bg-gray-100",
          className
        )}
        placeholderTextColor="#878787"
        {...props}
      />
    );
  }
);

Input.displayName = "Input"; // NOTA: This is important for debugging and React DevTools
