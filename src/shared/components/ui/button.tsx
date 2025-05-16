import { forwardRef } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { cn } from "@/shared/lib/utils";

interface BotonNaranjaProps {
  titulo: string;
  onPress: () => void;
}

export default function BotonNaranja({ titulo, onPress }: BotonNaranjaProps) {
  return (
    <TouchableOpacity style={styles.boton} onPress={onPress}>
      <Text style={styles.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: "#EF6C00", // Naranja
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: "flex-start", // se ajusta al tamaño del contenido
  },
  texto: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export const buttonVariants = (
  variant: ButtonVariant = "default",
  size: ButtonSize = "default"
) => {
  const base =
    "flex-row items-center justify-center rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl";

  const variants = {
    default: "bg-[#F97316]",
    destructive: "bg-red-600 active:bg-red-700",
    outline: "border border-[#F97316] bg-transparent",
    secondary: "bg-gray-200 active:bg-gray-300",
    ghost: "active:bg-blue-100",
    link: "",
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-base",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8 text-lg",
    icon: "size-8",
  };

  return `${base} ${variants[variant]} ${sizes[size]}`;
};

interface ButtonProps extends PressableProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

export const Button = forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      variant = "default",
      size = "default",
      className,
      textClassName,
      children,
      ...props
    },
    ref
  ) => {
    const textVariants = {
      default: "text-white",
      destructive: "text-white",
      outline: "text-[#F97316]",
      secondary: "text-gray-900",
      ghost: "text-blue-600",
      link: "text-blue-600 underline",
    };

    return (
      <Pressable
        ref={ref}
        className={cn(buttonVariants(variant, size), className)}
        {...props}
      >
        {children ? (
          children
        ) : (
          <Text
            className={cn("font-medium", textVariants[variant], textClassName)}
          >
            {props.title}
          </Text>
        )}
      </Pressable>
    );
  }
);

Button.displayName = "Button";
