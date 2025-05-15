import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackElements } from './types';
import MainPageScreen from '@/screens/MainPageScreen';

const Stack = createNativeStackNavigator<HomeStackElements>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainPageScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
