import { useState, useEffect, useRef } from "react";

const FULL_TIME = 1 * 60;

export type PomodoroTimerResult = {
  secondsLeft: number;
  isRunning: boolean;
  formattedTime: string;
  progress: number;
  initialTime: number;
  toggleTimer: () => void;
  resetTimer: () => void;
};

export const usePomodoroTimer = (initialTimeParam: number = FULL_TIME): PomodoroTimerResult => {
  const [secondsLeft, setSecondsLeft] = useState(initialTimeParam);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((sec) => {
          if (sec === 0) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return initialTimeParam;
          }
          return sec - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, initialTimeParam]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setSecondsLeft(initialTimeParam);
  };

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const progress = secondsLeft / initialTimeParam;

  return {
    secondsLeft,
    isRunning,
    formattedTime: formatTime(secondsLeft),
    progress,
    initialTime: initialTimeParam,
    toggleTimer,
    resetTimer,
  };
};
