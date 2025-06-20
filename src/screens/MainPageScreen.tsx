import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import 'i18n';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@/database/RealmContext';
import { User } from '@/models/User';
import { UserPreferences } from '@/models/UserPreferences';
import { UserPreferencesRepository } from '@/repository/UserPreferencesRepository';
import { SubjectRepository } from '@/repository/SubjectRepository';
import HeaderComponent from '@/components/HeaderComponent';
import Pomodoro from '@/components/PomodoroComponent';
import SubjectDropdown from '@/components/SubjectDropdown';
import { useSelectedSubject } from '@/hooks/useSelectedSubject';
import { Subject } from '@/models/Subject';
import { useTheme } from '@/context/ThemeContext';

import { HomeStackElements } from '@/navigation/types';

type MainScreenProps = NativeStackScreenProps<HomeStackElements, 'MainPage'>;

function MainPageScreen({ navigation }: MainScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { selectedSubject } = useSelectedSubject();
  const users = useQuery(User);
  const userPreferences = useQuery(UserPreferences);
  const preferencesRepo = new UserPreferencesRepository();
  const subjectRepo = new SubjectRepository();
  
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [lastKnownSubjectId, setLastKnownSubjectId] = useState<string | null>(null);
  const resetRef = useRef<(() => void) | null>(null);

  const currentUser = users[0];
  const currentUserPreferences = userPreferences.find(pref => pref.userId.equals(currentUser?._id));

  useEffect(() => {
    if (currentUser && currentUserPreferences) {
      const lastSelectedSubjectId = currentUserPreferences.lastSelectedSubjectId;
      const subjectIdString = lastSelectedSubjectId?.toString() || null;
      
      if (subjectIdString !== lastKnownSubjectId) {
        setLastKnownSubjectId(subjectIdString);
        
        if (subjectIdString) {
          const subject = subjectRepo.getById(lastSelectedSubjectId!);
          if (subject && subject._id.toString() !== currentSubject?._id?.toString()) {
            setCurrentSubject(subject);
            if (resetRef.current) {
              resetRef.current();
            }
          }
        }
      }
    }
  }, [currentUser, currentUserPreferences, lastKnownSubjectId, currentSubject]);

  const handleResetRef = (resetFunction: () => void) => {
    resetRef.current = resetFunction;
  };

  const handleSubjectChange = (subject: any) => {
  };

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: colors.background }]}>
      <HeaderComponent />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.dropdownContainer, { backgroundColor: colors.background }]}>
          <SubjectDropdown onSubjectChange={handleSubjectChange} />
        </View>
        <View style={[styles.mainContent, { backgroundColor: colors.background }]}>
          <Pomodoro selectedSubject={currentSubject} onResetRef={handleResetRef} />
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
  },
  dropdownContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80, 
  },
});

export default MainPageScreen;