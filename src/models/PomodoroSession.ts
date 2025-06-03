import Realm from "realm";

export class PomodoroSession extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  startTime!: Date;
  endTime!: Date;
  duration!: number;
  completed!: boolean;

  static schema = {
    name: "PomodoroSession",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      startTime: "date",
      endTime: "date",
      duration: "int",
      completed: "bool",
    },
  };
}
