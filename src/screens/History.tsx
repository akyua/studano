import React from "react";
import { View, Text, StyleSheet } from "react-native";
import "i18n";
import { useTranslation } from "react-i18next";
import { HistoryScreenProps } from "./types"

const History = (props: HistoryScreenProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('history.message')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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

export default History;
