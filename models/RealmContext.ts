// RealmWrapper.ts
import { createRealmContext } from '@realm/react';
import { DailyData } from './DailyData';
import { ActivityLog } from './ActivityLog';
import { DailySummarySchema, ActivitySchema } from './DailySummary';

export const RealmContext = createRealmContext({
  schema: [DailyData, ActivityLog, DailySummarySchema, ActivitySchema],
});
