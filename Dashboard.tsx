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
      <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.DeleteButton} onPress={toggleEditActivities}>
            <Text style={styles.buttonText}>Delete</Text>
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
            onDelete={handleRefresh} // Added onDelete prop
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'bold',
  },
});

export default Dashboard;
