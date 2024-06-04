import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
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

  const renderHeader = () => (
    <>
      <View style={styles.logsContainer}>
        <DailyLogs key={`log-${refresh}`} />
      </View>
    </>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.activityContainer}>
        {showAddActivity && <AddDailyActivity onAdd={handleRefresh} />}
        <View style={styles.activitiesContainer}>
          <AllDailyActivities key={refresh} editable={editActivities} onLogActivity={handleRefresh} />
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.DeleteButton} onPress={toggleEditActivities}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Addbutton} onPress={toggleAddActivity}>
            <Text style={styles.buttonText}>{showAddActivity ? "Cancel" : "+"}</Text>
          </TouchableOpacity>
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
    backgroundColor: 'lightyellow',
    bottom: 0,
    left: 0,
    right: 0,
  },
  activityContainer: {
    padding: 8,
  },
  activitiesContainer: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  DeleteButton: {
    alignItems: 'center',
    width: 55,
    height: 55,
    padding: 12,
    margin: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderBottomLeftRadius: 30,
  },
  Addbutton: {
    alignItems: 'center',
    width: 55,
    height: 55,
    padding: 12,
    margin: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default Dashboard;