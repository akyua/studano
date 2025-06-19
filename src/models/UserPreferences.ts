import { Realm, BSON } from "realm";

export class UserPreferences extends Realm.Object<UserPreferences> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  userId!: BSON.ObjectId;
  lastSelectedSubjectId?: BSON.ObjectId;
  scheduleData?: {
    selectedDayIds: string[];
    notificationTime?: Date;
    receiveNotifications: boolean;
  };
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  static primaryKey = "_id";
}

