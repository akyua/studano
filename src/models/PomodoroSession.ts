import { Realm, BSON } from "realm";
import { Subject } from "./Subject";

export class PomodoroSession extends Realm.Object<PomodoroSession> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  startTime!: Date;
  endTime?: Date;
  duration!: number;
  remainingTime!: number;
  completed!: boolean;
  paused!: boolean;
  subjectId?: BSON.ObjectId;

  static primaryKey = "_id";
}
