import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTranslation } from "react-i18next";
import { useQuery } from "@/database/RealmContext";
import { Subject } from "@/models/Subject";
import { useSelectedSubject } from "@/hooks/useSelectedSubject";

interface SubjectSelectorProps {
  onSubjectChange?: (subject: Subject | null) => void;
}

export default function SubjectSelector({ onSubjectChange }: SubjectSelectorProps) {
  const { t } = useTranslation();
  const { selectedSubject, changeSelectedSubject, createGeneralSubject } = useSelectedSubject();
  const subjects = useQuery(Subject);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubjectSelect = async (subject: Subject | null) => {
    await changeSelectedSubject(subject);
    onSubjectChange?.(subject);
    setModalVisible(false);
  };

  const handleCreateGeneralSubject = async () => {
    const generalSubject = await createGeneralSubject();
    if (generalSubject) {
      onSubjectChange?.(generalSubject);
      setModalVisible(false);
    } else {
      Alert.alert(
        t('subjects.errorTitle', 'Error'),
        t('subjects.createError', 'Could not create General subject')
      );
    }
  };

  const getSubjectDisplayName = () => {
    if (!selectedSubject) {
      return t('subjects.noSubjects', 'No subjects yet');
    }
    return selectedSubject.name;
  };

  const getSubjectDisplayColor = () => {
    if (!selectedSubject) {
      return '#FF9500';
    }
    return '#007AFF';
  };

  const renderSubjectItem = ({ item }: { item: Subject }) => (
    <TouchableOpacity
      style={[
        styles.subjectItem,
        selectedSubject?._id.equals(item._id) && styles.selectedSubjectItem
      ]}
      onPress={() => handleSubjectSelect(item)}
    >
      <View style={[styles.subjectBullet, { backgroundColor: '#007AFF' }]} />
      <Text style={[
        styles.subjectName,
        selectedSubject?._id.equals(item._id) && styles.selectedSubjectName
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={[styles.subjectBullet, { backgroundColor: getSubjectDisplayColor() }]} />
        <Text style={styles.selectorText}>{getSubjectDisplayName()}</Text>
        <Text style={styles.selectorArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t('subjects.selectSubject', 'Select Subject')}
            </Text>
            
            <FlatList
              data={subjects}
              renderItem={renderSubjectItem}
              keyExtractor={(item) => item._id.toString()}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {t('subjects.noSubjects', 'No subjects yet')}
                  </Text>
                  <TouchableOpacity
                    style={styles.createGeneralButton}
                    onPress={handleCreateGeneralSubject}
                  >
                    <Text style={styles.createGeneralButtonText}>
                      {t('subjects.createGeneral', 'Create General Subject')}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>
                {t('common.cancel', 'Cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  subjectBullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  selectorArrow: {
    fontSize: 12,
    color: '#8E8E93',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  selectedSubjectItem: {
    backgroundColor: '#E3F2FD',
  },
  subjectName: {
    fontSize: 16,
    color: '#000',
  },
  selectedSubjectName: {
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 15,
  },
  createGeneralButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createGeneralButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
}); 