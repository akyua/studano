import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer"
import { useTranslation } from 'react-i18next';

const SideBar = (props: DrawerContentComponentProps) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{t('sidebar.header')}</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 0,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SideBar;
