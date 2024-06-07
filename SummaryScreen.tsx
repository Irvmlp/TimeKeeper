import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { RealmContext } from './RealmWrapper';
import styles from './SummaryScreenStyles';
import { DailySummarySchema, ActivitySchema } from './models/DailySummary';

const SummaryScreen = () => {
  const { user, app } = useContext(RealmContext);
  const [dailySummary, setDailySummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailySummary = async () => {
      const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailySummary");

      // Get today's date at the start of the day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
        // Check if a DailySummary for today already exists
        let summary = await realm.findOne({ userId: user.id, date: today });

        if (!summary) {
          // If not, generate the DailySummary from the ActivityLog collection
          const activityLogRealm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");
          const activities = await activityLogRealm.find({ userId: user.id, timestamp: { $gte: today } });

          if (activities.length > 0) {
            const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);

            summary = {
              _id: new Realm.BSON.ObjectId(),
              userId: user.id,
              date: today,
              totalDuration,
              activities: activities.map(activity => ({
                title: activity.title,
                duration: activity.duration,
                isGood: activity.isGood,
                criticalness: activity.criticalness,
              })),
            };

            await realm.insertOne(summary);
          }
        }

        setDailySummary(summary);
      } catch (err) {
        console.error("Failed to fetch or generate daily summary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDailySummary();
  }, [user.id, app]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!dailySummary) {
    return (
      <View style={styles.container}>
        <Text>No activities logged for today.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Summary</Text>
      <Text style={styles.totalDuration}>Total Duration: {dailySummary.totalDuration.toFixed(2)} hrs</Text>
      <FlatList
        data={dailySummary.activities}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDuration}>{item.duration.toFixed(2)} hrs</Text>
            <Text style={styles.activityIsGood}>{item.isGood ? 'Good' : 'Bad'}</Text>
            <Text style={styles.activityCriticalness}>Criticalness: {item.criticalness}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default SummaryScreen;
