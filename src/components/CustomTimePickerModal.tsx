import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface CustomTimePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (time: Date) => void;
  initialTime: Date;
  use12HourFormat: boolean;
}

const CustomTimePickerModal: React.FC<CustomTimePickerModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  initialTime,
  use12HourFormat,
}) => {
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [meridiem, setMeridiem] = useState('AM');

  useEffect(() => {
    if (isVisible) {
      let initialHour = initialTime.getHours();
      let initialMinute = initialTime.getMinutes();

      if (use12HourFormat) {
        setMeridiem(initialHour >= 12 ? 'PM' : 'AM');
        initialHour = initialHour % 12;
        if (initialHour === 0) initialHour = 12; // 0h ou 12h AM devem ser 12 no formato 12h
      }

      setSelectedHour(initialHour.toString());
      setSelectedMinute(initialMinute < 10 ? `0${initialMinute}` : initialMinute.toString());
    }
  }, [isVisible, initialTime, use12HourFormat]);

  const generateNumbers = (start: number, end: number, padZero: boolean = false) => {
    return Array.from({ length: end - start + 1 }, (_, i) => {
      const num = start + i;
      return padZero && num < 10 ? `0${num}` : `${num}`;
    });
  };

  const hours = use12HourFormat ? generateNumbers(1, 12, false) : generateNumbers(0, 23, true);
  const minutes = generateNumbers(0, 59, true); // Minutos sempre com zero à esquerda

  const handleConfirm = () => {
    let hour = parseInt(selectedHour, 10);
    const minute = parseInt(selectedMinute, 10);

    if (use12HourFormat) {
      if (meridiem === 'PM' && hour < 12) {
        hour += 12;
      } else if (meridiem === 'AM' && hour === 12) {
        hour = 0; // 12 AM (meia-noite) é 0h
      }
    }

    const newTime = new Date();
    newTime.setHours(hour);
    newTime.setMinutes(minute);
    newTime.setSeconds(0);
    newTime.setMilliseconds(0);
    onConfirm(newTime);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Selecione o Horário</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedHour}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedHour(itemValue)}
            >
              {hours.map((hour) => (
                <Picker.Item
                  key={hour}
                  label={hour}
                  value={hour}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>
            <Text style={styles.pickerSeparator}>:</Text>
            <Picker
              selectedValue={selectedMinute}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMinute(itemValue)}
            >
              {minutes.map((minute) => (
                <Picker.Item
                  key={minute}
                  label={minute}
                  value={minute}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>

            {use12HourFormat && (
              <View style={styles.meridiemColumn}>
                <TouchableOpacity
                  style={[styles.meridiemButton, meridiem === 'AM' && styles.selectedMeridiem]}
                  onPress={() => setMeridiem('AM')}
                >
                  <Text style={[styles.meridiemText, meridiem === 'AM' && styles.selectedMeridiemText]}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.meridiemButton, meridiem === 'PM' && styles.selectedMeridiem]}
                  onPress={() => setMeridiem('PM')}
                >
                  <Text style={[styles.meridiemText, meridiem === 'PM' && styles.selectedMeridiemText]}>PM</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },
  picker: {
    width: 90, // Aumentado para dar mais espaço
    height: 150,
    // Flex 1 pode ajudar a distribuir o espaço, mas vamos começar com largura fixa
    // flex: 1,
  },
  pickerItem: {
    color: '#000',
    fontSize: 22, // Aumentado para ver se ajuda a renderização
    fontWeight: 'bold', // Mantido para destaque
    textAlign: 'center',
    // Adicionado para Android, para centralizar verticalmente
    ...(Platform.OS === 'android' && {
      textAlignVertical: 'center',
    }),
  },
  pickerSeparator: {
    fontSize: 28, // Aumentado para destaque
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 5,
  },
  meridiemColumn: { // Renomeado de meridiemContainer para ser mais descritivo
    flexDirection: 'column',
    marginLeft: 15, // Ajustado para dar mais espaço
    justifyContent: 'center', // Centralizar os botões verticalmente
    height: 150, // Mesma altura dos pickers para alinhamento
  },
  meridiemButton: {
    paddingVertical: 10, // Aumentado o padding
    paddingHorizontal: 20, // Aumentado o padding
    borderRadius: 8, // Borda mais arredondada
    marginBottom: 5, // Espaço entre os botões
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Para que ocupem o espaço disponível igualmente
  },
  selectedMeridiem: {
    backgroundColor: '#000',
  },
  meridiemText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedMeridiemText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomTimePickerModal;