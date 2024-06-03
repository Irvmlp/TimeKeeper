// utils.ts
import { BSON } from 'realm';

export const computeAverageDurations = async (realm: any, userId: string, period: string) => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'threeMonths':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    case 'fiveYears':
      startDate = new Date(now.setFullYear(now.getFullYear() - 5));
      break;
    default:
      startDate = new Date(0); // All time
  }

  const pipeline = [
    { $match: { userId, timestamp: { $gte: startDate } } },
    { $group: { _id: "$title", averageDuration: { $avg: "$duration" } } }
  ];

  const results = await realm.aggregate('ActivityLog', pipeline);
  return results;
};
