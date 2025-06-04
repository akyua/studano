import { Realm, BSON } from "realm";

export class PomodoroSession extends Realm.Object<PomodoroSession> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  startTime!: Date;
  endTime?: Date;
  duration!: number;
  completed!: boolean;

  static primaryKey = "_id";
}
