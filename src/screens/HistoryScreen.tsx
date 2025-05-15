import React from "react";
import { View, Text, StyleSheet } from "react-native";
import "i18n";
import { useTranslation } from "react-i18next";
import { HistoryScreenProps } from "./types"
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from '@/components/HeaderComponent';

const HistoryScreen = (props: HistoryScreenProps) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderComponent />
      <View style={styles.container}>
        <Text style={styles.text}>{t('history.message')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: "black",
    fontSize: 20,
    marginBottom: 20
  },
});

export default HistoryScreen;
