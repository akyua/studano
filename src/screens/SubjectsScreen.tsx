import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import "i18n";
import { useTranslation } from "react-i18next";
import { SubjectsScreenProps } from "./types";
import HeaderComponent from "@/components/HeaderComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRealm, useQuery } from "@/database/RealmContext";
import { Subject } from "@/models/Subject";
import { BSON } from "realm";
import { useTheme } from '@/context/ThemeContext';

const SubjectsScreen = (props: SubjectsScreenProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const realm = useRealm();
  const subjects = useQuery(Subject).sorted("name");

  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [sessionDuration, setSessionDuration] = useState("25");
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleAddSubject = () => {
    if (newSubject.trim() !== "") {
      try {
        const durationInSeconds = parseInt(sessionDuration) * 60;
        realm.write(() => {
          realm.create<Subject>("Subject", {
            _id: new BSON.ObjectId(),
            name: newSubject.trim(),
            sessionDuration: durationInSeconds,
            sessions: [],
          });
        });
        setNewSubject("");
        setSessionDuration("25");
        setModalVisible(false);
      } catch (error) {
        Alert.alert(t('common.error'), t('common.failed_to_create_subject'));
      }
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setNewSubject(subject.name);
    setSessionDuration((subject.sessionDuration / 60).toString());
    setModalVisible(true);
  };

  const handleUpdateSubject = () => {
    if (editingSubject && newSubject.trim() !== "") {
      try {
        const durationInSeconds = parseInt(sessionDuration) * 60;
        realm.write(() => {
          editingSubject.name = newSubject.trim();
          editingSubject.sessionDuration = durationInSeconds;
        });
        setNewSubject("");
        setSessionDuration("25");
        setEditingSubject(null);
        setModalVisible(false);
      } catch (error) {
        Alert.alert(t('common.error'), t('common.failed_to_update_subject'));
      }
    }
  };

  const handleDeleteSubject = (subjectToDelete: Subject) => {
    if (subjects.length <= 1) {
      Alert.alert(
        t('common.cannot_delete'),
        t('common.must_have_one_subject'),
        [{ text: t('common.ok') }]
      );
      return;
    }

    const message = t('subjects.deleteConfirmationMessage', { subjectName: subjectToDelete.name });
    Alert.alert(
      t("subjects.deleteConfirmationTitle"),
      message,
      [
        {
          text: t("subjects.cancelButton"),
          style: "cancel",
        },
        {
          text: t("subjects.deleteButton"),
          onPress: () => {
            try {
              realm.write(() => {
                realm.delete(subjectToDelete.sessions);
                realm.delete(subjectToDelete);
              });
            } catch (error) {
              Alert.alert(t('common.error'), t('common.failed_to_delete_subject'));
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const filteredSubjects = subjects.filtered("name CONTAINS[c] $0", searchText);

  const renderItem = ({ item }: { item: Subject }) => (
    <View style={[styles.subjectItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.subjectInfo}>
        <View style={[styles.subjectBullet, { backgroundColor: colors.primary }]} />
        <View style={styles.subjectDetails}>
          <Text style={[styles.subjectName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.subjectDuration, { color: colors.textSecondary }]}>
            {t('subjects.sessionDuration', { duration: item.sessionDuration / 60 })} min
          </Text>
        </View>
      </View>
      <View style={styles.subjectActions}>
        <TouchableOpacity onPress={() => handleEditSubject(item)} style={styles.actionButton}>
          <Image
            source={require("@/../assets/images/edit.png")}
            style={[styles.actionIcon, { tintColor: colors.primary }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteSubject(item)}
          style={[
            styles.actionButton,
            subjects.length <= 1 && styles.disabledButton
          ]}
          disabled={subjects.length <= 1}
        >
          <Image
            source={require("@/../assets/images/delete.png")}
            style={[
              styles.actionIcon,
              {
                tintColor: subjects.length <= 1 ? colors.textSecondary : colors.error
              }
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: colors.background }]}>
      <HeaderComponent />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image
              source={require("@/../assets/images/search.png")}
              style={[styles.icon, { tintColor: colors.textSecondary }]}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t("subjects.searchPlaceholder")}
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              setEditingSubject(null);
              setNewSubject("");
              setModalVisible(true);
            }}
          >
            <Image
              source={require("@/../assets/images/plus.png")}
              style={[styles.icon, { tintColor: colors.surface }]}
            />
            <Text style={[styles.addButtonText, { color: colors.surface }]}>{t("subjects.addSubjectButton")}</Text>
          </TouchableOpacity>

          <FlatList
            data={filteredSubjects}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
            setEditingSubject(null);
            setNewSubject("");
            setSessionDuration("25");
          }}
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingSubject ? t("subjects.editSubjectModalTitle") : t("subjects.addSubjectModalTitle")}
              </Text>
              <Text style={[styles.modalLabel, { color: colors.text }]}>{t("subjects.nameLabel")}</Text>
              <TextInput
                style={[styles.modalInput, { 
                  color: colors.text, 
                  borderColor: colors.border,
                  backgroundColor: colors.surface 
                }]}
                placeholder={t("subjects.subjectNamePlaceholder")}
                placeholderTextColor={colors.textSecondary}
                value={newSubject}
                onChangeText={setNewSubject}
              />
              <Text style={[styles.modalLabel, { color: colors.text }]}>{t("subjects.sessionDurationLabel")}</Text>
              <TextInput
                style={[styles.modalInput, { 
                  color: colors.text, 
                  borderColor: colors.border,
                  backgroundColor: colors.surface 
                }]}
                placeholder={t("subjects.sessionDurationPlaceholder")}
                placeholderTextColor={colors.textSecondary}
                value={sessionDuration}
                onChangeText={setSessionDuration}
                keyboardType="numeric"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel, { backgroundColor: colors.secondary }]}
                  onPress={() => {
                    setModalVisible(false);
                    setEditingSubject(null);
                    setNewSubject("");
                    setSessionDuration("25");
                  }}
                >
                  <Text style={[styles.buttonText, { color: colors.surface }]}>{t("subjects.cancelButton")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonAdd, { backgroundColor: colors.primary }]}
                  onPress={editingSubject ? handleUpdateSubject : handleAddSubject}
                >
                  <Text style={[styles.buttonText, { color: colors.surface }]}>
                    {editingSubject ? t("subjects.updateButton") : t("subjects.addButton")}
                  </Text>
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
  },
  contentContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
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
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 15,
  },
  addButtonText: {
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
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  subjectDetails: {
    flexDirection: 'column',
  },
  subjectName: {
    flex: 1,
    fontSize: 16,
  },
  subjectDuration: {
    fontSize: 14,
  },
  subjectActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 15,
    padding: 5,
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
  separator: {
    height: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
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
  },
  modalInput: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalLabel: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 14,
    fontWeight: 'bold',
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
  },
  buttonAdd: {
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default SubjectsScreen;
