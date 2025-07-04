import { useRealm } from "@/database/RealmContext";
import { PomodoroSession } from "@/models/PomodoroSession";
import { DatabaseLogger } from "@/utils/databaseLogger";
import { BSON } from "realm";

export class PomodoroSessionRepository {
  private realm: Realm;

  constructor() {
    this.realm = useRealm();
  }

  create(
    subjectId: BSON.ObjectId,
    startTime: Date,
    endTime: Date,
    duration: number,
    isCompleted: boolean = false
  ): PomodoroSession {
    try {
      const request = {
        subjectId: subjectId.toString(),
        startTime,
        endTime,
        duration,
        isCompleted,
      };

      DatabaseLogger.logOperation("PomodoroSession", "create", request);

      let newSession: PomodoroSession | undefined;
      this.realm.write(() => {
        newSession = this.realm.create<PomodoroSession>("PomodoroSession", {
          _id: new BSON.ObjectId(),
          subjectId,
          startTime,
          endTime,
          duration,
          remainingTime: duration,
          completed: isCompleted,
          paused: false,
        });
      });

      if (!newSession) {
        throw new Error("Failed to create pomodoro session");
      }

      const result = {
        id: newSession._id.toString(),
        subjectId: newSession.subjectId?.toString() || "null",
        duration: newSession.duration,
      };

      DatabaseLogger.logOperation("PomodoroSession", "create", undefined, result);
      return newSession;
    } catch (error) {
      DatabaseLogger.logOperation("PomodoroSession", "create", undefined, undefined, error);
      throw error;
    }
  }

  pause(sessionId: Realm.BSON.ObjectId, remainingTime: number): PomodoroSession | null {
    const request = { sessionId: sessionId.toString(), remainingTime };

    try {
      const session = this.realm.objectForPrimaryKey<PomodoroSession>("PomodoroSession", sessionId);

      if (session) {
        this.realm.write(() => {
          session.paused = true;
          session.remainingTime = remainingTime;
        });

        const result = {
          id: session._id.toString(),
          paused: session.paused,
          remainingTime: session.remainingTime,
        };

        DatabaseLogger.logOperation("PomodoroSession", "pause", request, result);
        return session;
      }

      DatabaseLogger.logOperation("PomodoroSession", "pause", request, null);
      return null;
    } catch (error) {
      DatabaseLogger.logOperation("PomodoroSession", "pause", request, undefined, error);
      throw error;
    }
  }

  resume(sessionId: Realm.BSON.ObjectId): PomodoroSession | null {
    const request = { sessionId: sessionId.toString() };

    try {
      const session = this.realm.objectForPrimaryKey<PomodoroSession>("PomodoroSession", sessionId);

      if (session) {
        this.realm.write(() => {
          session.paused = false;
        });

        const result = {
          id: session._id.toString(),
          paused: session.paused,
          remainingTime: session.remainingTime,
        };

        DatabaseLogger.logOperation("PomodoroSession", "resume", request, result);
        return session;
      }

      DatabaseLogger.logOperation("PomodoroSession", "resume", request, null);
      return null;
    } catch (error) {
      DatabaseLogger.logOperation("PomodoroSession", "resume", request, undefined, error);
      throw error;
    }
  }

  getActiveSessionForSubject(subjectId: Realm.BSON.ObjectId): PomodoroSession | null {
    const request = { subjectId: subjectId.toString() };

    try {
      const session = this.realm
        .objects<PomodoroSession>("PomodoroSession")
        .filtered("subjectId == $0 AND completed == false", subjectId)
        .sorted("startTime", true)[0];

      if (session) {
        const result = {
          id: session._id.toString(),
          remainingTime: session.remainingTime,
          paused: session.paused,
        };

        DatabaseLogger.logOperation("PomodoroSession", "getActiveSessionForSubject", request, result);
      } else {
        DatabaseLogger.logOperation("PomodoroSession", "getActiveSessionForSubject", request, null);
      }

      return session || null;
    } catch (error) {
      DatabaseLogger.logOperation("PomodoroSession", "getActiveSessionForSubject", request, undefined, error);
      throw error;
    }
  }

  createForSubject(duration: number, subjectId: Realm.BSON.ObjectId): PomodoroSession {
    return this.create(subjectId, new Date(), new Date(new Date().getTime() + duration * 1000), duration);
  }

  createQuickSession(duration: number): PomodoroSession {
    return this.create(new BSON.ObjectId(), new Date(), new Date(new Date().getTime() + duration * 1000), duration);
  }

  complete(sessionId: Realm.BSON.ObjectId): PomodoroSession | null {
    const request = { sessionId: sessionId.toString() };

    try {
      const session = this.realm.objectForPrimaryKey<PomodoroSession>("PomodoroSession", sessionId);

      if (session) {
        this.realm.write(() => {
          session.completed = true;
          session.endTime = new Date();
          session.paused = false;
          session.remainingTime = 0;
        });

        const result = {
          id: session._id.toString(),
          completed: session.completed,
          endTime: session.endTime,
          remainingTime: session.remainingTime,
        };

        DatabaseLogger.logOperation("PomodoroSession", "complete", request, result);
        return session;
      }

      DatabaseLogger.logOperation("PomodoroSession", "complete", request, null);
      return null;
    } catch (error) {
      DatabaseLogger.logOperation("PomodoroSession", "complete", request, undefined, error);
      throw error;
    }
  }

  delete(sessionId: Realm.BSON.ObjectId): boolean {
    const request = { sessionId: sessionId.toString() };

    try {
      const session = this.realm.objectForPrimaryKey<PomodoroSession>("PomodoroSession", sessionId);

      if (session) {
        this.realm.write(() => {
          this.realm.delete(session);
        });

        DatabaseLogger.logOperation("PomodoroSession", "delete", request, { success: true });
        return true;
      }

      DatabaseLogger.logOperation("PomodoroSession", "delete", request, { success: false });
      return false;
    } catch (error) {
      DatabaseLogger.logOperation("PomodoroSession", "delete", request, undefined, error);
      throw error;
    }
  }

  getAll() {
    try {
      const sessions = this.realm.objects<PomodoroSession>("PomodoroSession");
      const result = { count: sessions.length };

      DatabaseLogger.logOperation("PomodoroSession", "getAll", undefined, result);
      return sessions;
    } catch (error) {
      DatabaseLogger.logOperation("PomodoroSession", "getAll", undefined, undefined, error);
      throw error;
    }
  }

  getById(sessionId: Realm.BSON.ObjectId): PomodoroSession | null {
    const request = { sessionId: sessionId.toString() };

    try {
      const session = this.realm.objectForPrimaryKey<PomodoroSession>("PomodoroSession", sessionId);

      if (session) {
        const result = {
          id: session._id.toString(),
          startTime: session.startTime,
          completed: session.completed,
          paused: session.paused,
        };

        DatabaseLogger.logOperation("PomodoroSession", "getById", request, result);
      } else {
        DatabaseLogger.logOperation("PomodoroSession", "getById", request, null);
      }

      return session;
    } catch (error) {
      DatabaseLogger.logOperation("PomodoroSession", "getById", request, undefined, error);
      throw error;
    }
  }

  getCompleted() {
    try {
      const sessions = this.realm
        .objects<PomodoroSession>("PomodoroSession")
        .filtered("completed = true");
      const result = { count: sessions.length };

      DatabaseLogger.logOperation("PomodoroSession", "getCompleted", undefined, result);
      return sessions;
    } catch (error) {
      DatabaseLogger.logOperation("PomodoroSession", "getCompleted", undefined, undefined, error);
      throw error;
    }
  }

  getBySubject(subjectId: Realm.BSON.ObjectId) {
    return this.realm
      .objects<PomodoroSession>("PomodoroSession")
      .filtered("subjectId == $0", subjectId);
  }

  getTrackedSessions() {
    return this.realm.objects<PomodoroSession>("PomodoroSession").filtered("subjectId != null");
  }

  getQuickSessions() {
    return this.realm.objects<PomodoroSession>("PomodoroSession").filtered("subjectId == null");
  }

  getSessionsByDateRange(startDate: Date, endDate: Date) {
    return this.realm
      .objects<PomodoroSession>("PomodoroSession")
      .filtered("startTime >= $0 AND startTime <= $1 AND completed = true", startDate, endDate);
  }

  getTotalStudyTime(subjectId?: Realm.BSON.ObjectId): number {
    let sessions;
    if (subjectId) {
      sessions = this.getBySubject(subjectId);
    } else {
      sessions = this.getTrackedSessions();
    }

    return sessions.reduce((total, session) => {
      if (session.completed) {
        return total + session.duration;
      }
      return total;
    }, 0);
  }
}
