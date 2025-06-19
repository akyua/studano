import { Realm } from "realm";
import { PomodoroSession } from "@/models/PomodoroSession";
import { useRealm } from "@/database/RealmContext";
import { DatabaseLogger } from "@/utils/databaseLogger";

export class PomodoroSessionRepository {
  realm: Realm;

  constructor() {
    this.realm = useRealm();
  }

  create(duration: number, subjectId?: Realm.BSON.ObjectId): PomodoroSession {
    const request = { duration, subjectId: subjectId?.toString() || "null" };
    const now = new Date();
    let session!: PomodoroSession;

    try {
      this.realm.write(() => {
        session = this.realm.create<PomodoroSession>("PomodoroSession", {
          _id: new Realm.BSON.ObjectId(),
          startTime: now,
          endTime: new Date(now.getTime() + duration * 1000),
          duration,
          completed: false,
          subjectId,
        });
      });

      const result = {
        id: session._id.toString(),
        startTime: session.startTime,
        duration: session.duration,
        subjectId: session.subjectId?.toString() || "null",
      };

      DatabaseLogger.logOperation("PomodoroSession", "create", request, result);
      return session;
    } catch (error) {
      DatabaseLogger.logOperation("PomodoroSession", "create", request, undefined, error);
      throw error;
    }
  }

  createForSubject(duration: number, subjectId: Realm.BSON.ObjectId): PomodoroSession {
    return this.create(duration, subjectId);
  }

  createQuickSession(duration: number): PomodoroSession {
    return this.create(duration);
  }

  complete(sessionId: Realm.BSON.ObjectId): PomodoroSession | null {
    const request = { sessionId: sessionId.toString() };

    try {
      const session = this.realm.objectForPrimaryKey<PomodoroSession>("PomodoroSession", sessionId);

      if (session) {
        this.realm.write(() => {
          session.completed = true;
          session.endTime = new Date();
        });

        const result = {
          id: session._id.toString(),
          completed: session.completed,
          endTime: session.endTime,
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
      .filtered("startTime >= $0 AND startTime <= $1", startDate, endDate);
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
