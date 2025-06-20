import { useRealm } from "@/database/RealmContext";
import { UserPreferences } from "@/models/UserPreferences";
import { User } from "@/models/User";
import { BSON } from "realm";
import { DatabaseLogger } from "@/utils/databaseLogger";

export class UserPreferencesRepository {
  private realm: Realm;

  constructor() {
    this.realm = useRealm();
  }

  getOrCreatePreferences(userId: BSON.ObjectId): UserPreferences {
    const request = { userId: userId.toString() };

    try {
      let preferences = this.realm.objectForPrimaryKey<UserPreferences>("UserPreferences", userId);

      if (!preferences) {
        this.realm.write(() => {
          preferences = this.realm.create<UserPreferences>("UserPreferences", {
            _id: userId,
            userId,
            lastSelectedSubjectId: undefined,
            scheduleData: {
              selectedDayIds: [],
              notificationTime: undefined,
              receiveNotifications: false,
            },
          });
        });

        const result = {
          id: preferences!._id.toString(),
          userId: preferences!.userId.toString(),
          hasLastSelectedSubject: !!preferences!.lastSelectedSubjectId,
          hasScheduleData: !!preferences!.scheduleData,
        };

        DatabaseLogger.logOperation("UserPreferences", "create", request, result);
      } else {
        const result = {
          id: preferences._id.toString(),
          userId: preferences.userId.toString(),
          hasLastSelectedSubject: !!preferences.lastSelectedSubjectId,
          hasScheduleData: !!preferences.scheduleData,
        };

        DatabaseLogger.logOperation("UserPreferences", "get", request, result);
      }

      return preferences!;
    } catch (error) {
      DatabaseLogger.logOperation("UserPreferences", "getOrCreate", request, undefined, error);
      throw error;
    }
  }

  updateLastSelectedSubject(userId: BSON.ObjectId, subjectId?: BSON.ObjectId): UserPreferences {
    const request = {
      userId: userId.toString(),
      subjectId: subjectId?.toString() || "null",
    };

    try {
      const preferences = this.getOrCreatePreferences(userId);

      this.realm.write(() => {
        preferences.lastSelectedSubjectId = subjectId;
        preferences.updatedAt = new Date();
      });

      const result = {
        id: preferences._id.toString(),
        lastSelectedSubjectId: preferences.lastSelectedSubjectId?.toString() || "null",
        updatedAt: preferences.updatedAt,
      };

      DatabaseLogger.logOperation("UserPreferences", "updateLastSelectedSubject", request, result);
      return preferences;
    } catch (error) {
      DatabaseLogger.logOperation(
        "UserPreferences",
        "updateLastSelectedSubject",
        request,
        undefined,
        error,
      );
      throw error;
    }
  }

  updateScheduleData(
    userId: BSON.ObjectId,
    selectedDayIds: string[],
    notificationTime?: Date,
    receiveNotifications: boolean = false,
  ): UserPreferences {
    const request = {
      userId: userId.toString(),
      selectedDayIds,
      notificationTime: notificationTime?.toISOString(),
      receiveNotifications,
    };

    try {
      const preferences = this.getOrCreatePreferences(userId);

      this.realm.write(() => {
        preferences.scheduleData = {
          selectedDayIds,
          notificationTime,
          receiveNotifications,
        };
        preferences.updatedAt = new Date();
      });

      const result = {
        id: preferences._id.toString(),
        scheduleData: preferences.scheduleData,
        updatedAt: preferences.updatedAt,
      };

      DatabaseLogger.logOperation("UserPreferences", "updateScheduleData", request, result);
      return preferences;
    } catch (error) {
      DatabaseLogger.logOperation(
        "UserPreferences",
        "updateScheduleData",
        request,
        undefined,
        error,
      );
      throw error;
    }
  }

  getLastSelectedSubjectId(userId: BSON.ObjectId): BSON.ObjectId | undefined {
    try {
      const preferences = this.getOrCreatePreferences(userId);
      const result = preferences.lastSelectedSubjectId?.toString() || "null";

      DatabaseLogger.logOperation(
        "UserPreferences",
        "getLastSelectedSubjectId",
        { userId: userId.toString() },
        { lastSelectedSubjectId: result },
      );

      return preferences.lastSelectedSubjectId;
    } catch (error) {
      DatabaseLogger.logOperation(
        "UserPreferences",
        "getLastSelectedSubjectId",
        { userId: userId.toString() },
        undefined,
        error,
      );
      return undefined;
    }
  }

  getScheduleData(userId: BSON.ObjectId) {
    try {
      const preferences = this.getOrCreatePreferences(userId);
      const result = preferences.scheduleData || null;

      DatabaseLogger.logOperation(
        "UserPreferences",
        "getScheduleData",
        { userId: userId.toString() },
        result,
      );

      return preferences.scheduleData;
    } catch (error) {
      DatabaseLogger.logOperation(
        "UserPreferences",
        "getScheduleData",
        { userId: userId.toString() },
        undefined,
        error,
      );
      return null;
    }
  }
}

