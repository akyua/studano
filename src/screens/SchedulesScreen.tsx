import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform, Modal } from "react-native";
import "i18n";
import { useTranslation } from "react-i18next";
import { SchedulesScreenProps } from "./types";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from '@/components/HeaderComponent';
import DaySelector from '@/components/DaySelector';
import CustomTimePickerModal from '@/components/CustomTimePickerModal';

// Dados dos dias da semana para Inglês (Padrão)
const daysOfWeekDataEnglish = [
  { id: 'sun', abbr: 'S' }, // Sunday
  { id: 'mon', abbr: 'M' }, // Monday
  { id: 'tue', abbr: 'T' }, // Tuesday
  { id: 'wed', abbr: 'W' }, // Wednesday
  { id: 'thu', abbr: 'T' }, // Thursday
  { id: 'fri', abbr: 'F' }, // Friday
  { id: 'sat', abbr: 'S' }, // Saturday
];

// Dados dos dias da semana para Português
const daysOfWeekDataPortuguese = [
  { id: 'sun', abbr: 'D' }, // Domingo
  { id: 'mon', abbr: 'S' }, // Segunda
  { id: 'tue', abbr: 'T' }, // Terça
  { id: 'wed', abbr: 'Q' }, // Quarta
  { id: 'thu', abbr: 'Q' }, // Quinta
  { id: 'fri', abbr: 'S' }, // Sexta
  { id: 'sat', abbr: 'S' }, // Sábado
];

const SchedulesScreen = (props: SchedulesScreenProps) => {
  const { t, i18n } = useTranslation();
  const isPortuguese = i18n.language === 'pt';

  const currentDaysOfWeekData = isPortuguese
    ? daysOfWeekDataPortuguese
    : daysOfWeekDataEnglish;

  const [selectedDayIds, setSelectedDayIds] = useState<string[]>([]);
  const [notificationTime, setNotificationTime] = useState<Date | undefined>(undefined);
  const [receiveNotifications, setReceiveNotifications] = useState<boolean>(false);

  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

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
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    } else {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
  };

  const handleSetNotificationTime = (newTime: Date) => {
    setNotificationTime(newTime);
    setIsTimePickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderComponent />
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{t("schedules.selectDays")}</Text>
        <View style={styles.daysContainer}>
          {/* Usa o conjunto de dados selecionado */}
          {currentDaysOfWeekData.map((day) => (
            <DaySelector
              key={day.id}
              day={day.abbr}
              isSelected={selectedDayIds.includes(day.id)}
              onPress={() => handleDayToggle(day.id)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t("schedules.selectTime")}</Text>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>{t("schedules.timeNotification")}</Text>
          <TouchableOpacity
            style={styles.timeInput}
            onPress={() => setIsTimePickerVisible(true)}
          >
            <Text style={notificationTime ? styles.selectedTimeText : styles.placeholderText}>
              {formatTimeDisplay(notificationTime, t("schedules.timeNotificationPlaceholder"))}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>{t("schedules.receiveNotifications")}</Text>
          <Switch
            trackColor={{ false: "#ccc", true: "#000" }}
            thumbColor={receiveNotifications ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setReceiveNotifications}
            value={receiveNotifications}
          />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>{t("schedules.save")}</Text>
        </TouchableOpacity>

        <CustomTimePickerModal
          isVisible={isTimePickerVisible}
          onClose={() => setIsTimePickerVisible(false)}
          onConfirm={handleSetNotificationTime}
          initialTime={notificationTime || new Date()}
          use12HourFormat={!isPortuguese}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
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
    color: "#000",
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTimeText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  notificationText: {
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 40,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SchedulesScreen;