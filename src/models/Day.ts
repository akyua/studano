import { Realm, BSON } from "realm";

export class Day extends Realm.Object<Day> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  code!: string;
  abbreviation!: string;
  order!: number;

  static primaryKey = "_id";
} 