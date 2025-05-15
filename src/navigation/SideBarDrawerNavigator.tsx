import React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Settings from '@/screens/SettingsScreen';
import SideBar from "@/components/SideBar";
import { SideBarDrawerElements } from './types';
import { HomeStackNavigator } from './HomeStackNavigator';
import Subjects from "@/screens/SubjectsScreen"
import Schedules from "@/screens/SchedulesScreen"
import History from "@/screens/HistoryScreen"
import { useTranslation } from 'react-i18next';
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  Book as BookIcon,
  Clock as ClockIcon,
  History as HistoryIcon
} from "lucide-react-native"

const Drawer = createDrawerNavigator<SideBarDrawerElements>();

export function SideBarDrawerNavigator() {

  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <SideBar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: "60%",
        }
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          title: t(""),
          drawerIcon: ({ color, size }) => {
            return <HomeIcon color={color} size={size} />
          }
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          title: t(""),
          drawerIcon: ({ color, size }) => {
            return <SettingsIcon color={color} size={size} />
          }
        }}
      />

      <Drawer.Screen
        name="Subjects"
        component={Subjects}
        options={{
          title: t(""),
          drawerIcon: ({ color, size }) => {
            return <BookIcon color={color} size={size} />
          }
        }}
      />

      <Drawer.Screen
        name="Schedules"
        component={Schedules}
        options={{
          title: t(""),
          drawerIcon: ({ color, size }) => {
            return <ClockIcon color={color} size={size} />
          }
        }}
      />

      <Drawer.Screen
        name="History"
        component={History}
        options={{
          title: t(""),
          drawerIcon: ({ color, size }) => {
            return <HistoryIcon color={color} size={size} />
          }
        }}
      />

    </Drawer.Navigator>
  );
};
