import React, { useEffect } from 'react';
import "./i18n";
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '@/navigation/AppNavigator';
import 'react-native-gesture-handler';
import { StatusBar, Platform } from "react-native";
import notifee, { AndroidImportance }  from '@notifee/react-native';

export default function App() {
  useEffect(() => {
    async function setupNotifications() {
      try {
        await notifee.requestPermission();
        if (Platform.OS === 'android') {
          await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
          });
        }
        console.log("funcionando as notificações")
      } catch (error) {
        console.error("Falha na config das notificações")
      }
    }
    setupNotifications();
  }, []);

  return (
    <>
      <StatusBar hidden={true} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}