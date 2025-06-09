import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import "i18n";
import { useTranslation } from "react-i18next";
import { SubjectsScreenProps } from "./types";
import HeaderComponent from '@/components/HeaderComponent';
import { SafeAreaView } from 'react-native-safe-area-context';

const SubjectsScreen = (props: SubjectsScreenProps) => {
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [subjects, setSubjects] = useState([
    { id: '1', name: 'Work' },
    { id: '2', name: 'Study' },
    { id: '3', name: 'Social' },
    { id: '4', name: 'Rest' },
    { id: '5', name: 'Entertainment' },
    { id: '6', name: 'Other' },
    { id: '7', name: 'Sport' },
  ]);

  const handleAddSubject = () => {
    if (newSubject.trim() !== '') {
      setSubjects([...subjects, { id: Date.now().toString(), name: newSubject.trim() }]);
      setNewSubject('');
      setModalVisible(false);
    }
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity style={styles.subjectItem}>
      <View style={styles.subjectBullet} />
      <Text style={styles.subjectName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderComponent />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <Image
              source={require('@/../assets/images/search.png')}
              style={styles.icon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t('subjects.searchPlaceholder')}
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Image
              source={require('@/../assets/images/plus.png')}
              style={styles.icon}
            />
            <Text style={styles.addButtonText}>{t('subjects.addSubjectButton')}</Text>
          </TouchableOpacity>

          <FlatList
            data={filteredSubjects}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{t('subjects.addSubjectModalTitle')}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t('subjects.subjectNamePlaceholder')}
                placeholderTextColor="#888"
                value={newSubject}
                onChangeText={setNewSubject}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>{t('subjects.cancelButton')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonAdd]}
                  onPress={handleAddSubject}
                >
                  <Text style={styles.buttonText}>{t('subjects.addButton')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: 'black',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 8,
    marginHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 15,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  subjectBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'black',
    marginRight: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  modalInput: {
    height: 40,
    width: '100%',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#DDDDDD',
  },
  buttonAdd: {
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SubjectsScreen;
