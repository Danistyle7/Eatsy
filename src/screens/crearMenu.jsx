// src/screens/CrearMenu.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const CrearMenu = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');

  const guardar = () => {
    if (nombre && precio && imagen) {
      Alert.alert('Plato creado', `Nombre: ${nombre}\nPrecio: ${precio}\nImagen: ${imagen}`);
      setNombre('');
      setPrecio('');
      setImagen('');
    } else {
      Alert.alert('Faltan campos', 'Por favor llena todos los datos');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del plato</Text>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
        placeholder="Ej. Arroz con mariscos"
      />
      <Text style={styles.label}>Precio</Text>
      <TextInput
        value={precio}
        onChangeText={setPrecio}
        style={styles.input}
        placeholder="Ej. 25.00"
        keyboardType="numeric"
      />
      <Text style={styles.label}>URL de imagen</Text>
      <TextInput
        value={imagen}
        onChangeText={setImagen}
        style={styles.input}
        placeholder="https://..."
      />
      <Button title="Guardar plato" onPress={guardar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
});

export default CrearMenu;
