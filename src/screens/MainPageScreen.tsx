import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import 'i18n';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '@/components/HeaderComponent';

type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number; otherParam?: string };
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: HomeScreenProps) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderComponent />
      <View style={styles.mainContent}>
        <Text style={styles.text}>{t('home.welcome')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },

  text: { fontSize: 20, marginBottom: 20 },

  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;