import React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Settings from '@/screens/Settings';
import SideBar from "@/components/SideBar";
import { SideBarDrawerElements } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import Subjects from "@/screens/Subjects"
import { useTranslation } from 'react-i18next';

const Drawer = createDrawerNavigator<SideBarDrawerElements>();

export function SideBarDrawerNavigator() {

  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <SideBar {...props} />}
      screenOptions={{
        drawerStyle: {
          width: "60%",
        }
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          title: t("home.title"),
          headerShown: true,
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          title: t("settings.title"),
          headerShown: true,
        }}
      />

      <Drawer.Screen
        name="Subjects"
        component={Subjects}
        options={{
          title: t("subjects.title"),
          headerShown: true,
        }}
      />

    </Drawer.Navigator>
  );
};
