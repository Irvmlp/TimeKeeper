// ActivityLog.ts
import { Realm } from '@realm/react';

export class ActivityLog extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  title!: string;
  description!: string;
  duration!: number;
  desiredDuration!: number; // Add this field
  timestamp!: Date;
  //criticalness!: string;

  static schema = {
    name: 'ActivityLog',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userId: 'string',
      title: 'string',
      description: 'string',
      duration: 'int',
      desiredDuration: 'int', // Add this field
      timestamp: 'date',
      //criticalness: 'string',
    },
  };
}
