import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, Platform } from "react-native";
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import "i18n";
import { useTranslation } from "react-i18next";
import { SchedulesScreenProps } from "./types";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from '@/components/HeaderComponent';
import DaySelector from '@/components/DaySelector';
import CustomTimePickerModal from '@/components/CustomTimePickerModal';
import { useRealm, useQuery } from "@/database/RealmContext";
import { User } from "@/models/User";
import { Day } from "@/models/Day";
import { UserPreferencesRepository } from "@/repository/UserPreferencesRepository";
import { DayRepository } from "@/repository/DayRepository";
import { scheduleWeeklyNotifications } from '@/services/notificationService';
import { useTheme } from '@/context/ThemeContext';

const SchedulesScreen = (props: SchedulesScreenProps) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const isPortuguese = i18n.language === 'pt';

  const realm = useRealm();
  const users = useQuery(User);
  const days = useQuery(Day);
  const preferencesRepo = new UserPreferencesRepository();
  const dayRepo = new DayRepository();

  const [selectedDayIds, setSelectedDayIds] = useState<string[]>([]);
  const [notificationTime, setNotificationTime] = useState<Date | undefined>(undefined);
  const [receiveNotifications, setReceiveNotifications] = useState<boolean>(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const currentUser = users[0];
  const sortedDays = days.sorted("order");

  async function requestNotificationPermission() {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      return true;
    }

    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      return true;
    } else {
      Alert.alert(
        t('permissions.deniedTitle'),
        t('permissions.deniedBody'),
      );
      return false;
    }
  }

  useEffect(() => {
    requestNotificationPermission();
    
    if (currentUser) {
      loadSchedule();
    }
  }, [currentUser]);

  const loadSchedule = async () => {
    try {
      if (!currentUser) return;
      const scheduleData = preferencesRepo.getScheduleData(currentUser._id);
      if (scheduleData) {
        setSelectedDayIds(scheduleData.selectedDayIds || []);
        setReceiveNotifications(scheduleData.receiveNotifications || false);
        if (scheduleData.notificationTime) {
          setNotificationTime(new Date(scheduleData.notificationTime));
        }
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const handleDayToggle = (dayId: string) => {
    setSelectedDayIds(prevDayIds =>
      prevDayIds.includes(dayId)
        ? prevDayIds.filter(id => id !== dayId)
        : [...prevDayIds, dayId]
    );
  };

  const formatTimeDisplay = (date?: Date, placeholder?: string) => {
    if (!date) return placeholder || '';
    if (isPortuguese) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    } else {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }
  };

  const handleSetNotificationTime = (newTime: Date) => {
    setNotificationTime(newTime);
  };

  const handleSaveSchedule = async () => {
    if (!currentUser) return;

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return;
    }

    try {
      preferencesRepo.updateScheduleData(
        currentUser._id,
        selectedDayIds,
        notificationTime,
        receiveNotifications
      );
      await scheduleWeeklyNotifications(
        selectedDayIds,
        notificationTime,
        receiveNotifications
      );
      Alert.alert(
        t('schedules.saveSuccessTitle', 'Schedule Saved'),
        t('schedules.saveSuccessBody', 'Your notification preferences have been saved.')
      );
    } catch (error) {
      Alert.alert(
        t('schedules.saveErrorTitle', 'Error'),
        t('schedules.saveErrorBody', 'Could not save the schedule. Please try again.')
      );
    }
  };

  const ptDayAbbreviations: { [key: string]: string } = {
      sun: 'D', mon: 'S', tue: 'T', wed: 'Q', thu: 'Q', fri: 'S', sat: 'S'
  };

  const daysOfWeekData = sortedDays.map(day => ({
    id: day.code,
    day: isPortuguese ? ptDayAbbreviations[day.code] || day.abbreviation : day.abbreviation
  }));

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: colors.background }]}>
      <HeaderComponent />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("schedules.selectDays")}</Text>
        <View style={styles.daysContainer}>
          <DaySelector
            days={daysOfWeekData}
            selectedDayIds={selectedDayIds}
            onDayToggle={handleDayToggle}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("schedules.selectTime")}</Text>
        <View style={styles.timeRow}>
          <Text style={[styles.timeLabel, { color: colors.text }]}>{t("schedules.timeNotification")}</Text>
          <TouchableOpacity
            style={[styles.timeInput, { 
              borderColor: colors.border,
              backgroundColor: colors.surface 
            }]}
            onPress={() => setIsTimePickerVisible(true)}
          >
            <Text style={[
              notificationTime ? styles.selectedTimeText : styles.placeholderText,
              { color: notificationTime ? colors.text : colors.textSecondary }
            ]}>
              {formatTimeDisplay(notificationTime, t("schedules.timeNotificationPlaceholder", "12:00 AM"))}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.notificationContainer, { 
          borderTopColor: colors.border,
          borderBottomColor: colors.border 
        }]}>
          <Text style={[styles.notificationText, { color: colors.text }]}>{t("schedules.receiveNotifications")}</Text>
          <Switch
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={receiveNotifications ? colors.surface : colors.textSecondary}
            ios_backgroundColor={colors.border}
            onValueChange={setReceiveNotifications}
            value={receiveNotifications}
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]} 
          onPress={handleSaveSchedule}
        >
          <Text style={[styles.saveButtonText, { color: colors.surface }]}>{t("schedules.save", "Save Schedule")}</Text>
        </TouchableOpacity>

        <CustomTimePickerModal
          visible={isTimePickerVisible}
          onClose={() => setIsTimePickerVisible(false)}
          onTimeSelect={handleSetNotificationTime}
          initialTime={notificationTime || new Date()}
        />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  timeLabel: {
    fontSize: 16,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTimeText: {
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 16,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  notificationText: {
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 40,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SchedulesScreen;