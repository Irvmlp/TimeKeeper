// frontend/SummaryScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RealmContext } from './RealmWrapper';
import { getFromCache, setToCache } from './cache';
import Realm from 'realm';

const SummaryScreen = () => {
  const { user, app } = useContext(RealmContext);
  const [summaryData, setSummaryData] = useState([]);

  const fetchSummary = async (forceRefresh = false) => {
    if (user) {
      const cacheKey = `summary-${user.id}`;

      if (!forceRefresh) {
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
          setSummaryData(cachedData);
          return;
        }
      }

      console.log("Fetching summaries for user ID:", user.id);
      try {
        const collection = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailySummary");
        const result = await collection.find({ userId: user.id });
        console.log("Summaries fetched: ", JSON.stringify(result, null, 2));
        setSummaryData(result);
        setToCache(cacheKey, result); // Cache the data
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
        await fetchSummary(true); // Fetch the summaries again to reflect the newly inserted entry
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
        await fetchSummary(true); // Fetch the summaries again to reflect the deletions
      } catch (err) {
        console.error('Failed to delete entries', err);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Summary</Text>
      <Text style={styles.headerText}>24H</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.insertButton} onPress={insertExampleEntry}>
          <Text style={styles.buttonText}>Insert Example Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllEntries}>
          <Text style={styles.buttonText}>Delete All Entries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.refreshButton} onPress={() => fetchSummary(true)}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
     
      {summaryData.length > 0 ? (
        summaryData.map((data, index) => (
          <View key={index} style={styles.summaryContainer}>
            <Text style={styles.summaryDate}>{new Date(data.date).toDateString()}</Text>
            <Text style={styles.totalDuration}>Total Duration: {data.totalDuration} hours</Text>
            {data.activities.map((activity, idx) => (
              <View key={idx} style={styles.activityContainer}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDuration}>{activity.duration} hours</Text>
                <Text style={styles.activityIsGood}>Good: {activity.isGood ? 'Yes' : 'No'}</Text>
                <Text style={styles.activityCriticalness}>{activity.criticalness}</Text>
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
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  insertButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteAllButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  refreshButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    width: '90%',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  summaryDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalDuration: {
    fontSize: 16,
    marginBottom: 10,
  },
  activityContainer: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityText: {
    fontSize: 14,
  },
  noDataText: {
    fontSize: 18,
    color: 'red',
  },
});

export default SummaryScreen;
