import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { usePomodoroTimer, PomodoroTimerResult } from '@/hooks/usePomodoroTimer';

const RADIUS = 80;
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Pomodoro() {
  const {
    isRunning,
    formattedTime,
    progress,
    toggleTimer,
    resetTimer,
  }: PomodoroTimerResult = usePomodoroTimer();

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

      <TouchableOpacity
        onPress={toggleTimer}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
      {
        <TouchableOpacity
          onPress={resetTimer}
          style={[styles.button, { marginTop: 10, backgroundColor: '#666' }]}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      }
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
  },
  timer: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: '200',
    color: '#000',
  },
  button: {
    marginTop: 40,
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
