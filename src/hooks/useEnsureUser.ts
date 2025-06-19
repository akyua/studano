import { useEffect } from "react";
import { useRealm, useQuery } from "@/database/RealmContext";
import { User } from "@/models/User";
import { Subject } from "@/models/Subject";
import { Day } from "@/models/Day";
import { SubjectRepository } from "@/repository/SubjectRepository";
import { DayRepository } from "@/repository/DayRepository";
import { DatabaseLogger } from "@/utils/databaseLogger";

export function useEnsureUser() {
  const realm = useRealm();
  const users = useQuery(User);
  const subjects = useQuery(Subject);
  const days = useQuery(Day);
  const subjectRepo = new SubjectRepository();
  const dayRepo = new DayRepository();

  useEffect(() => {
    const request = {
      usersCount: users.length,
      subjectsCount: subjects.length,
      daysCount: days.length
    };

    DatabaseLogger.logHook("useEnsureUser", "check", request);

    if (users.length === 0) {
      DatabaseLogger.logHook("useEnsureUser", "createUser", { username: "DefaultUser" });

      realm.write(() => {
        realm.create(User, {
          username: "DefaultUser",
          subjects: [],
        });
      });

      DatabaseLogger.logHook("useEnsureUser", "createUser", undefined, { success: true });
    }

    if (days.length === 0) {
      DatabaseLogger.logHook("useEnsureUser", "seedDays", { count: 7 });

      dayRepo.seedDays();

      DatabaseLogger.logHook("useEnsureUser", "seedDays", undefined, { success: true });
    }

    const generalSubject = subjects.find((subject) => subject.name === "General");
    if (!generalSubject) {
      DatabaseLogger.logHook("useEnsureUser", "createGeneralSubject", {
        name: "General",
        color: "#007AFF",
      });

      const newSubject = subjectRepo.create("General", "#007AFF");

      const result = {
        id: newSubject._id.toString(),
        name: newSubject.name,
      };

      DatabaseLogger.logHook("useEnsureUser", "createGeneralSubject", undefined, result);
    } else {
      const result = {
        id: generalSubject._id.toString(),
        name: generalSubject.name,
      };

      DatabaseLogger.logHook("useEnsureUser", "checkGeneralSubject", undefined, result);
    }
  }, [users, subjects, days, realm, subjectRepo, dayRepo]);
}
