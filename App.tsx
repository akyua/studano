import React from 'react';
import "./i18n";
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '@/navigation/AppNavigator';
import 'react-native-gesture-handler'
import { StatusBar } from "react-native";

export default function App() {
  return (
    <>
      <StatusBar hidden={true} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}
