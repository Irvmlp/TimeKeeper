import React, { useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import AllDailyActivities from './AllDailyActivities';
import AddDailyActivity from './AddDailyActivities';

const Dashboard = () => {
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const toggleAddActivity = () => {
    setShowAddActivity(!showAddActivity);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Button title={showAddActivity ? "Cancel" : "Add Activity"} onPress={toggleAddActivity} />
      {showAddActivity && <AddDailyActivity onAdd={handleRefresh} />}
      <AllDailyActivities key={refresh} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default Dashboard;
