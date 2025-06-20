import { createRealmContext } from "@realm/react";
import { PomodoroSession } from "@/models/PomodoroSession";
import { Subject } from "@/models/Subject";
import { User } from "@/models/User";
import { UserPreferences } from "@/models/UserPreferences";
import { Day } from "@/models/Day";

export const realmConfig = {
  schema: [PomodoroSession, Subject, User, UserPreferences, Day],
  schemaVersion: 2,
  deleteRealmIfMigrationNeeded: true, // never release the app in production while this is true
};

export const { RealmProvider, useRealm, useObject, useQuery } = createRealmContext(realmConfig);
