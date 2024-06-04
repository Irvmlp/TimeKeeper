// DailySummary.ts
import { Realm } from '@realm/react';

export class DailySummary extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  date!: string; // Format: YYYYMMDD
  activities!: Realm.List<DailyActivity>;
  
  static schema = {
    name: 'DailySummary',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userId: 'string',
      date: 'string',
      activities: 'list',
    },
  };
}

export class DailyActivity extends Realm.Object {
  title!: string;
  description!: string;
  duration!: number;
  desiredDuration!: number;

  static schema = {
    name: 'DailyActivity',
    properties: {
      title: 'string',
      description: 'string',
      duration: 'int',
      desiredDuration: 'int',
    },
  };
}
