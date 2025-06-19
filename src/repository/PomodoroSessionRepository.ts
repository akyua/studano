import { Realm } from "realm";
import { PomodoroSession } from "@/models/PomodoroSession";
import { useRealm } from "@/database/RealmContext";

export class PomodoroSessionRepository {
  realm: Realm;

  constructor() {
    this.realm = useRealm();
  }

  create(duration: number, subjectId?: Realm.BSON.ObjectId): PomodoroSession {
    const now = new Date();
    let session!: PomodoroSession;

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

    return session;
  }

  createForSubject(duration: number, subjectId: Realm.BSON.ObjectId): PomodoroSession {
    return this.create(duration, subjectId);
  }

  createQuickSession(duration: number): PomodoroSession {
    return this.create(duration);
  }

  complete(sessionId: Realm.BSON.ObjectId): PomodoroSession | null {
    const session = this.realm.objectForPrimaryKey<PomodoroSession>("PomodoroSession", sessionId);

    if (session) {
      this.realm.write(() => {
        session.completed = true;
        session.endTime = new Date();
      });
      return session;
    }

    return null;
  }

  delete(sessionId: Realm.BSON.ObjectId): boolean {
    const session = this.realm.objectForPrimaryKey<PomodoroSession>("PomodoroSession", sessionId);

    if (session) {
      this.realm.write(() => {
        this.realm.delete(session);
      });
      return true;
    }

    return false;
  }

  getAll() {
    return this.realm.objects<PomodoroSession>("PomodoroSession");
  }

  getById(sessionId: Realm.BSON.ObjectId): PomodoroSession | null {
    return this.realm.objectForPrimaryKey<PomodoroSession>("PomodoroSession", sessionId);
  }

  getCompleted() {
    return this.realm.objects<PomodoroSession>("PomodoroSession").filtered("completed = true");
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
