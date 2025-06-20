import { Subject } from "./Subject";
import { UserPreferences } from "./UserPreferences";
import { Realm, BSON } from "realm";

export class User extends Realm.Object<User> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  username!: string;
  streakCount: number = 0;
  lastSessionDate?: Date;
  subjects!: Realm.List<Subject>;
  preferences?: UserPreferences;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  static primaryKey = "_id";
}
