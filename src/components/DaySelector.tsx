import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
  return (
    <View style={styles.container}>
      {days.map((day) => (
        <TouchableOpacity
          key={day.id}
          style={[
            styles.dayButton,
            selectedDayIds.includes(day.id) ? styles.selectedDayButton : styles.unselectedDayButton,
          ]}
          onPress={() => onDayToggle(day.id)}
        >
          <Text
            style={[
              styles.dayText,
              selectedDayIds.includes(day.id) ? styles.selectedDayText : styles.unselectedDayText,
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
    borderColor: '#ccc',
    marginHorizontal: 4,
  },
  selectedDayButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  unselectedDayButton: {
    backgroundColor: '#fff',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
  },
  unselectedDayText: {
    color: '#000',
  },
});

export default DaySelector;
