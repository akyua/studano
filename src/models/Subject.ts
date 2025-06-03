import Realm from "realm";
import { PomodoroSession } from "./PomodoroSession";

export class Subject extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  sessions!: Realm.List<PomodoroSession>;

  static schema = {
    name: "Subject",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      name: "string",
      sessions: "PomodoroSession[]",
    },
  };
}
