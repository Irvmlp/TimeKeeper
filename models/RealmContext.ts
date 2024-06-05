import { createRealmContext } from '@realm/react';
import { DailyData } from './DailyData';
import { ActivityLog } from './ActivityLog';

export const RealmContext = createRealmContext({
  schema: [DailyData, ActivityLog],
});
