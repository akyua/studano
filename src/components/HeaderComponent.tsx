import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu } from "lucide-react-native";
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useQuery } from '@/database/RealmContext';
import { PomodoroSession } from '@/models/PomodoroSession';
import StreakButton from "@/components/StreakButton.tsx";

const HeaderComponent = () => {
  const navigation = useNavigation();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const sessions = useQuery(PomodoroSession);

  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, [sessions.length]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Menu size={32} color="black" />
      </TouchableOpacity>
      <View style={styles.fireContainer}>
        <StreakButton refreshTrigger={refreshTrigger} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 4,
  },
  fireContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireCount: {
    marginRight: 4,
    fontSize: 16,
    color: '#000',
  }
});

export default HeaderComponent;