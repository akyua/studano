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

const COLORS = {
  background: "#000000",
  border: "#333333",
  activeBackground: "#333333",
  activeText: "#ffffff",
  inactiveText: "#999999"
};

const SideBar = (props: DrawerContentComponentProps) => {
  const { t } = useTranslation();
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
          activeTintColor={COLORS.activeText}
          inactiveTintColor={COLORS.inactiveText}
          activeBackgroundColor={COLORS.activeBackground}
          inactiveBackgroundColor={COLORS.background}
          labelStyle={focused ? styles.activeLabel : styles.inactiveLabel}
        />
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{t('sidebar.header')}</Text>
        </View>

        {createDrawerItem(state, navigation, descriptors)}

      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    backgroundColor: COLORS.background,
  },
  scrollViewContent: {
    paddingTop: 0,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background
  },
  headerText: {
    color: COLORS.activeText,
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
