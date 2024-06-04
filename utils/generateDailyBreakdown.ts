import { RealmContext } from '../RealmWrapper';
import { ActivityLog } from '../models/ActivityLog';
import { DailyBreakdown } from '../models/DailyBreakdown';

const generateDailyBreakdown = async () => {
  const { app } = useContext(RealmContext);
  const user = app.currentUser;

  const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");
  const breakdownCollection = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailyBreakdown");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  try {
    const logs = await realm.find({ userId: user.id, timestamp: { $gte: startOfDay } });
    const breakdown = logs.reduce((acc, log) => {
      const existing = acc.find(item => item.title === log.title);
      if (existing) {
        existing.duration += log.duration;
      } else {
        acc.push({ title: log.title, duration: log.duration });
      }
      return acc;
    }, []);

    const dailyBreakdown = {
      _id: new Realm.BSON.ObjectId(),
      userId: user.id,
      date: new Date(),
      breakdown,
    };

    await breakdownCollection.insertOne(dailyBreakdown);
    await realm.deleteMany({ userId: user.id, timestamp: { $gte: startOfDay } });

  } catch (err) {
    console.error("Failed to generate daily breakdown", err);
  }
};

export default generateDailyBreakdown;
