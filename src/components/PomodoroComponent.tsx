// src/components/PomodoroComponent.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { usePomodoroTimer, PomodoroTimerResult } from '@/hooks/usePomodoroTimer';
import { Subject } from '@/models/Subject';

const RADIUS = 80;
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface PomodoroProps {
  selectedSubject?: Subject | null;
  onResetRef?: (resetFunction: () => void) => void;
}

export default function Pomodoro({ selectedSubject, onResetRef }: PomodoroProps) {
  const { t } = useTranslation();
  const {
    isRunning,
    formattedTime,
    progress,
    toggleTimer,
    resetTimer,
    secondsLeft,
    initialTime,
  }: PomodoroTimerResult = usePomodoroTimer(10, selectedSubject);

  useEffect(() => {
    if (onResetRef) {
      onResetRef(resetTimer);
    }
  }, [onResetRef, resetTimer]);

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Svg width={RADIUS * 2 + STROKE_WIDTH * 2} height={RADIUS * 2 + STROKE_WIDTH * 2}>
          <Circle
            stroke="#ddd"
            fill="none"
            cx={RADIUS + STROKE_WIDTH}
            cy={RADIUS + STROKE_WIDTH}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
          />
          <Circle
            stroke="#000"
            fill="none"
            cx={RADIUS + STROKE_WIDTH}
            cy={RADIUS + STROKE_WIDTH}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            originX={RADIUS + STROKE_WIDTH}
            originY={RADIUS + STROKE_WIDTH}
          />
        </Svg>
        <Text style={styles.timer}>{formattedTime}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={toggleTimer}
          style={styles.button}
          disabled={!selectedSubject}
        >
          <Text style={[styles.buttonText, !selectedSubject && styles.disabledButtonText]}>
            {isRunning ? t('pomodoro.pause') : t('pomodoro.start')}
          </Text>
        </TouchableOpacity>
        {secondsLeft < initialTime && (
          <TouchableOpacity
            onPress={resetTimer}
            style={[styles.button, { marginLeft: 10, backgroundColor: '#666' }]}
          >
            <Text style={styles.buttonText}>{t('pomodoro.reset')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: RADIUS * 2 + STROKE_WIDTH * 2,
    height: RADIUS * 2 + STROKE_WIDTH * 2,
    marginBottom: 40,
  },
  timer: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: '200',
    color: '#000',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  }
});
