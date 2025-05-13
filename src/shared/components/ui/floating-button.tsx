import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { cn } from "@/shared/lib/utils";

interface FloatingButtonProps {
  icon?: keyof typeof Ionicons.glyphMap;
  href: string;
  className?: string;
}

export function FloatingButton({
  icon = "add",
  href,
  className,
}: FloatingButtonProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        className={cn(
          "absolute bottom-6 right-6 size-12 rounded-full bg-[#EF6C00]",
          "items-center justify-center shadow-lg shadow-gray-500",
          "active:bg-[#F97316]/80",
          className
        )}
      >
        <Ionicons name={icon} size={28} color="white" />
      </Pressable>
    </Link>
  );
}
