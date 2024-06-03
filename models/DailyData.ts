import { Realm, createRealmContext } from '@realm/react';

export class DailyData extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  userId!: string; // New field for user ID
  title!: string;
  description!: string;
  duration!: number;
  timestamp!: Date; // New field for timestamp

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
    },
  };
}

export const RealmContext = createRealmContext({
  schema: [DailyData],
});
