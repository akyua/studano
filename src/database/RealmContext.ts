import { createRealmContext } from "@realm/react";
import { PomodoroSession } from "@/models/PomodoroSession";
import { Subject } from "@/models/Subject";
import { User } from "@/models/User";

export const realmConfig = {
  schema: [PomodoroSession, Subject, User],
  schemaVersion: 1,
  deleteRealmIfMigrationNeeded: true, // never release the app in production while this is true
};

export const { RealmProvider, useRealm, useObject, useQuery } = createRealmContext(realmConfig);
