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
          "w-full rounded-lg border-2 border-gray-300 p-4 text-sm",
          "focus:border-primary focus:ring-0", // Estados de focus
          props.editable === false && "opacity-50 bg-gray-100",
          className
        )}
        placeholderTextColor="#A0A0A0"
        {...props}
      />
    );
  }
);

Input.displayName = "Input"; // NOTA: This is important for debugging and React DevTools
