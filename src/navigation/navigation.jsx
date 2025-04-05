// src/Navigation.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import Mesas from '../screens/mesas';
import MenuDelDia from '../screens/menuDelDia';
import CrearMenu from '../screens/crearMenu';
import Dashboard from '../components/dashboard';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ title: 'Inicio' }} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Mesas" component={Mesas} />
      <Stack.Screen name="MenuDelDia" component={MenuDelDia} />
      <Stack.Screen name="CrearMenu" component={CrearMenu} />
    </Stack.Navigator>
  );
};

export default Navigation;
