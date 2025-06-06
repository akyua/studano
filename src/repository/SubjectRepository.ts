import { Realm } from "realm";
import { Subject } from "../models/Subject";
import { PomodoroSession } from "../models/PomodoroSession";
import { useRealm } from "@/database/RealmContext";

export class SubjectRepository {
  realm: Realm;

  constructor() {
    this.realm = useRealm();
  }

  create(name: string, color: string): Subject {
    let subject!: Subject;

    this.realm.write(() => {
      subject = this.realm.create<Subject>("Subject", {
        _id: new Realm.BSON.ObjectId(),
        name,
        sessions: [],
      });
    });

    return subject;
  }

  update(subjectId: Realm.BSON.ObjectId, data: { name?: string; color?: string }): Subject | null {
    const subject = this.realm.objectForPrimaryKey<Subject>("Subject", subjectId);

    if (subject) {
      this.realm.write(() => {
        if (data.name !== undefined) subject.name = data.name;
      });
      return subject;
    }

    return null;
  }

  delete(subjectId: Realm.BSON.ObjectId): boolean {
    const subject = this.realm.objectForPrimaryKey<Subject>("Subject", subjectId);

    if (subject) {
      this.realm.write(() => {
        this.realm.delete(subject.sessions);
        this.realm.delete(subject);
      });
      return true;
    }

    return false;
  }

  addSession(subjectId: Realm.BSON.ObjectId, sessionId: Realm.BSON.ObjectId): Subject | null {
    const subject = this.realm.objectForPrimaryKey<Subject>("Subject", subjectId);
    const session = this.realm.objectForPrimaryKey<PomodoroSession>("PomodoroSession", sessionId);

    if (subject && session) {
      this.realm.write(() => {
        subject.sessions.push(session);
      });
      return subject;
    }

    return null;
  }

  getAll() {
    return this.realm.objects<Subject>("Subject");
  }

  getById(subjectId: Realm.BSON.ObjectId): Subject | null {
    return this.realm.objectForPrimaryKey<Subject>("Subject", subjectId);
  }

  getByName(name: string) {
    return this.realm.objects<Subject>("Subject").filtered("name = $0", name);
  }
}
