import React, { useEffect, useState, useCallback } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { HistoryService } from '@/services/historyService';

interface StreakButtonProps {
  onPress?: () => void;
  refreshTrigger?: number;
}

export default function StreakButton({ onPress, refreshTrigger }: StreakButtonProps) {
  const [streakCount, setStreakCount] = useState(0);
  const historyService = new HistoryService();

  const loadStreakCount = useCallback(() => {
    const stats = historyService.getOverallStats(30);
    setStreakCount(stats.studyStreak);
  }, []);

  useEffect(() => {
    loadStreakCount();
  }, [loadStreakCount, refreshTrigger]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={require('../../assets/images/fire.png')} style={styles.icon} />
      <Text style={styles.text}>{streakCount}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 1000,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  }
});
