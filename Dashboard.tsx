import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import AllDailyActivities from './AllDailyActivities';
import AddDailyActivity from './AddDailyActivities';
import DailyLogs from './DailyLogs';

const Dashboard = () => {
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [editActivities, setEditActivities] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const toggleAddActivity = () => {
    setShowAddActivity(!showAddActivity);
  };

  const toggleEditActivities = () => {
    setEditActivities(!editActivities);
  };

  const handleAddComplete = () => {
    setShowAddActivity(false);
    handleRefresh();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Today App</Text>
       
       <View style={styles.VisualContainer}>

       </View>

        <View style={styles.logsContainer}>
          <DailyLogs key={`log-${refresh}`} />
        </View>
      </ScrollView>
      <View style={styles.activityContainer}>
        {showAddActivity && <AddDailyActivity onAdd={handleAddComplete} />}
        <View style={styles.activitiesContainer}>
          <AllDailyActivities key={refresh} editable={editActivities} onLogActivity={handleRefresh} />
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={toggleEditActivities}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleAddActivity}>
            <Text style={styles.buttonText}>{showAddActivity ? "Cancel" : "+"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  VisualContainer: {
    height: 300,
  },
  scrollContainer: {
    padding: 8,
    paddingBottom: 100, // Space for the fixed bottom container
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  logsContainer: {
    marginBottom: 16,
  },
  activityContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  activitiesContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Dashboard;
