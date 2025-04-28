import React, { forwardRef } from "react";
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

interface ButtonProps extends PressableProps {
  title: string;
  className?: string;
  textClassName?: string;
}

export const Button = forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ title, className, textClassName, ...props }, ref) => {
  return (
    <Pressable
      ref={ref}
      className={cn(
        "h-10 px-4 py-2 bg-blue-600 rounded-md justify-center items-center",
        "active:bg-blue-700 disabled:opacity-50",
        className
      )}
      {...props}
    >
      <Text className={cn("text-white font-medium text-base", textClassName)}>
        {title}
      </Text>
    </Pressable>
  );
});

Button.displayName = "Button";
