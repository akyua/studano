import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '@/components/HeaderComponent';
import Pomodoro from '@/components/PomodoroComponent';

type AppStackParamList = {
  Home: undefined;
  Settings: undefined;
};

type HomeScreenProps = NativeStackScreenProps<AppStackParamList, 'Home'>;

function HomeScreen({ navigation }: HomeScreenProps) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderComponent />
      <View style={styles.mainContent}>
        <Pomodoro />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
