import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface TimeSelectorProps {
  selectedTime: Date | undefined;
  onTimeChange: (time: Date | undefined) => void;
  placeholder: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ selectedTime, onTimeChange, placeholder }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleTimeChange = (event: DateTimePickerEvent, newTime?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (newTime) {
      onTimeChange(newTime);
    }
  };

  const displayTime = selectedTime ?
    selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
    placeholder;

  return (
    <View>
      <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker(true)}>
        <Text style={selectedTime ? styles.selectedTimeText : styles.placeholderText}>
          {displayTime}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default TimeSelector;