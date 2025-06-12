import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface DaySelectorProps {
  day: string; // Isso será a abreviação (ex: 'S', 'M')
  isSelected: boolean;
  onPress: () => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ day, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.dayButton, isSelected ? styles.selectedDayButton : styles.unselectedDayButton]}
      onPress={onPress}
    >
      <Text style={[styles.dayText, isSelected ? styles.selectedDayText : styles.unselectedDayText]}>
        {day}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
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