import { Realm } from "realm";
import { Subject } from "../models/Subject";
import { PomodoroSession } from "../models/PomodoroSession";
import { useRealm } from "@/database/RealmContext";
import { DatabaseLogger } from "@/utils/databaseLogger";
import { BSON } from "realm";

export class SubjectRepository {
  private realm: Realm;

  constructor() {
    this.realm = useRealm();
  }

  create(name: string, color: string): Subject {
    try {
      const request = { name, color };
      DatabaseLogger.logOperation("Subject", "create", request);

      let newSubject: Subject | undefined;
      this.realm.write(() => {
        newSubject = this.realm.create<Subject>("Subject", {
          _id: new BSON.ObjectId(),
          name,
          sessionDuration: 1500,
          sessions: [],
        });
      });

      if (!newSubject) {
        throw new Error("Failed to create subject");
      }

      const result = {
        id: newSubject._id.toString(),
        name: newSubject.name,
      };

      DatabaseLogger.logOperation("Subject", "create", undefined, result);
      return newSubject;
    } catch (error) {
      DatabaseLogger.logOperation("Subject", "create", undefined, undefined, error);
      throw error;
    }
  }

  update(subjectId: Realm.BSON.ObjectId, data: { name?: string; color?: string }): Subject | null {
    const request = { subjectId: subjectId.toString(), data };

    try {
      const subject = this.realm.objectForPrimaryKey<Subject>("Subject", subjectId);

      if (subject) {
        this.realm.write(() => {
          if (data.name !== undefined) subject.name = data.name;
        });

        const result = {
          id: subject._id.toString(),
          name: subject.name,
        };

        DatabaseLogger.logOperation("Subject", "update", request, result);
        return subject;
      }

      DatabaseLogger.logOperation("Subject", "update", request, null);
      return null;
    } catch (error) {
      DatabaseLogger.logOperation("Subject", "update", request, undefined, error);
      throw error;
    }
  }

  delete(subjectId: Realm.BSON.ObjectId): boolean {
    const request = { subjectId: subjectId.toString() };

    try {
      const subject = this.realm.objectForPrimaryKey<Subject>("Subject", subjectId);

      if (subject) {
        this.realm.write(() => {
          this.realm.delete(subject.sessions);
          this.realm.delete(subject);
        });

        DatabaseLogger.logOperation("Subject", "delete", request, { success: true });
        return true;
      }

      DatabaseLogger.logOperation("Subject", "delete", request, { success: false });
      return false;
    } catch (error) {
      DatabaseLogger.logOperation("Subject", "delete", request, undefined, error);
      throw error;
    }
  }

  addSession(subjectId: Realm.BSON.ObjectId, sessionId: Realm.BSON.ObjectId): Subject | null {
    const request = {
      subjectId: subjectId.toString(),
      sessionId: sessionId.toString(),
    };

    try {
      const subject = this.realm.objectForPrimaryKey<Subject>("Subject", subjectId);
      const session = this.realm.objectForPrimaryKey<PomodoroSession>("PomodoroSession", sessionId);

      if (subject && session) {
        this.realm.write(() => {
          subject.sessions.push(session);
        });

        const result = {
          subjectId: subject._id.toString(),
          subjectName: subject.name,
          sessionsCount: subject.sessions.length,
        };

        DatabaseLogger.logOperation("Subject", "addSession", request, result);
        return subject;
      }

      DatabaseLogger.logOperation("Subject", "addSession", request, null);
      return null;
    } catch (error) {
      DatabaseLogger.logOperation("Subject", "addSession", request, undefined, error);
      throw error;
    }
  }

  getAll(): Subject[] {
    try {
      const subjects = this.realm.objects<Subject>("Subject").sorted("name");
      const result = { count: subjects.length };

      DatabaseLogger.logOperation("Subject", "getAll", undefined, result);
      return Array.from(subjects);
    } catch (error) {
      DatabaseLogger.logOperation("Subject", "getAll", undefined, undefined, error);
      return [];
    }
  }

  getById(subjectId: Realm.BSON.ObjectId): Subject | null {
    const request = { subjectId: subjectId.toString() };

    try {
      const subject = this.realm.objectForPrimaryKey<Subject>("Subject", subjectId);

      if (subject) {
        const result = {
          id: subject._id.toString(),
          name: subject.name,
          sessionsCount: subject.sessions.length,
        };

        DatabaseLogger.logOperation("Subject", "getById", request, result);
      } else {
        DatabaseLogger.logOperation("Subject", "getById", request, null);
      }

      return subject;
    } catch (error) {
      DatabaseLogger.logOperation("Subject", "getById", request, undefined, error);
      throw error;
    }
  }

  getByName(name: string): Subject | null {
    const request = { name };

    try {
      const subjects = this.realm.objects<Subject>("Subject").filtered("name == $0", name);

      if (subjects.length > 0) {
        const subject = subjects[0];
        const result = {
          id: subject._id.toString(),
          name: subject.name,
        };

        DatabaseLogger.logOperation("Subject", "getByName", request, result);
        return subject;
      } else {
        DatabaseLogger.logOperation("Subject", "getByName", request, null);
        return null;
      }
    } catch (error) {
      DatabaseLogger.logOperation("Subject", "getByName", request, undefined, error);
      throw error;
    }
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
