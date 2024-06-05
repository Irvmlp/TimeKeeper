import { Realm } from '@realm/react';

export class DailyData extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  title!: string;
  description!: string;
  duration!: number;
  timestamp!: Date;
  isGood!: boolean; // New field for good or bad
  criticalness!: number; // New field for criticalness

  static schema = {
    name: 'DailyData',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userId: 'string',
      title: 'string',
      description: 'string',
      duration: 'int',
      timestamp: 'date',
      isGood: 'bool', // New field for good or bad
      criticalness: 'int', // New field for criticalness
    },
  };
}
