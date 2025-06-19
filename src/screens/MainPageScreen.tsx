import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import 'i18n';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '@/components/HeaderComponent';
import Pomodoro from '@/components/PomodoroComponent';
import SubjectDropdown from '@/components/SubjectDropdown';
import { Subject } from "@/models/Subject";

import { HomeStackElements } from '@/navigation/types';

type MainScreenProps = NativeStackScreenProps<HomeStackElements, 'MainPage'>;

function MainPageScreen({ navigation }: MainScreenProps) {
  const { t } = useTranslation();

  const handleSubjectChange = (subject: Subject | null) => {
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderComponent />
      <View style={styles.container}>
        <View style={styles.dropdownContainer}>
          <SubjectDropdown onSubjectChange={handleSubjectChange} />
        </View>
        <View style={styles.mainContent}>
          <Pomodoro />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
  },
  container: {
    flex: 1,
  },
  dropdownContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
  },
});

export default MainPageScreen;
