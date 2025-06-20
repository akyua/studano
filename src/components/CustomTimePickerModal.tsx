import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';

const { height } = Dimensions.get('window');
const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 3;

interface CustomTimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: Date) => void;
  initialTime?: Date;
}

const CustomTimePickerModal: React.FC<CustomTimePickerModalProps> = ({
  visible,
  onClose,
  onTimeSelect,
  initialTime = new Date(),
}) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const isPortuguese = i18n.language === 'pt';

  const [selectedHour, setSelectedHour] = useState(initialTime.getHours());
  const [selectedMinute, setSelectedMinute] = useState(initialTime.getMinutes());
  const [selectedAmPm, setSelectedAmPm] = useState(initialTime.getHours() < 12 ? 'AM' : 'PM');

  const hourListRef = useRef<FlatList>(null);
  const minuteListRef = useRef<FlatList>(null);
  const ampmListRef = useRef<FlatList>(null);

  const hoursData = isPortuguese ? [...Array(24).keys()] : Array.from({ length: 12 }, (_, i) => i + 1);
  const minutesData = [...Array(60).keys()];
  const ampmData = ['AM', 'PM'];

  const getItemLayout = (data: any[] | null | undefined, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  useEffect(() => {
    if (visible) {
      const initDate = initialTime || new Date();
      const initialHour = initDate.getHours();
      const initialMinute = initDate.getMinutes();
      
      const hourFor12h = initialHour === 0 ? 12 : initialHour > 12 ? initialHour - 12 : initialHour;
      
      const targetHour = isPortuguese ? initialHour : hourFor12h;
      const targetAmPm = initialHour < 12 ? 'AM' : 'PM';
      
      setSelectedHour(targetHour);
      setSelectedMinute(initialMinute);
      setSelectedAmPm(targetAmPm);
      
      setTimeout(() => {
        const hourIndex = hoursData.indexOf(targetHour);
        if (hourIndex > -1) {
          hourListRef.current?.scrollToIndex({ index: hourIndex, animated: false });
        }
        
        const minuteIndex = minutesData.indexOf(initialMinute);
        if (minuteIndex > -1) {
          minuteListRef.current?.scrollToIndex({ index: minuteIndex, animated: false });
        }

        if (!isPortuguese) {
          const ampmIndex = ampmData.indexOf(targetAmPm);
          if (ampmIndex > -1) {
            ampmListRef.current?.scrollToIndex({ index: ampmIndex, animated: false });
          }
        }
      }, 150);
    }
  }, [visible, initialTime, isPortuguese]);

  const handleConfirm = () => {
    const finalDate = new Date(initialTime);
    let finalHour = selectedHour;

    if (!isPortuguese) {
      if (selectedAmPm === 'PM' && selectedHour !== 12) {
        finalHour += 12;
      } else if (selectedAmPm === 'AM' && selectedHour === 12) {
        finalHour = 0;
      }
    }

    finalDate.setHours(finalHour);
    finalDate.setMinutes(selectedMinute);
    onTimeSelect(finalDate);
  };
  
  const renderPickerItem = (item: number | string, isSelected: boolean) => (
    <View style={[styles.itemContainer, { height: ITEM_HEIGHT }]}>
      <Text style={[styles.itemText, { color: isSelected ? colors.primary : colors.textSecondary, fontWeight: isSelected ? 'bold' : 'normal' }]}>
        {typeof item === 'number' ? String(item).padStart(2, '0') : item}
      </Text>
    </View>
  );
  
  const createMomentumHandler = (setter: React.Dispatch<React.SetStateAction<any>>, data: any[]) => (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    if (index >= 0 && index < data.length) {
      setter(data[index]);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={styles.pickerWrapper}>
            <View style={styles.selectionIndicator} />
            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <FlatList
                  ref={hourListRef}
                  data={hoursData}
                  renderItem={({ item }) => renderPickerItem(item, item === selectedHour)}
                  keyExtractor={(item) => `h-${item}`}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
                  onMomentumScrollEnd={createMomentumHandler(setSelectedHour, hoursData)}
                  getItemLayout={getItemLayout} 
                />
              </View>
              <Text style={[styles.separator, { color: colors.text }]}>:</Text>
              <View style={styles.pickerColumn}>
                <FlatList
                  ref={minuteListRef}
                  data={minutesData}
                  renderItem={({ item }) => renderPickerItem(item, item === selectedMinute)}
                  keyExtractor={(item) => `m-${item}`}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
                  onMomentumScrollEnd={createMomentumHandler(setSelectedMinute, minutesData)}
                  getItemLayout={getItemLayout} 
                />
              </View>
              {!isPortuguese && (
                <View style={styles.pickerColumn}>
                  <FlatList
                    ref={ampmListRef}
                    data={ampmData}
                    renderItem={({ item }) => renderPickerItem(item, item === selectedAmPm)}
                    keyExtractor={(item) => `ap-${item}`}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
                    onMomentumScrollEnd={createMomentumHandler(setSelectedAmPm, ampmData)}
                    getItemLayout={getItemLayout} 
                  />
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity style={[styles.confirmButton, { backgroundColor: colors.primary }]} onPress={handleConfirm}>
            <Text style={[styles.confirmButtonText, { color: colors.surface }]}>{t('common.confirm', 'Confirmar')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pickerWrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: 10,
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    zIndex: -1,
  },
  pickerColumn: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: 80,
  },
  separator: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  itemContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 28,
  },
  confirmButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomTimePickerModal;