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

  getByName(name: string): Subject | null {
    const subjects = this.realm.objects<Subject>("Subject").filtered("name == $0", name);
    return subjects.length > 0 ? subjects[0] : null;
  }

  getSubjectStats(subjectId: Realm.BSON.ObjectId) {
    const subject = this.getById(subjectId);
    if (!subject) return null;

    const completedSessions = subject.sessions.filtered("completed == true");
    const totalStudyTime = completedSessions.reduce(
      (total, session) => total + session.duration,
      0,
    );
    const averageSessionDuration =
      completedSessions.length > 0 ? totalStudyTime / completedSessions.length : 0;

    return {
      name: subject.name,
      totalSessions: subject.sessions.length,
      completedSessions: completedSessions.length,
      totalStudyTime,
      averageSessionDuration,
      lastSessionDate:
        completedSessions.length > 0
          ? completedSessions.sorted("startTime", true)[0].startTime
          : null,
    };
  }

  getMostStudiedSubjects(limit: number = 5) {
    const subjects = this.getAll();
    const subjectsWithStats = subjects.map((subject) => ({
      subject,
      totalTime: subject.sessions
        .filtered("completed == true")
        .reduce((total, session) => total + session.duration, 0),
    }));

    return subjectsWithStats
      .sort((a, b) => b.totalTime - a.totalTime)
      .slice(0, limit)
      .map((item) => item.subject);
  }

  getSubjectsByDateRange(startDate: Date, endDate: Date) {
    return this.realm
      .objects<Subject>("Subject")
      .filtered(
        "ANY sessions.startTime >= $0 AND ANY sessions.startTime <= $1",
        startDate,
        endDate,
      );
  }

  getTotalStudyTimeForSubject(subjectId: Realm.BSON.ObjectId): number {
    const subject = this.getById(subjectId);
    if (!subject) return 0;

    return subject.sessions
      .filtered("completed == true")
      .reduce((total, session) => total + session.duration, 0);
  }

  getRecentSessions(subjectId: Realm.BSON.ObjectId, limit: number = 10) {
    const subject = this.getById(subjectId);
    if (!subject) return [];

    return subject.sessions.sorted("startTime", true).slice(0, limit);
  }
}
