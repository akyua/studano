import React from 'react';
import 'i18n';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '@/components/HeaderComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, colors } = useTheme();

  const currentLanguage = i18n.language;

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: colors.background }]}>
      <HeaderComponent />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>{t('settings.title', 'Settings')}</Text>

        <View style={[styles.sectionContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.themeSelectionTitle', 'Select Theme:')}</Text>
          <View style={styles.themeButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border, backgroundColor: colors.surface },
                theme === 'light' && styles.selectedThemeButton,
              ]}
              onPress={() => toggleTheme()}
            >
              <Text style={[
                styles.themeButtonText,
                { color: colors.textSecondary },
                theme === 'light' && styles.selectedThemeButtonText,
              ]}>
                {t('settings.lightTheme', 'Light')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border, backgroundColor: colors.surface },
                theme === 'dark' && styles.selectedThemeButton,
              ]}
              onPress={() => toggleTheme()}
            >
              <Text style={[
                styles.themeButtonText,
                { color: colors.textSecondary },
                theme === 'dark' && styles.selectedThemeButtonText,
              ]}>
                {t('settings.darkTheme', 'Dark')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.sectionContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.languageSelectionTitle', 'Select Language:')}</Text>
          <View style={styles.languageButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                { borderColor: colors.border, backgroundColor: colors.surface },
                currentLanguage === 'pt' && styles.selectedLanguageButton,
              ]}
              onPress={() => i18n.changeLanguage('pt')}
            >
              <Text style={[
                styles.languageButtonText,
                { color: colors.textSecondary },
                currentLanguage === 'pt' && styles.selectedLanguageButtonText,
              ]}>
                PT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageButton,
                { borderColor: colors.border, backgroundColor: colors.surface },
                currentLanguage === 'en' && styles.selectedLanguageButton,
              ]}
              onPress={() => i18n.changeLanguage('en')}
            >
              <Text style={[
                styles.languageButtonText,
                { color: colors.textSecondary },
                currentLanguage === 'en' && styles.selectedLanguageButtonText,
              ]}>
                EN
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.sectionContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.aboutStudanoTitle', 'About Studano:')}</Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            <Text style={[styles.boldText, { color: colors.text }]}>{t('settings.whatIs', 'What is it?')}</Text>{'\n'}
            {t('settings.whatIsDescription', 'Studano is an app designed to help you organize your study routine and stay on track with your goals.')}
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            <Text style={[styles.boldText, { color: colors.text }]}>{t('settings.version', 'Version')}</Text>{' '}1.2.0 (beta)
          </Text>
        </View>

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
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  sectionContainer: {
    borderWidth: 1,
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
    marginBottom: 10,
  },
  themeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  themeButton: {
    flex: 1, 
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  selectedThemeButton: {
    backgroundColor: '#000', 
    borderColor: '#000',
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedThemeButtonText: {
    color: '#fff', 
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
    alignItems: 'center',
  },
  selectedLanguageButton: {
    backgroundColor: '#000', 
    borderColor: '#000',
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedLanguageButtonText: {
    color: '#fff', 
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22, 
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default SettingsScreen;