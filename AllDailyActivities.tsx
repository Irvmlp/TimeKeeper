import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { RealmContext } from './RealmWrapper';
import { DailyData } from './DailyData';
import { ActivityLog } from './ActivityLog';

const AllDailyActivities = ({ editable, onLogActivity }) => {
  const { user, app } = useContext(RealmContext);
  const [dailyData, setDailyData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailyEntries");

      try {
        const result = await realm.find({ userId: user.id });
        setDailyData(result);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, [refresh, app]);

  const handleDelete = async (id) => {
    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailyEntries");

    try {
      await realm.deleteOne({ _id: id });
      setRefresh(!refresh); // Toggle refresh to re-fetch data
    } catch (err) {
      console.error("Failed to delete data", err);
    }
  };

  const handleItemPress = async (item) => {
    if (onLogActivity) {
      const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");
      const newLog = {
        _id: new Realm.BSON.ObjectId(),
        userId: user.id,
        title: item.title,
        description: item.description,
        duration: item.duration,
        timestamp: new Date(),
      };

      try {
        await realm.insertOne(newLog);
        onLogActivity(); // Notify parent to refresh the logs list
      } catch (err) {
        console.error("Failed to log activity", err);
      }
    }
  };

  return (
    <FlatList
      data={dailyData}
      keyExtractor={item => item._id.toString()}
      renderItem={({ item }) => (
        <View>
          <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
            <Text style={styles.itemText}>{item.title}</Text>
            {editable && (
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
   
  },
  itemText: {
    fontSize: 16,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default AllDailyActivities;
