import { Realm } from '@realm/react';

export class DailyBreakdown extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  userId!: string;
  date!: Date;
  breakdown!: { title: string; duration: number }[];

  static schema = {
    name: 'DailyBreakdown',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      userId: 'string',
      date: 'date',
      breakdown: {
        type: 'list',
        objectType: 'BreakdownItem',
      },
    },
  };
}

class BreakdownItem extends Realm.Object {
  title!: string;
  duration!: number;

  static schema = {
    name: 'BreakdownItem',
    embedded: true,
    properties: {
      title: 'string',
      duration: 'int',
    },
  };
}
