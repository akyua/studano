import React, { useEffect } from 'react';
import "./i18n";
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '@/navigation/AppNavigator';
import 'react-native-gesture-handler';
import { StatusBar, Platform } from "react-native";
import notifee from '@notifee/react-native';

export default function App() {
  useEffect(() => {
    async function setupNotifications() {
      try {
        await notifee.requestPermission();
        if (Platform.OS === 'android') {
          await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
          });
        }
      } catch (error) {
        // Errors can be handled here
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