import { Realm, BSON } from "realm";
import { PomodoroSession } from "./PomodoroSession";

export class Subject extends Realm.Object<Subject> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  name!: string;
  sessions!: Realm.List<PomodoroSession>;

  static primaryKey = "_id";
}
