import { useRealm } from "@/database/RealmContext";
import { Day } from "@/models/Day";
import { DatabaseLogger } from "@/utils/databaseLogger";
import { BSON } from "realm";

export class DayRepository {
  private realm: Realm;

  constructor() {
    this.realm = useRealm();
  }

  getAll(): Day[] {
    try {
      const days = this.realm.objects<Day>("Day").sorted("order");
      const result = { count: days.length };

      DatabaseLogger.logOperation("Day", "getAll", undefined, result);
      return Array.from(days);
    } catch (error) {
      DatabaseLogger.logOperation("Day", "getAll", undefined, undefined, error);
      return [];
    }
  }

  seedDays(): void {
    try {
      const existingDays = this.realm.objects<Day>("Day");

      if (existingDays.length > 0) {
        DatabaseLogger.logOperation("Day", "seedDays", undefined, {
          message: "Days already exist",
        });
        return;
      }

      const daysData = [
        { code: "sun", abbreviation: "S", order: 0 },
        { code: "mon", abbreviation: "M", order: 1 },
        { code: "tue", abbreviation: "T", order: 2 },
        { code: "wed", abbreviation: "W", order: 3 },
        { code: "thu", abbreviation: "T", order: 4 },
        { code: "fri", abbreviation: "F", order: 5 },
        { code: "sat", abbreviation: "S", order: 6 },
      ];

      this.realm.write(() => {
        daysData.forEach((dayData) => {
          this.realm.create<Day>("Day", {
            _id: new BSON.ObjectId(),
            ...dayData,
          });
        });
      });

      const result = { count: daysData.length };
      DatabaseLogger.logOperation("Day", "seedDays", undefined, result);
    } catch (error) {
      DatabaseLogger.logOperation("Day", "seedDays", undefined, undefined, error);
      throw error;
    }
  }
}

