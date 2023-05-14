import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PhotosScreen from './components/PhotosScreen';
import MainMenuScreen from './components/MainMenuScreen';
import BigPhotoScreen from './components/BigPhotoScreen';
import CameraScreen from './components/CameraScreen';
import Settings from './components/Settings';

import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([""]);
// console.disableYellowBox = true;
// LogBox.ignoreAllLogs()

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="MainMenuScreen" component={MainMenuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PhotosScreen" component={PhotosScreen} options={{
          headerShown: true,
          title: 'Zdjęcia z folderu DCIM',
          headerStyle: {
            backgroundColor: '#ea1e63',
          },
          headerTintColor: 'white',
        }} />
        <Stack.Screen name="BigPhotoScreen" component={BigPhotoScreen} options={{
          headerShown: true,
          title: 'Wybrane zdjęcie',
          headerStyle: {
            backgroundColor: '#ea1e63',
          },
          headerTintColor: 'white',
        }} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{
          headerShown: true,
          title: 'Kamera',
          headerStyle: {
            backgroundColor: '#ea1e63',
          },
          headerTintColor: 'white',
        }} />
        <Stack.Screen name="SettingsScreen" component={Settings} options={{
          headerShown: true,
          title: 'Ustawienia',
          headerStyle: {
            backgroundColor: '#ea1e63',
          },
          headerTintColor: 'white',
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
