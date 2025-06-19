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
import { Realm } from "realm";

const SubjectsScreen = (props: SubjectsScreenProps) => {
  const { t } = useTranslation();
  const realm = useRealm();
  const subjects = useQuery(Subject).sorted("name");

  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleAddSubject = () => {
    if (newSubject.trim() !== "") {
      try {
        realm.write(() => {
          realm.create<Subject>("Subject", {
            _id: new Realm.BSON.ObjectId(),
            name: newSubject.trim(),
            sessions: [],
          });
        });
        setNewSubject("");
        setModalVisible(false);
      } catch (error) {
        Alert.alert("Error", "Failed to create subject. Please try again.");
      }
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setNewSubject(subject.name);
    setModalVisible(true);
  };

  const handleUpdateSubject = () => {
    if (editingSubject && newSubject.trim() !== "") {
      try {
        realm.write(() => {
          editingSubject.name = newSubject.trim();
        });
        setNewSubject("");
        setEditingSubject(null);
        setModalVisible(false);
      } catch (error) {
        Alert.alert("Error", "Failed to update subject. Please try again.");
      }
    }
  };

  const handleDeleteSubject = (subjectToDelete: Subject) => {
    if (subjects.length <= 1) {
      Alert.alert(
        "Cannot Delete",
        "You must have at least one subject. Please create another subject before deleting this one.",
        [{ text: "OK" }]
      );
      return;
    }

    const message = `Are you sure you want to delete '${subjectToDelete.name}'?`;
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
              Alert.alert("Error", "Failed to delete subject. Please try again.");
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
    <View style={styles.subjectItem}>
      <View style={styles.subjectBullet} />
      <Text style={styles.subjectName}>{item.name}</Text>
      <View style={styles.subjectActions}>
        <TouchableOpacity onPress={() => handleEditSubject(item)} style={styles.actionButton}>
          <Image
            source={require("@/../assets/images/edit.png")}
            style={[styles.actionIcon, { tintColor: "#000000" }]}
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
                tintColor: subjects.length <= 1 ? "#999999" : "#FF3B30"
              }
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <HeaderComponent />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <Image
              source={require("@/../assets/images/search.png")}
              style={styles.icon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t("subjects.searchPlaceholder")}
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingSubject(null);
              setNewSubject("");
              setModalVisible(true);
            }}
          >
            <Image
              source={require("@/../assets/images/plus.png")}
              style={styles.icon}
            />
            <Text style={styles.addButtonText}>{t("subjects.addSubjectButton")}</Text>
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
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>
                {editingSubject ? t("subjects.editSubjectModalTitle") : t("subjects.addSubjectModalTitle")}
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t("subjects.subjectNamePlaceholder")}
                placeholderTextColor="#888"
                value={newSubject}
                onChangeText={setNewSubject}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => {
                    setModalVisible(false);
                    setEditingSubject(null);
                    setNewSubject("");
                  }}
                >
                  <Text style={styles.buttonText}>{t("subjects.cancelButton")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonAdd]}
                  onPress={editingSubject ? handleUpdateSubject : handleAddSubject}
                >
                  <Text style={styles.buttonText}>
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
    justifyContent: 'space-between',
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
  subjectName: {
    flex: 1,
    color: 'black',
    fontSize: 16,
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
  disabledButton: {
    opacity: 0.5,
  },
});

export default SubjectsScreen;
