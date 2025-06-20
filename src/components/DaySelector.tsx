import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface DayData {
  id: string;
  day: string;
}

interface DaySelectorProps {
  days: DayData[];
  selectedDayIds: string[];
  onDayToggle: (dayId: string) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ days, selectedDayIds, onDayToggle }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {days.map((day) => (
        <TouchableOpacity
          key={day.id}
          style={[
            styles.dayButton,
            { borderColor: colors.border },
            selectedDayIds.includes(day.id) 
              ? [styles.selectedDayButton, { backgroundColor: colors.primary, borderColor: colors.primary }]
              : [styles.unselectedDayButton, { backgroundColor: colors.surface }]
          ]}
          onPress={() => onDayToggle(day.id)}
        >
          <Text
            style={[
              styles.dayText,
              selectedDayIds.includes(day.id) 
                ? [styles.selectedDayText, { color: colors.surface }]
                : [styles.unselectedDayText, { color: colors.text }]
            ]}
          >
            {day.day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginHorizontal: 4,
  },
  selectedDayButton: {
  },
  unselectedDayButton: {
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDayText: {
  },
  unselectedDayText: {
  },
});

export default DaySelector;
