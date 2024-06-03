import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AllDailyActivities from './AllDailyActivities';
import AddDailyActivity from './AddDailyActivities';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.buttonRow}>
        
        <TouchableOpacity style={styles.button} onPress={toggleAddActivity}>
          <Text style={styles.buttonText}>{showAddActivity ? "Cancel" : "+"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleEditActivities}>
          <Text style={styles.buttonText}>Edit Activities</Text>
        </TouchableOpacity>
      </View>
      {showAddActivity && <AddDailyActivity onAdd={handleRefresh} />}
      <AllDailyActivities key={refresh} editable={editActivities} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
