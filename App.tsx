import React, { useEffect } from 'react';
import "./i18n";
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '@/navigation/AppNavigator';
import 'react-native-gesture-handler';
import { StatusBar, Platform } from "react-native";
import notifee, { AndroidImportance } from '@notifee/react-native';
import { RealmProvider } from '@/database/RealmContext';
import { useEnsureUser } from "@/hooks/useEnsureUser";

function EnsureUser() {
  useEnsureUser();
  return null;
}

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
      } catch (error) {
      }
    }
    setupNotifications();
  }, []);

  return (
    <>
      <StatusBar hidden={true} />
      <RealmProvider>
        <EnsureUser />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </RealmProvider>
    </>
  );
}
