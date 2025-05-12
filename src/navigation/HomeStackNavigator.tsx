import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@/screens/Home';
import { HomeStackElements } from './types';

const Stack = createNativeStackNavigator<HomeStackElements>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
