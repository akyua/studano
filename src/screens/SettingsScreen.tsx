import React from 'react';
import 'i18n';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '@/components/HeaderComponent';
import { SafeAreaView } from 'react-native-safe-area-context';

function SettingsScreen() {
  const { t, i18n } = useTranslation();

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderComponent />
      <View style={styles.container}>
        <Text style={styles.text}>{t('settings.title', 'Settings')}</Text>
        <Button title="PT" onPress={() => i18n.changeLanguage('pt')} />
        <Button title="EN" onPress={() => i18n.changeLanguage('en')} />
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
    justifyContent: 'center',
    padding: 20
  },
  text: {
    fontSize: 20,
    marginBottom: 20
  },
});

export default SettingsScreen;
