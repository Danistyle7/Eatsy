import { Text } from "react-native";

import { cn } from "@/shared/lib/utils";

interface ErrorMessageProps {
  message?: string | null;
  className?: string;
}

export const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  return (
    <Text
      className={cn(
        "text-sm text-red-500",
        !message && "opacity-0 h-5",
        className
      )}
      accessibilityRole="text"
    >
      {message || " "}
    </Text>
  );
};
