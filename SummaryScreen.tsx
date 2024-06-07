import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { RealmContext } from './RealmWrapper';
import styles from './SummaryScreenStyles';
import { DailySummarySchema, ActivitySchema } from './models/DailySummary';
import { WeeklySummarySchema } from './models/WeeklySummary';
import { getStartOfWeek, getEndOfWeek, getWeekIdentifier } from './utils/dateUtils';

const SummaryScreen = () => {
  const { user, app } = useContext(RealmContext);
  const [dailySummary, setDailySummary] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('daily'); // 'daily' or 'weekly'

  const fetchDailySummary = async () => {
    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailySummary");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      let summary = await realm.findOne({ userId: user.id, date: today });

      if (!summary) {
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

  const fetchWeeklySummary = async () => {
    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("WeeklySummary");

    const today = new Date();
    const weekIdentifier = getWeekIdentifier(today);

    try {
      let weeklySummary = await realm.findOne({ userId: user.id, week: weekIdentifier });

      if (!weeklySummary) {
        const dailySummariesRealm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailySummary");
        const startOfWeek = getStartOfWeek(today);
        const endOfWeek = getEndOfWeek(today);
        const summaries = await dailySummariesRealm.find({ userId: user.id, date: { $gte: startOfWeek, $lte: endOfWeek } });

        if (summaries.length > 0) {
          const activityMap = {};
          let totalDays = summaries.length;

          summaries.forEach(summary => {
            summary.activities.forEach(activity => {
              if (!activityMap[activity.title]) {
                activityMap[activity.title] = { ...activity, totalDuration: 0, count: 0 };
              }
              activityMap[activity.title].totalDuration += activity.duration;
              activityMap[activity.title].count += 1;
            });
          });

          const aggregatedActivities = Object.keys(activityMap).map(title => ({
            title,
            totalDuration: activityMap[title].totalDuration,
            averageDuration: activityMap[title].totalDuration / totalDays,
            isGood: activityMap[title].isGood,
            criticalness: activityMap[title].criticalness,
          }));

          weeklySummary = {
            _id: new Realm.BSON.ObjectId(),
            userId: user.id,
            week: weekIdentifier,
            totalDuration: aggregatedActivities.reduce((sum, activity) => sum + activity.totalDuration, 0),
            activities: aggregatedActivities,
          };

          await realm.insertOne(weeklySummary);
        }
      }

      setWeeklySummary(weeklySummary);
    } catch (err) {
      console.error("Failed to fetch or generate weekly summary", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailySummary();
  }, [user.id, app]);

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'weekly' && !weeklySummary) {
      setLoading(true);
      fetchWeeklySummary();
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Daily" onPress={() => handleViewChange('daily')} />
        <Button title="Weekly" onPress={() => handleViewChange('weekly')} />
      </View>
      {view === 'daily' ? (
        dailySummary ? (
          <>
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
                  <Text style={styles.activityCriticalness}>{item.criticalness}</Text>
                </View>
              )}
            />
          </>
        ) : (
          <Text>No activities logged for today.</Text>
        )
      ) : (
        weeklySummary ? (
          <>
            <Text style={styles.title}>Weekly Summary</Text>
            <Text style={styles.totalDuration}>Total Duration: {weeklySummary.totalDuration.toFixed(2)} hrs</Text>
            <FlatList
              data={weeklySummary.activities}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <View style={styles.activityItem}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <View style={styles.activityTextContainer}>
                  <Text style={styles.activityDuration}> {item.averageDuration.toFixed(2)} Daily Avg</Text>
                    <Text style={styles.activityDuration}>{item.totalDuration.toFixed(2)}hrs Total</Text>
                    <Text style={styles.activityCriticalness}>{item.criticalness}</Text>
                  </View>
                </View>
              )}
              style={styles.activityList}
            />
          </>
        ) : (
          <Text>No activities logged for this week.</Text>
        )
      )}
    </View>
  );
};

export default SummaryScreen;
