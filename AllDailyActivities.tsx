import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { RealmContext } from './RealmWrapper';
import { ActivityLog } from './ActivityLog';

const AllDailyActivities = ({ editable, onLogActivity }) => {
  const { user, app } = useContext(RealmContext);
  const [dailyData, setDailyData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [duration, setDuration] = useState(0);
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
    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");

    try {
      const logToDelete = await realm.findOne({ _id: id });

      await realm.deleteOne({ _id: id });

      // Update Unlogged Time
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const totalLoggedTime = (await realm.aggregate([
        { $match: { userId: user.id, timestamp: { $gte: startOfDay }, title: { $ne: "🕒" } } },
        { $group: { _id: null, total: { $sum: "$duration" } } }
      ])).reduce((sum, log) => sum + log.total, 0);

      const unloggedTimeLog = await realm.findOne({
        userId: user.id,
        timestamp: { $gte: startOfDay },
        title: "🕒"
      });

      if (unloggedTimeLog) {
        const updatedUnloggedTimeDuration = 24 - totalLoggedTime;
        await realm.updateOne(
          { _id: unloggedTimeLog._id },
          { $set: { duration: updatedUnloggedTimeDuration } }
        );
      }

      setRefresh(!refresh);
    } catch (err) {
      console.error("Failed to delete data", err);
    }
  };

  const handleItemPress = (item) => {
    setSelectedActivity(item);
    setDuration(item.desiredDuration || 0); // Set duration to desired duration
    setShowModal(true);
  };

  const handleLogActivity = async () => {
    if (selectedActivity && onLogActivity) {
      const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const existingLog = await realm.findOne({
        userId: user.id,
        title: selectedActivity.title,
        timestamp: { $gte: startOfDay }
      });

      const totalLoggedTime = (await realm.find({ userId: user.id, timestamp: { $gte: startOfDay }, title: { $ne: "🕒" } })).reduce((sum, entry) => sum + entry.duration, 0);
      const newLogDuration = duration;

      if (totalLoggedTime + newLogDuration > 24) {
        setError('Total logged time exceeds 24 hours');
        return;
      }

      if (existingLog) {
        try {
          await realm.updateOne(
            { _id: existingLog._id },
            { $set: { duration: existingLog.duration + newLogDuration } }
          );

          // Update Unlogged Time
          const unloggedTimeLog = await realm.findOne({
            userId: user.id,
            timestamp: { $gte: startOfDay },
            title: "🕒"
          });

          if (unloggedTimeLog) {
            const updatedUnloggedTimeDuration = 24 - (totalLoggedTime + newLogDuration);
            await realm.updateOne(
              { _id: unloggedTimeLog._id },
              { $set: { duration: updatedUnloggedTimeDuration } }
            );
          }

          onLogActivity();
          setError('');
        } catch (err) {
          console.error("Failed to update activity log", err);
        }
      } else {
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

          // Update Unlogged Time
          const unloggedTimeLog = await realm.findOne({
            userId: user.id,
            timestamp: { $gte: startOfDay },
            title: "🕒"
          });

          if (unloggedTimeLog) {
            const updatedUnloggedTimeDuration = 24 - (totalLoggedTime + newLogDuration);
            await realm.updateOne(
              { _id: unloggedTimeLog._id },
              { $set: { duration: updatedUnloggedTimeDuration } }
            );
          }

          onLogActivity();
          setError('');
        } catch (err) {
          console.error("Failed to log activity", err);
        }
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

      setDuration(durationInHours);
      setIsTimerActive(false);
      setStartTime(null);
    }
  };

  const increaseDuration = () => setDuration((prev) => Math.min(prev + 0.5, 24));
  const decreaseDuration = () => setDuration((prev) => Math.max(prev - 0.5, 0));

  const formatElapsedTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Duration:</Text>
      <View style={styles.durationRow}>
        <Button title="-" onPress={decreaseDuration} />
        <Text style={styles.durationText}>{duration.toFixed(1)} hours</Text>
        <Button title="+" onPress={increaseDuration} />
      </View>
      <Button title={`Log ${duration.toFixed(1)} hours`} onPress={handleLogActivity} />
      {isTimerActive ? (
        <>
          <Text style={styles.timerText}>{formatElapsedTime(elapsedTime)}</Text>
          <Button title="Stop Timer" onPress={handleStopTimer} />
        </>
      ) : (
        <Button title="Start Timer" onPress={handleStartTimer} />
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Cancel" onPress={() => setShowModal(false)} />
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
        showsHorizontalScrollIndicator={true}
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
    padding: 12,
    margin: 4,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  durationText: {
    fontSize: 18,
    marginHorizontal: 20,
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
