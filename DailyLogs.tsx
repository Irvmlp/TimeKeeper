import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Button, Dimensions, ScrollView, Alert } from 'react-native';
import { RealmContext } from './RealmWrapper';
import { BarChart } from 'react-native-chart-kit';
import styles from './DailyLogsStyles';

const screenWidth = Dimensions.get('window').width;

const DailyLogs = ({ deleteMode, sortOrder, setSortOrder }) => {
  const { user, app } = useContext(RealmContext);
  const [activityLogs, setActivityLogs] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [newDuration, setNewDuration] = useState('');
  const [timeFrame, setTimeFrame] = useState('day');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      try {
        const result = await realm.find({ userId: user.id, timestamp: { $gte: startOfDay } });
        setActivityLogs(result);
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
          setRefresh(!refresh);
        } catch (err) {
          console.error("Failed to initialize Unlogged Time log", err);
        }
      } else {
        try {
          await realm.updateOne(
            { _id: existingUnloggedTimeLog._id },
            { $set: { duration: unloggedTimeDuration } }
          );
          setRefresh(!refresh);
        } catch (err) {
          console.error("Failed to update Unlogged Time log", err);
        }
      }
    };

    initializeOrUpdateUnloggedTime();
  }, [app, user.id, activityLogs]);

  const handleDeleteLog = async (logId) => {
    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");

    try {
      await realm.deleteOne({ _id: logId });

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

    // Calculate new total logged time excluding the old duration of the editing log
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

      // Update Unlogged Time
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

  const sortLogs = (logs, order) => {
    if (order === 'chronological') {
      return logs;
    } else if (order === 'duration') {
      return logs.sort((a, b) => b.duration - a.duration);
    } else if (order === 'goodBad') {
      const goodLogs = logs.filter(log => log.isGood).sort((a, b) => b.duration - a.duration);
      const badLogs = logs.filter(log => !log.isGood).sort((a, b) => b.duration - a.duration);
      return [...goodLogs, ...badLogs];
    }
  };

  const sortedLogs = sortLogs([...activityLogs], sortOrder);

  const getStartDate = (timeFrame) => {
    const now = new Date();
    let startDate;

    switch (timeFrame) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        const firstDayOfWeek = now.getDate() - now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case '5years':
        startDate = new Date(now.getFullYear() - 5, 0, 1);
        break;
      default:
        startDate = new Date(0);
    }

    return startDate;
  };

  const filterLogs = (logs, timeFrame) => {
    const startDate = getStartDate(timeFrame);
    return logs.filter(log => new Date(log.timestamp) >= startDate);
  };

  const calculateAverages = (logs) => {
    const aggregatedLogs = {};
    logs.forEach(log => {
      if (aggregatedLogs[log.title]) {
        aggregatedLogs[log.title].duration += log.duration;
        aggregatedLogs[log.title].count += 1;
      } else {
        aggregatedLogs[log.title] = { duration: log.duration, count: 1 };
      }
    });

    return Object.keys(aggregatedLogs).map(title => ({
      title,
      duration: aggregatedLogs[title].duration / aggregatedLogs[title].count
    }));
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

  const getTimeFrameLabel = (timeFrame) => {
    switch (timeFrame) {
      case 'day': return 'Day';
      case 'week': return '1W';
      case 'month': return '1M';
      case '3months': return '3M';
      case '6months': return '6M';
      case 'year': return '1YR';
      case '5years': return '5YRS';
      default: return 'All';
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setDeleteMode(false);
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setEditMode(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.timeFrameButtons}>
        {['day', 'week', 'month', '3months', '6months', 'year', '5years', 'all'].map((tf) => (
          <TouchableOpacity 
            key={tf} 
            onPress={() => setTimeFrame(tf)} 
            style={[styles.timeFrameButton, timeFrame === tf && styles.selectedTimeFrameButton]}
          >
            <Text style={styles.timeFrameButtonText}>{getTimeFrameLabel(tf)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <BarChart
        data={chartData}
        width={screenWidth - 26}
        height={220}
        yAxisSuffix=" hrs"
        yAxisInterval={.5}
        chartConfig={{
          barPercentage: .3,
          backgroundColor:"#white",
          backgroundGradientFrom: "white",
          backgroundGradientTo: "white",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(55, 81, 95, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 3,
          },
          propsForDots: {
            r: "2",
            strokeWidth: ".5",
            stroke: "black"
          },
          propsForBackgroundLines: {
            stroke: "white",
          },
          propsForLabels: {
            fontSize: "14",
            fontWeight: 500,
            padding: 2,
        },
        }}
        style={{
          borderRadius: 4,
          marginTop: -10,
        }}
        fromZero={true}
      />
      <View style={styles.controlButtons}>
        <TouchableOpacity 
          style={[
            styles.sortButton, 
            sortOrder === 'chronological' && styles.selectedButton
          ]} 
          onPress={() => setSortOrder('chronological')}
        >
          <Text style={styles.buttonText}>Chronological</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.sortButton, 
            sortOrder === 'duration' && styles.selectedButton
          ]} 
          onPress={() => setSortOrder('duration')}
        >
          <Text style={styles.buttonText}>By Duration</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.sortButton, 
            sortOrder === 'goodBad' && styles.selectedButton
          ]} 
          onPress={() => setSortOrder('goodBad')}
        >
          <Text style={styles.buttonText}>Good/Bad</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.deleteToggle, 
            deleteMode && styles.selectedButton
          ]} 
          onPress={toggleDeleteMode}
        >
          <Text style={styles.deleteToggleText}>{deleteMode ? 'Confirm Delete' : 'Delete Logs'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedLogs}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              item.title === "🕒" ? styles.unloggedTimeItem : item.isGood ? styles.goodItem : styles.badItem,
              deleteMode && styles.selectedItem
            ]}
            onPress={() => deleteMode ? handleDeleteLog(item._id) : handleEdit(item)}
          >
            <View style={styles.itemContent}>
              <Text style={styles.itemEmoji}>{item.title}</Text>
              <Text style={styles.itemText2}> | {item.description}</Text>
              <Text style={styles.itemText2}> | {item.duration} hrs</Text>
              <Text style={styles.itemText2}> | {'!'.repeat(item.criticalness)}</Text>
            </View>
            {deleteMode && (
              <TouchableOpacity onPress={() => handleDeleteLog(item._id)}>
                <Text style={styles.deleteCheck}>✓</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
      {editingLog && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Edit Duration</Text>
              <TextInput
                style={styles.input}
                placeholder="Duration"
                value={newDuration}
                onChangeText={setNewDuration}
                keyboardType="numeric"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Button title="Save" onPress={handleSaveEdit} />
              <Button title="Cancel" onPress={handleCancelEdit} />
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

export default DailyLogs;
