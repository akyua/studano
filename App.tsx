import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import "./i18n";
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '@/navigation/AppNavigator';
import 'react-native-gesture-handler';
import { StatusBar, Platform } from "react-native";
import notifee, { AndroidImportance } from '@notifee/react-native';
import { RealmProvider } from '@/database/RealmContext';
import { useEnsureUser } from "@/hooks/useEnsureUser";
import { ThemeProvider } from '@/context/ThemeContext';

function EnsureUser() {
  useEnsureUser();
  return null;
}

function AppContent() {
  return (
    <>
      <StatusBar hidden={true} />
      <EnsureUser />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <RealmProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </RealmProvider>
  );
}
