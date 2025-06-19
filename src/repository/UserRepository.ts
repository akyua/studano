import { Realm, BSON } from "realm";
import { User } from "@/models/User";
import { useRealm } from "@/database/RealmContext";
import { DatabaseLogger } from "@/utils/databaseLogger";

export class UserRepository {
  realm: Realm;

  constructor() {
    this.realm = useRealm();
  }

  create(username: string): User {
    const request = { username };

    try {
      let user!: User;
      this.realm.write(() => {
        user = this.realm.create<User>("User", {
          username,
          subjects: [],
        });
      });

      const result = {
        id: user._id.toString(),
        username: user.username,
        subjectsCount: user.subjects.length,
      };

      DatabaseLogger.logOperation("User", "create", request, result);
      return user;
    } catch (error) {
      DatabaseLogger.logOperation("User", "create", request, undefined, error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    try {
      const users = this.realm.objects<User>("User");

      if (users.length > 0) {
        const user = users[0];
        const result = {
          id: user._id.toString(),
          username: user.username,
          subjectsCount: user.subjects.length,
        };

        DatabaseLogger.logOperation("User", "getCurrentUser", undefined, result);
        return user;
      } else {
        DatabaseLogger.logOperation("User", "getCurrentUser", undefined, null);
        return null;
      }
    } catch (error) {
      DatabaseLogger.logOperation("User", "getCurrentUser", undefined, undefined, error);
      throw error;
    }
  }

  updateUsername(username: string): User | null {
    const user = this.getCurrentUser();
    if (user) {
      this.realm.write(() => {
        user.username = username;
        user.updatedAt = new Date();
      });
      return user;
    }
    return null;
  }

  updateStreakCount(streakCount: number): User | null {
    const user = this.getCurrentUser();
    if (user) {
      this.realm.write(() => {
        user.streakCount = streakCount;
        user.updatedAt = new Date();
      });
      return user;
    }
    return null;
  }

  updateLastSessionDate(date: Date): User | null {
    const user = this.getCurrentUser();
    if (user) {
      this.realm.write(() => {
        user.lastSessionDate = date;
        user.updatedAt = new Date();
      });
      return user;
    }
    return null;
  }

  addSubject(subject: any): User | null {
    const user = this.getCurrentUser();
    if (user) {
      this.realm.write(() => {
        user.subjects.push(subject);
        user.updatedAt = new Date();
      });
      return user;
    }
    return null;
  }

  removeSubject(subjectId: BSON.ObjectId): User | null {
    const user = this.getCurrentUser();
    if (user) {
      this.realm.write(() => {
        const subjectIndex = user.subjects.findIndex((subject) => subject._id.equals(subjectId));
        if (subjectIndex !== -1) {
          user.subjects.splice(subjectIndex, 1);
          user.updatedAt = new Date();
        }
      });
      return user;
    }
    return null;
  }

  getSubjects() {
    try {
      const user = this.getCurrentUser();

      if (user) {
        const result = { count: user.subjects.length };
        DatabaseLogger.logOperation("User", "getSubjects", undefined, result);
        return user.subjects;
      } else {
        DatabaseLogger.logOperation("User", "getSubjects", undefined, { count: 0 });
        return [];
      }
    } catch (error) {
      DatabaseLogger.logOperation("User", "getSubjects", undefined, undefined, error);
      throw error;
    }
  }

  getUserStats() {
    const user = this.getCurrentUser();
    if (!user) return null;

    return {
      username: user.username,
      streakCount: user.streakCount,
      lastSessionDate: user.lastSessionDate,
      totalSubjects: user.subjects.length,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
