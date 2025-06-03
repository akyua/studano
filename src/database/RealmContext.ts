import { createRealmContext } from "@realm/react";
import { PomodoroSession } from "@/models/PomodoroSession";
import { Subject } from "@/models/Subject";

export const realmConfig = {
  schema: [PomodoroSession, Subject],
  schemaVersion: 2,
  onMigration: (oldRealm, newRealm) => {},
};

export const { RealmProvider, useRealm, useObject, useQuery } = createRealmContext(realmConfig);
