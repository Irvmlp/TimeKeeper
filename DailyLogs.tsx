import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { RealmContext } from './RealmWrapper';
import styles from './DailyLogsStyles';
import { Chart, sortLogs, filterLogs, calculateAverages } from './dailyLogsHelpers';
import EditLogModal from './EditLogModal';
import SortButtons from './SortButtons';
import ActivityList from './ActivityList';

const DailyLogs = ({ deleteMode, setDeleteMode, sortOrder, setSortOrder }) => {
  const { user, app } = useContext(RealmContext);
  const [activityLogs, setActivityLogs] = useState([]);
  const [freeTimeLog, setFreeTimeLog] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [newDuration, setNewDuration] = useState('');
  const [timeFrame, setTimeFrame] = useState('day');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [unloggedTimeInitialized, setUnloggedTimeInitialized] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      try {
        const result = await realm.find({ userId: user.id, timestamp: { $gte: startOfDay } });
        const freeTime = result.find(log => log.title === "🕒");
        setFreeTimeLog(freeTime);
        setActivityLogs(result.filter(log => log.title !== "🕒"));
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchLogs();
  }, [refresh, app]);

  useEffect(() => {
    const initializeOrUpdateUnloggedTime = async () => {
      const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const existingUnloggedTimeLog = await realm.findOne({
        userId: user.id,
        timestamp: { $gte: startOfDay },
        title: "🕒"
      });

      const totalLoggedTime = await realm.aggregate([
        { $match: { userId: user.id, timestamp: { $gte: startOfDay }, title: { $ne: "🕒" } } },
        { $group: { _id: null, total: { $sum: "$duration" } } }
      ]);

      const loggedTime = totalLoggedTime.length ? totalLoggedTime[0].total : 0;
      const unloggedTimeDuration = 24 - loggedTime;

      if (!existingUnloggedTimeLog) {
        const unloggedTimeLog = {
          _id: new Realm.BSON.ObjectId(),
          userId: user.id,
          title: "🕒",
          description: "Free Time",
          duration: unloggedTimeDuration,
          timestamp: new Date(),
        };

        try {
          await realm.insertOne(unloggedTimeLog);
          setFreeTimeLog(unloggedTimeLog);
        } catch (err) {
          console.error("Failed to initialize Unlogged Time log", err);
        }
      } else {
        try {
          await realm.updateOne(
            { _id: existingUnloggedTimeLog._id },
            { $set: { duration: unloggedTimeDuration } }
          );
          setFreeTimeLog(existingUnloggedTimeLog);
        } catch (err) {
          console.error("Failed to update Unlogged Time log", err);
        }
      }

      setUnloggedTimeInitialized(true);
    };

    if (!unloggedTimeInitialized) {
      initializeOrUpdateUnloggedTime();
    }
  }, [app, user.id, activityLogs, unloggedTimeInitialized]);

  const handleDeleteLog = async (logId) => {
    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");

    try {
      await realm.deleteOne({ _id: logId });

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
        setFreeTimeLog(unloggedTimeLog);
      }

      setRefresh(!refresh);
      Alert.alert("Success", "Log successfully deleted.");
    } catch (err) {
      console.error("Failed to delete log", err);
    }
  };

  const handleEdit = (item) => {
    setEditingLog(item);
    setNewDuration(item.duration.toString());
    setError('');
  };

  const handleSaveEdit = async () => {
    const duration = parseInt(newDuration, 10);
    if (isNaN(duration) || duration < 0 || duration > 12) {
      alert('Duration must be between 0 and 12 hours.');
      return;
    }

    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");

    const totalLoggedTime = (await realm.aggregate([
      { $match: { userId: user.id, timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }, title: { $ne: "🕒" } } },
      { $group: { _id: null, total: { $sum: "$duration" } } }
    ])).reduce((sum, log) => sum + log.total, 0) - editingLog.duration + duration;

    if (totalLoggedTime > 24) {
      setError('Total logged time exceeds 24 hours.');
      return;
    }

    try {
      await realm.updateOne(
        { _id: editingLog._id },
        { $set: { duration: duration } }
      );

      const unloggedTimeLog = await realm.findOne({
        userId: user.id,
        timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        title: "🕒"
      });

      if (unloggedTimeLog) {
        const updatedUnloggedTimeDuration = 24 - totalLoggedTime;
        await realm.updateOne(
          { _id: unloggedTimeLog._id },
          { $set: { duration: updatedUnloggedTimeDuration } }
        );
        setFreeTimeLog(unloggedTimeLog);
      }

      setEditingLog(null);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Failed to update log", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingLog(null);
    setNewDuration('');
  };

  const filteredLogs = filterLogs(activityLogs, timeFrame);
  const averageLogs = calculateAverages(filteredLogs);

  const chartData = {
    labels: averageLogs.map(log => log.title),
    datasets: [
      {
        data: averageLogs.map(log => log.duration)
      }
    ]
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setEditMode(false);
  };

  const goodLogs = activityLogs.filter(log => log.isGood);
  const badLogs = activityLogs.filter(log => !log.isGood);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Chart chartData={chartData} />
      <SortButtons
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        deleteMode={deleteMode}
        toggleDeleteMode={toggleDeleteMode}
      />
      {freeTimeLog && (
        <View style={[styles.item, styles.unloggedTimeItem]}>
          <View style={styles.itemContent}>
            <Text style={styles.itemEmoji}>{freeTimeLog.title}</Text>
            <Text style={styles.itemText2}>{freeTimeLog.description}</Text>
            <Text style={styles.itemText2}>{freeTimeLog.duration} hrs</Text>
          </View>
        </View>
      )}
      {sortOrder === 'goodBad' ? (
        <View style={styles.goodBadContainer}>
          <View style={styles.goodBadColumn}>
            {goodLogs.map(log => (
              <View key={log._id} style={styles.goodBadItem}>
                <Text style={styles.goodBadTitle}>{log.title}</Text>
                <Text style={styles.goodBadDescription}>{log.description}</Text>
              </View>
            ))}
          </View>
          <View style={styles.goodBadColumn}>
            {badLogs.map(log => (
              <View key={log._id} style={styles.goodBadItem}>
                <Text style={styles.goodBadTitle}>{log.title}</Text>
                <Text style={styles.goodBadDescription}>{log.description}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <ActivityList
          activityLogs={sortLogs([...activityLogs], sortOrder)}
          sortOrder={sortOrder}
          handleDeleteLog={handleDeleteLog}
          handleEdit={handleEdit}
          deleteMode={deleteMode}
        />
      )}
      <EditLogModal
        visible={!!editingLog}
        log={editingLog}
        newDuration={newDuration}
        setNewDuration={setNewDuration}
        error={error}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
      />
    </ScrollView>
  );
};

export default DailyLogs;
