import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { RealmContext } from './RealmWrapper';
import { ActivityLog } from './ActivityLog';

const AllDailyActivities = ({ editable, onLogActivity }) => {
  const { user, app } = useContext(RealmContext);
  const [dailyData, setDailyData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [error, setError] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

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

  useEffect(() => {
    let timer;
    if (isTimerActive) {
      timer = setInterval(() => {
        setElapsedTime((new Date() - startTime) / 1000);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, startTime]);

  const handleDelete = async (id) => {
    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailyEntries");

    try {
      await realm.deleteOne({ _id: id });
      setRefresh(!refresh); // Toggle refresh to re-fetch data
    } catch (err) {
      console.error("Failed to delete data", err);
    }
  };

  const handleItemPress = (item) => {
    setSelectedActivity(item);
    setShowModal(true);
  };

  const handleLogActivity = async (duration) => {
    if (selectedActivity && onLogActivity) {
      const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");

      // Calculate the total logged time for the day
      const totalLoggedTime = (await realm.find({ userId: user.id, timestamp: { $gte: new Date().setHours(0, 0, 0, 0) } })).reduce((sum, entry) => sum + entry.duration, 0);
      const newLogDuration = duration;

      if (totalLoggedTime + newLogDuration > 24) {
        setError('Total logged time exceeds 24 hours');
        return;
      }

      const newLog = {
        _id: new Realm.BSON.ObjectId(),
        userId: user.id,
        title: selectedActivity.title,
        description: selectedActivity.description,
        duration: newLogDuration,
        timestamp: new Date(),
      };

      try {
        await realm.insertOne(newLog);
        onLogActivity(); // Notify parent to refresh the logs list
        setError('');
      } catch (err) {
        console.error("Failed to log activity", err);
      }
    }
    setShowModal(false);
  };

  const handleStartTimer = () => {
    setIsTimerActive(true);
    setStartTime(new Date());
  };

  const handleStopTimer = async () => {
    if (isTimerActive && startTime) {
      const endTime = new Date();
      const durationInMinutes = (endTime - startTime) / (1000 * 60);
      const durationInHours = durationInMinutes / 60;

      await handleLogActivity(durationInHours);

      setIsTimerActive(false);
      setStartTime(null);
    }
  };

  const formatElapsedTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text>Select Duration:</Text>
      <Button title={`Log ${selectedActivity?.duration || 0} hours`} onPress={() => handleLogActivity(selectedActivity.duration)} />
      {isTimerActive ? (
        <>
          <Text style={styles.timerText}>{formatElapsedTime(elapsedTime)}</Text>
          <Button title="Stop Timer" onPress={handleStopTimer} />
        </>
      ) : (
        <Button title="Start Timer" onPress={handleStartTimer} />
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  return (
    <View>
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
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          {renderModalContent()}
        </View>
      </Modal>
    </View>
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
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 12,
  },
});

export default AllDailyActivities;
