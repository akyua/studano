import { useState, useEffect, useRef, useMemo } from "react";
import { PomodoroSessionRepository } from "@/repository/PomodoroSessionRepository";
import { Subject } from "@/models/Subject";
import { BSON } from "realm";
import { DatabaseLogger } from "@/utils/databaseLogger";

const FULL_TIME = 1 * 60;

export type PomodoroTimerResult = {
  secondsLeft: number;
  isRunning: boolean;
  formattedTime: string;
  progress: number;
  initialTime: number;
  currentSessionId: BSON.ObjectId | null;
  toggleTimer: () => void;
  resetTimer: () => void;
};

export const usePomodoroTimer = (
  initialTimeParam: number = FULL_TIME,
  selectedSubject?: Subject | null
): PomodoroTimerResult => {
  const [secondsLeft, setSecondsLeft] = useState(initialTimeParam);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<BSON.ObjectId | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionRepo = new PomodoroSessionRepository();

  useEffect(() => {
    DatabaseLogger.logHook("usePomodoroTimer", "subjectChanged", {
      subjectId: selectedSubject?._id?.toHexString() || "null",
      subjectName: selectedSubject?.name || "null",
    });
    
    if (selectedSubject) {
      deleteExistingSessionAndReset();
    } else {
      resetToInitialState();
    }
  }, [selectedSubject?._id?.toHexString()]);

  const resetToInitialState = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentSessionId(null);
    setSecondsLeft(initialTimeParam);
    setIsRunning(false);
  };

  const deleteExistingSessionAndReset = () => {
    if (!selectedSubject) return;

    try {
      DatabaseLogger.logHook("usePomodoroTimer", "deleteExistingSessionAndReset", {
        subjectId: selectedSubject._id.toHexString(),
        subjectName: selectedSubject.name,
      });

      const existingSession = sessionRepo.getActiveSessionForSubject(selectedSubject._id);
      
      if (existingSession) {
        DatabaseLogger.logHook("usePomodoroTimer", "deletingExistingSession", {
          sessionId: existingSession._id.toHexString(),
        });
        sessionRepo.delete(existingSession._id);
      }

      setCurrentSessionId(null);
      setSecondsLeft(initialTimeParam);
      setIsRunning(false);
      
      DatabaseLogger.logHook("usePomodoroTimer", "resetToDefault", {
        resetTo: initialTimeParam,
      });
    } catch (error) {
      DatabaseLogger.logHook("usePomodoroTimer", "deleteExistingSessionAndReset", undefined, undefined, error);
    }
  };

  const loadExistingSession = () => {
    if (!selectedSubject) return;

    try {
      DatabaseLogger.logHook("usePomodoroTimer", "loadExistingSession", {
        subjectId: selectedSubject._id.toHexString(),
        subjectName: selectedSubject.name,
      });

      const existingSession = sessionRepo.getActiveSessionForSubject(selectedSubject._id);
      
      DatabaseLogger.logHook("usePomodoroTimer", "sessionQueryResult", {
        found: !!existingSession,
        sessionId: existingSession?._id?.toHexString() || "null",
        remainingTime: existingSession?.remainingTime || "null",
        paused: existingSession?.paused || "null",
      });
      
      if (existingSession) {
        setCurrentSessionId(existingSession._id);
        setSecondsLeft(existingSession.remainingTime);
        setIsRunning(!existingSession.paused);
        
        DatabaseLogger.logHook("usePomodoroTimer", "sessionLoaded", {
          sessionId: existingSession._id.toHexString(),
          remainingTime: existingSession.remainingTime,
          paused: existingSession.paused,
        });
      } else {
        setCurrentSessionId(null);
        setSecondsLeft(initialTimeParam);
        setIsRunning(false);
        
        DatabaseLogger.logHook("usePomodoroTimer", "noExistingSession", {
          resetTo: initialTimeParam,
        });
      }
    } catch (error) {
      DatabaseLogger.logHook("usePomodoroTimer", "loadExistingSession", undefined, undefined, error);
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((sec) => {
          if (sec === 0) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            completeSession();
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

  const createNewSession = () => {
    if (!selectedSubject) return null;

    try {
      DatabaseLogger.logHook("usePomodoroTimer", "createNewSession", {
        subjectId: selectedSubject._id.toString(),
        duration: initialTimeParam,
      });

      const session = sessionRepo.createForSubject(initialTimeParam, selectedSubject._id);
      setCurrentSessionId(session._id);
      
      DatabaseLogger.logHook("usePomodoroTimer", "sessionCreated", {
        sessionId: session._id.toString(),
      });
      
      return session;
    } catch (error) {
      DatabaseLogger.logHook("usePomodoroTimer", "createNewSession", undefined, undefined, error);
      return null;
    }
  };

  const pauseSession = () => {
    if (!currentSessionId) return;

    try {
      DatabaseLogger.logHook("usePomodoroTimer", "pauseSession", {
        sessionId: currentSessionId.toString(),
        remainingTime: secondsLeft,
      });

      sessionRepo.pause(currentSessionId, secondsLeft);
      
      DatabaseLogger.logHook("usePomodoroTimer", "sessionPaused", {
        sessionId: currentSessionId.toString(),
      });
    } catch (error) {
      DatabaseLogger.logHook("usePomodoroTimer", "pauseSession", undefined, undefined, error);
    }
  };

  const resumeSession = () => {
    if (!currentSessionId) return;

    try {
      DatabaseLogger.logHook("usePomodoroTimer", "resumeSession", {
        sessionId: currentSessionId.toString(),
      });

      sessionRepo.resume(currentSessionId);
      
      DatabaseLogger.logHook("usePomodoroTimer", "sessionResumed", {
        sessionId: currentSessionId.toString(),
      });
    } catch (error) {
      DatabaseLogger.logHook("usePomodoroTimer", "resumeSession", undefined, undefined, error);
    }
  };

  const completeSession = () => {
    if (!currentSessionId) return;

    try {
      DatabaseLogger.logHook("usePomodoroTimer", "completeSession", {
        sessionId: currentSessionId.toString(),
      });

      sessionRepo.complete(currentSessionId);
      setCurrentSessionId(null);
      
      DatabaseLogger.logHook("usePomodoroTimer", "sessionCompleted", {
        sessionId: currentSessionId.toString(),
      });
    } catch (error) {
      DatabaseLogger.logHook("usePomodoroTimer", "completeSession", undefined, undefined, error);
    }
  };

  const deleteSession = () => {
    if (!currentSessionId) return;

    try {
      DatabaseLogger.logHook("usePomodoroTimer", "deleteSession", {
        sessionId: currentSessionId.toString(),
      });

      sessionRepo.delete(currentSessionId);
      setCurrentSessionId(null);
      
      DatabaseLogger.logHook("usePomodoroTimer", "sessionDeleted", {
        sessionId: currentSessionId.toString(),
      });
    } catch (error) {
      DatabaseLogger.logHook("usePomodoroTimer", "deleteSession", undefined, undefined, error);
    }
  };

  const toggleTimer = () => {
    if (!selectedSubject) return;

    if (!isRunning) {
      if (!currentSessionId) {
        createNewSession();
      } else {
        resumeSession();
      }
      setIsRunning(true);
    } else {
      pauseSession();
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setSecondsLeft(initialTimeParam);
    
    if (currentSessionId) {
      deleteSession();
    }
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
    currentSessionId,
    toggleTimer,
    resetTimer,
  };
};
