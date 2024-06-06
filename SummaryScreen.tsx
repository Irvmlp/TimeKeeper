// SummaryScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { RealmContext } from './RealmWrapper';
import Realm from 'realm';

const SummaryScreen = () => {
  const { user, app } = useContext(RealmContext);
  const [summaryData, setSummaryData] = useState([]);

  const fetchSummary = async () => {
    if (user) {
      console.log("Fetching summaries for user ID:", user.id);
      try {
        const collection = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailySummary");
        const result = await collection.find({ userId: user.id });
        console.log("Summaries fetched: ", JSON.stringify(result, null, 2));
        setSummaryData(result);
      } catch (err) {
        console.error('Failed to fetch summary data', err);
      }
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [user, app]);

  const insertExampleEntry = async () => {
    if (user) {
      try {
        const collection = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailySummary");

        const exampleEntry = {
          _id: new Realm.BSON.ObjectId(),
          userId: user.id,
          date: new Date(),
          totalDuration: 8.5,
          activities: [
            {
              title: 'Coding',
              duration: 5.0,
              isGood: true,
              criticalness: 3,
            },
            {
              title: 'Meeting',
              duration: 1.5,
              isGood: false,
              criticalness: 2,
            },
            {
              title: 'Exercise',
              duration: 2.0,
              isGood: true,
              criticalness: 1,
            },
          ],
        };

        await collection.insertOne(exampleEntry);
        await fetchSummary(); // Fetch the summaries again to reflect the newly inserted entry
      } catch (err) {
        console.error('Failed to insert example entry', err);
      }
    }
  };

  const deleteAllEntries = async () => {
    if (user) {
      try {
        const collection = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailySummary");
        await collection.deleteMany({ userId: user.id });
        await fetchSummary(); // Fetch the summaries again to reflect the deletions
      } catch (err) {
        console.error('Failed to delete entries', err);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>This is the Summary Screen</Text>
      <Button title="Insert Example Entry" onPress={insertExampleEntry} />
      <Button title="Delete All Entries" onPress={deleteAllEntries} />
      {summaryData.length > 0 ? (
        summaryData.map((data, index) => (
          <View key={index} style={styles.summaryContainer}>
            <Text style={styles.summaryDate}>{new Date(data.date).toDateString()}</Text>
            <Text style={styles.totalDuration}>Total Duration: {data.totalDuration} hours</Text>
            {data.activities.map((activity, idx) => (
              <View key={idx} style={styles.activityContainer}>
                <Text style={styles.activityTitle}>Activity: {activity.title}</Text>
                <Text style={styles.activityDuration}>Duration: {activity.duration} hours</Text>
                <Text style={styles.activityIsGood}>Good: {activity.isGood ? 'Yes' : 'No'}</Text>
                <Text style={styles.activityCriticalness}>Criticalness: {activity.criticalness}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No summary data available for today.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '90%',
  },
  summaryDate: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalDuration: {
    fontSize: 16,
  },
  activityContainer: {
    marginTop: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityDuration: {
    fontSize: 14,
  },
  activityIsGood: {
    fontSize: 14,
  },
  activityCriticalness: {
    fontSize: 14,
  },
  noDataText: {
    fontSize: 18,
    color: 'red',
  },
});

export default SummaryScreen;
