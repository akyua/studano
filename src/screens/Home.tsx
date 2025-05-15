import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import 'i18n';
import { useTranslation } from 'react-i18next';
import { HomeScreenProps } from './types';

function Home({ navigation }: HomeScreenProps) {

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('home.welcome')}</Text>
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
    fontSize: 20,
    marginBottom: 20
  },
});

export default Home;
