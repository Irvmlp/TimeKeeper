import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import AllDailyActivities from './AllDailyActivities';
import AddDailyActivity from './AddDailyActivities';
import DailyLogs from './DailyLogs';

const Dashboard = () => {
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [editActivities, setEditActivities] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState([]);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const toggleAddActivity = () => {
    setShowAddActivity(!showAddActivity);
  };

  const toggleEditActivities = () => {
    setEditActivities(!editActivities);
  };

  const toggleSelectLog = (id) => {
    setSelectedLogs((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((logId) => logId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDelete = async () => {
    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");

    try {
      for (const id of selectedLogs) {
        await realm.deleteOne({ _id: id });
      }

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
      setSelectedLogs([]);
      setEditActivities(false);
    } catch (err) {
      console.error("Failed to delete log", err);
    }
  };

  const renderHeader = () => (
    <>
      <View style={styles.logsContainer}>
        <DailyLogs
          key={`log-${refresh}`}
          deleteMode={editActivities}
          selectedLogs={selectedLogs}
          toggleSelectLog={toggleSelectLog}
          handleDelete={handleDelete}
        />
      </View>
    </>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.DeleteButton} onPress={toggleEditActivities}>
          <Text style={styles.buttonText}>{editActivities ? "✓" : "Delete"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Addbutton} onPress={toggleAddActivity}>
          <Text style={styles.buttonText}>{showAddActivity ? "✓" : "Add"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.activityContainer}>
        {showAddActivity && <AddDailyActivity onAdd={handleRefresh} />}
        <View style={styles.activitiesContainer}>
          <AllDailyActivities
            key={refresh}
            editable={editActivities}
            onLogActivity={handleRefresh}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollContainer}
      />
      {renderFooter()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    padding: 0,
    paddingBottom: 150, // Space for the fixed bottom container
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  logsContainer: {
    marginBottom: 16,
  },
  footerContainer: {
    position: 'absolute',
    borderTopWidth: 0.4,
    borderTopColor: 'lightblue',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  activityContainer: {
    padding: 8,
  },
  activitiesContainer: {
    marginBottom: 30,
    marginHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  Addbutton: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: 'center',
    margin: 4,
    backgroundColor: '#087E8B',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  DeleteButton: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: 'center',
    margin: 4,
    backgroundColor: '#FF5A5F',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'bold',
  },
});

export default Dashboard;
