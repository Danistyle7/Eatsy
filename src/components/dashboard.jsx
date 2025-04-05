import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation();

  const buttons = [
    {
      title: 'Mesas',
      icon: 'chair-alt',
      screen: 'Mesas',
    },
    {
      title: 'Menú',
      icon: 'food',
      screen: 'MenuDelDia',
    },
    {
      title: 'Crear',
      icon: 'create',
      screen: 'CrearMenu',
    },
  ];

  return (
    <View style={styles.container}>
      {buttons.map((btn, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => navigation.navigate(btn.screen)}
        >
          <Icon name={btn.icon} size={26} color="#1e90ff" />
          <Text style={styles.label}>{btn.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: '#1e90ff',
  },
});

export default Dashboard;
