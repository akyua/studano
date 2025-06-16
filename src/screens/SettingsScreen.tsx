import React from 'react';
import 'i18n';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '@/components/HeaderComponent';
import { SafeAreaView } from 'react-native-safe-area-context';

function SettingsScreen() {
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderComponent />
      <View style={styles.container}>
        <Text style={styles.screenTitle}>{t('settings.title', 'Settings')}</Text>

        {/* Seção de Seleção de Idioma */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.languageSelectionTitle', 'Select Language:')}</Text>
          <View style={styles.languageButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'pt' && styles.selectedLanguageButton,
              ]}
              onPress={() => i18n.changeLanguage('pt')}
            >
              <Text style={[
                styles.languageButtonText,
                currentLanguage === 'pt' && styles.selectedLanguageButtonText,
              ]}>
                PT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'en' && styles.selectedLanguageButton,
              ]}
              onPress={() => i18n.changeLanguage('en')}
            >
              <Text style={[
                styles.languageButtonText,
                currentLanguage === 'en' && styles.selectedLanguageButtonText,
              ]}>
                EN
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção Sobre o Studano */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('settings.aboutStudanoTitle', 'About Studano:')}</Text>
          <Text style={styles.aboutText}>
            <Text style={styles.boldText}>{t('settings.whatIs', 'What is it?')}</Text>{'\n'}
            {t('settings.whatIsDescription', 'Studano is an app designed to help you organize your study routine and stay on track with your goals.')}
          </Text>
          <Text style={styles.aboutText}>
            <Text style={styles.boldText}>{t('settings.version', 'Version')}</Text>{' '}1.0.0 (beta)
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3, 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  languageButton: {
    flex: 1, 
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#eee', 
  },
  selectedLanguageButton: {
    backgroundColor: '#000', 
    borderColor: '#000',
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555', 
  },
  selectedLanguageButtonText: {
    color: '#fff', 
  },
  aboutText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22, 
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default SettingsScreen;