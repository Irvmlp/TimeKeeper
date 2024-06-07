import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { RealmContext } from './RealmWrapper';
import styles from './AllDailyActivitiesStyles';

const AllDailyActivities = ({ editable, onLogActivity }) => {
  const { user, app } = useContext(RealmContext);
  const [dailyData, setDailyData] = useState([]);
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
  }, [user.id, app]);

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
      const objectId = new Realm.BSON.ObjectId(id);
      const logToDelete = await realm.findOne({ _id: objectId });

      if (logToDelete) {
        await realm.deleteOne({ _id: objectId });
        onLogActivity(); // Refresh the list in the parent component
      } else {
        console.error(`Log with id ${id} not found.`);
      }
    } catch (err) {
      console.error("Failed to delete data", err);
    }
  };

  const handleItemPress = (item) => {
    setSelectedActivity(item);
    setDuration(item.desiredDuration || 0);
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
            { $set: { duration: existingLog.duration + newLogDuration, isGood: selectedActivity.isGood, criticalness: selectedActivity.criticalness } }
          );

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
          isGood: selectedActivity.isGood,
          criticalness: selectedActivity.criticalness,
        };

        try {
          await realm.insertOne(newLog);

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

  const increaseDuration = () => setDuration((prev) => Math.min(prev + 0.25, 24));
  const decreaseDuration = () => setDuration((prev) => Math.max(prev - 0.25, 0));

  const formatElapsedTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{selectedActivity?.title}</Text>
      <Text style={styles.modalSubtitle}>Select Duration:</Text>
      <View style={styles.durationRow}>
        <TouchableOpacity style={styles.adjustButton} onPress={decreaseDuration}>
          <Text style={styles.adjustButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.durationText}>{duration.toFixed(2)} hours</Text>
        <TouchableOpacity style={styles.adjustButton} onPress={increaseDuration}>
          <Text style={styles.adjustButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Button title={`Log ${duration.toFixed(2)} hours`} onPress={handleLogActivity} />
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
      <View style={styles.ItemContainerMaster}>
      <FlatList
        data={dailyData}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
              </View>
              {editable && (
                <TouchableOpacity onPress={() => handleDelete(item._id.toString())}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
        )}
        numColumns={8} // Set the number of columns to 8
        showsVerticalScrollIndicator={true}
      />
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          {renderModalContent()}
        </View>
      </Modal>
      </View>
    </View>
  );
};

export default AllDailyActivities;
