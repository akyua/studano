import { useEffect } from "react";
import { useRealm, useQuery } from "@/database/RealmContext";
import { User } from "@/models/User";

export function useEnsureUser() {
  const realm = useRealm();
  const users = useQuery(User);

  useEffect(() => {
    if (users.length === 0) {
      realm.write(() => {
        realm.create(User, {
          username: "DefaultUser",
          subjects: [],
        });
      });
    }
  }, [users, realm]);
}

