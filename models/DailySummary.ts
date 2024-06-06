// models/DailySummary.ts
import Realm from 'realm';

// Define the Activity schema
class ActivitySchema extends Realm.Object {
  title!: string;
  duration!: number;
  isGood!: boolean;
  criticalness!: number;

  static schema = {
    name: 'Activity',
    properties: {
      title: 'string',
      duration: 'double',
      isGood: 'bool',
      criticalness: 'int',
    },
  };
}

// Define the DailySummary schema
class DailySummarySchema extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  date!: Date;
  totalDuration!: number;
  activities!: Realm.List<ActivitySchema>;

  static schema = {
    name: 'DailySummary',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userId: 'string',
      date: 'date',
      totalDuration: 'double',
      activities: 'Activity[]', // This refers to the ActivitySchema
    },
  };
}

export { ActivitySchema, DailySummarySchema };
