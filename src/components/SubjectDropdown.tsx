import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { useTranslation } from "react-i18next";
import { useQuery } from "@/database/RealmContext";
import { Subject } from "@/models/Subject";
import { useSelectedSubject } from "@/hooks/useSelectedSubject";

interface SubjectDropdownProps {
  onSubjectChange?: (subject: Subject | null) => void;
}

export default function SubjectDropdown({ onSubjectChange }: SubjectDropdownProps) {
  const { t } = useTranslation();
  const { selectedSubject, changeSelectedSubject } = useSelectedSubject();
  const subjects = useQuery(Subject).sorted("name");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSubjectSelect = async (subject: Subject | null) => {
    await changeSelectedSubject(subject);
    onSubjectChange?.(subject);
    setDropdownVisible(false);
  };

  const getSubjectDisplayName = () => {
    if (!selectedSubject && subjects.length > 0) {
      return subjects[0].name;
    }
    if (!selectedSubject) {
      return t('subjects.noSubjects', 'No subjects yet');
    }
    return selectedSubject.name;
  };

  const getDisplayText = () => {
    if (subjects.length === 0) {
      return "Loading subjects...";
    }
    return getSubjectDisplayName();
  };

  const renderSubjectItem = ({ item }: { item: Subject }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        selectedSubject?._id.equals(item._id) && styles.selectedDropdownItem
      ]}
      onPress={() => handleSubjectSelect(item)}
    >
      <Text style={[
        styles.dropdownItemText,
        selectedSubject?._id.equals(item._id) && styles.selectedDropdownItemText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.dropdownButtonText}>{getDisplayText()}</Text>
        <Text style={styles.dropdownArrow}>{dropdownVisible ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownModal}>
            <FlatList
              data={subjects}
              renderItem={renderSubjectItem}
              keyExtractor={(item) => item._id.toString()}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 48,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  dropdownList: {
    borderRadius: 12,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedDropdownItem: {
    backgroundColor: '#e3f2fd',
    borderBottomColor: '#bbdefb',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDropdownItemText: {
    fontWeight: '600',
    color: '#1976d2',
  },
}); 
