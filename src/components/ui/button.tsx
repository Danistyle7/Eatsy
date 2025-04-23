import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

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
    backgroundColor: '#EF6C00', // Naranja
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: 'flex-start', // se ajusta al tamaño del contenido
  },
  texto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
