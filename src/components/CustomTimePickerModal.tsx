import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface CustomTimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: Date) => void;
  initialTime?: Date;
}

const { width: screenWidth } = Dimensions.get('window');

const CustomTimePickerModal: React.FC<CustomTimePickerModalProps> = ({
  visible,
  onClose,
  onTimeSelect,
  initialTime = new Date(),
}) => {
  const { t } = useTranslation();
  const [selectedHour, setSelectedHour] = useState(initialTime.getHours());
  const [selectedMinute, setSelectedMinute] = useState(initialTime.getMinutes());
  const [isAM, setIsAM] = useState(initialTime.getHours() < 12);

  useEffect(() => {
    if (initialTime) {
      let initialHour = initialTime.getHours();
      if (initialHour === 0) initialHour = 12;
      setSelectedHour(initialHour);
      setSelectedMinute(initialTime.getMinutes());
      setIsAM(initialTime.getHours() < 12);
    }
  }, [initialTime]);

  const generateNumbers = (start: number, end: number, padZero: boolean = false) => {
    const numbers = [];
    for (let i = start; i <= end; i++) {
      numbers.push(padZero ? i.toString().padStart(2, '0') : i.toString());
    }
    return numbers;
  };

  const hours = generateNumbers(1, 12);
  const minutes = generateNumbers(0, 59, true);

  const handleTimeSelect = () => {
    let hour = selectedHour;
    if (!isAM && hour !== 12) {
      hour += 12;
    } else if (isAM && hour === 12) {
      hour = 0;
    }

    const selectedTime = new Date();
    selectedTime.setHours(hour);
    selectedTime.setMinutes(selectedMinute);
    selectedTime.setSeconds(0);
    selectedTime.setMilliseconds(0);

    onTimeSelect(selectedTime);
    onClose();
  };

  const renderPickerColumn = (
    data: string[],
    selectedValue: number,
    onValueChange: (value: number) => void,
    label: string
  ) => (
    <View style={styles.pickerColumn}>
      <Text style={styles.columnLabel}>{label}</Text>
      <ScrollView
        style={styles.pickerScrollView}
        showsVerticalScrollIndicator={false}
        snapToInterval={50}
        decelerationRate="fast"
      >
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.pickerItem,
              selectedValue === (label === 'Hour' ? parseInt(item) : index) && styles.selectedPickerItem,
            ]}
            onPress={() => onValueChange(label === 'Hour' ? parseInt(item) : index)}
          >
            <Text
              style={[
                styles.pickerItemText,
                selectedValue === (label === 'Hour' ? parseInt(item) : index) && styles.selectedPickerItemText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('timePicker.selectTime', 'Select Time')}</Text>

          <View style={styles.pickerContainer}>
            {renderPickerColumn(hours, selectedHour, setSelectedHour, 'Hour')}
            {renderPickerColumn(minutes, selectedMinute, setSelectedMinute, 'Minute')}

            <View style={styles.meridiemColumn}>
              <TouchableOpacity
                style={[styles.meridiemButton, isAM && styles.selectedMeridiemButton]}
                onPress={() => setIsAM(true)}
              >
                <Text style={[styles.meridiemText, isAM && styles.selectedMeridiemText]}>
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.meridiemButton, !isAM && styles.selectedMeridiemButton]}
                onPress={() => setIsAM(false)}
              >
                <Text style={[styles.meridiemText, !isAM && styles.selectedMeridiemText]}>
                  PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{t('common.cancel', 'Cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleTimeSelect}>
              <Text style={styles.confirmButtonText}>{t('common.confirm', 'Confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: screenWidth * 0.9,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerColumn: {
    alignItems: 'center',
    width: 90,
  },
  columnLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  pickerScrollView: {
    height: 150,
    width: '100%',
  },
  pickerItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  selectedPickerItem: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  pickerItemText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlignVertical: 'center',
  },
  selectedPickerItemText: {
    color: '#007AFF',
  },
  meridiemColumn: {
    marginLeft: 15,
    justifyContent: 'center',
    height: 150,
  },
  meridiemButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    flex: 1,
  },
  selectedMeridiemButton: {
    backgroundColor: '#007AFF',
  },
  meridiemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedMeridiemText: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CustomTimePickerModal;
