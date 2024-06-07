import Realm from 'realm';
import { ActivitySchema } from './DailySummary'; // Reuse the ActivitySchema from DailySummary

class WeeklySummarySchema extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  week!: string; // A string representing the week, e.g., "2024-W23"
  totalDuration!: number;
  activities!: Realm.List<ActivitySchema>;

  static schema = {
    name: 'WeeklySummary',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userId: 'string',
      week: 'string', // Week identifier
      totalDuration: 'double',
      activities: 'Activity[]', // Reuse the ActivitySchema
    },
  };
}

export { WeeklySummarySchema };
