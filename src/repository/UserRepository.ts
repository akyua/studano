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
}
