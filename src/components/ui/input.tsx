import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { TextInput } from "react-native";

interface InputProps extends React.ComponentPropsWithoutRef<typeof TextInput> {
  label?: string;
  error?: string;
  className?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "w-full rounded-lg border-2 border-gray-300 p-4 text-sm",
          className
        )}
        placeholderTextColor="#A0A0A0"
        {...props}
      />
    );
  }
);

Input.displayName = "Input"; // NOTA: This is important for debugging and React DevTools
