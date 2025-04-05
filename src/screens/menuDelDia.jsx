// src/screens/MenuDelDia.jsx
import React, { useState } from 'react';
import { View, Text, Image, Button, FlatList, StyleSheet } from 'react-native';

const platosMock = [
  {
    id: '1',
    nombre: 'Pollo a la brasa',
    precio: 25,
    imagen: 'https://source.unsplash.com/600x400/?chicken',
  },
  {
    id: '2',
    nombre: 'Lomo saltado',
    precio: 30,
    imagen: 'https://source.unsplash.com/600x400/?beef',
  },
  {
    id: '3',
    nombre: 'Ceviche',
    precio: 22,
    imagen: 'https://source.unsplash.com/600x400/?ceviche',
  },
];

const MenuDelDia = () => {
  const [cantidades, setCantidades] = useState({});

  const aumentar = (id) => {
    setCantidades({
      ...cantidades,
      [id]: (cantidades[id] || 0) + 1,
    });
  };

  const disminuir = (id) => {
    if ((cantidades[id] || 0) > 0) {
      setCantidades({
        ...cantidades,
        [id]: cantidades[id] - 1,
      });
    }
  };

  return (
    <FlatList
      data={platosMock}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.imagen }} style={styles.image} />
          <Text style={styles.name}>{item.nombre}</Text>
          <Text style={styles.price}>S/ {item.precio}</Text>
          <View style={styles.controls}>
            <Button title="-" onPress={() => disminuir(item.id)} />
            <Text style={styles.count}>{cantidades[item.id] || 0}</Text>
            <Button title="+" onPress={() => aumentar(item.id)} />
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    marginBottom: 25,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  image: {
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  price: {
    fontSize: 16,
    marginVertical: 6,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  count: {
    fontSize: 18,
    paddingHorizontal: 12,
  },
});

export default MenuDelDia;
