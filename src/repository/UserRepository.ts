import { Realm, BSON } from "realm";
import { User } from "@/models/User";
import { useRealm } from "@/database/RealmContext";

export class UserRepository {
  realm: Realm;

  constructor() {
    this.realm = useRealm();
  }

  create(username: string): User {
    let user!: User;
    this.realm.write(() => {
      user = this.realm.create<User>("User", {
        username,
        subjects: [],
      });
    });
    return user;
  }

  getCurrentUser(): User | null {
    const users = this.realm.objects<User>("User");
    return users.length > 0 ? users[0] : null;
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
    const user = this.getCurrentUser();
    return user ? user.subjects : [];
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
