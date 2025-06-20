import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem
} from "@react-navigation/drawer"
import { useTranslation } from 'react-i18next';
import { NavigationState } from '@react-navigation/native';
import { DrawerNavigationHelpers, DrawerDescriptorMap } from 'node_modules/@react-navigation/drawer/lib/typescript/src/types';
import { useTheme } from '@/context/ThemeContext';

const SideBar = (props: DrawerContentComponentProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { state, navigation, descriptors } = props;

  const createDrawerItem = (
    state: NavigationState,
    navigation: DrawerNavigationHelpers,
    descriptors: DrawerDescriptorMap
  ) => {
    return state.routes.map((route, index) => {
      const focused = state.index === index;
      const descriptor = descriptors[route.key];
      const label = descriptor.options.title || route.name;

      return (
        <DrawerItem
          key={route.key}
          label={label}
          icon={descriptor.options.drawerIcon}
          onPress={() => navigation.navigate(route.name)}
          focused={focused}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.textSecondary}
          activeBackgroundColor={colors.surface}
          inactiveBackgroundColor={colors.background}
          labelStyle={focused ? styles.activeLabel : styles.inactiveLabel}
        />
      );
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={[styles.scrollViewContent, { backgroundColor: colors.background }]}
        style={[styles.scrollView, { backgroundColor: colors.background }]}
      >
        <View style={[styles.headerContainer, { 
          backgroundColor: colors.background,
          borderBottomColor: colors.border 
        }]}>
          <Text style={[styles.headerText, { color: colors.primary }]}>{t('sidebar.header')}</Text>
        </View>

        {createDrawerItem(state, navigation, descriptors)}

      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
  },
  scrollViewContent: {
    paddingTop: 0,
  },
  headerContainer: {
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inactiveLabel: {
    fontSize: 16,
  }
});

export default SideBar;
