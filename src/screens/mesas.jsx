// src/screens/Mesas.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Mesas = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button title="Atrás" onPress={() => navigation.goBack()} />
      <Text style={styles.text}>Aquí se mostrarán las mesas.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Mesas;
