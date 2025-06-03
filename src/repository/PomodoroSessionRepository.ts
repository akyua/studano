import { Realm } from "realm";
import { PomodoroSession } from "../models/PomodoroSession";

export class PomodoroSessionRepository {
  realm: Realm;

  constructor(realm: Realm) {
    this.realm = realm;
  }

  create(duration: number): PomodoroSession {
    const now = new Date();
    let session!: PomodoroSession;

    this.realm.write(() => {
      session = this.realm.create<PomodoroSession>("PomodoroSession", {
        _id: new Realm.BSON.ObjectId(),
        startTime: now,
        endTime: new Date(now.getTime() + duration * 1000),
        duration,
        completed: false,
      });
    });

    return session;
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
}
