import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { RealmContext } from './RealmWrapper';
import AllDailyActivities from './AllDailyActivities';
import AddDailyActivity from './AddDailyActivities';
import DailyLogs from './DailyLogs';
import { fetchData } from './apiService';

const Dashboard = () => {
  const { user } = useContext(RealmContext);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [editActivities, setEditActivities] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [sortOrder, setSortOrder] = useState('chronological');
  const [deleteMode, setDeleteMode] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const getData = async () => {
        try {
          const result = await fetchData(user.id);
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      getData();
    }
  }, [user]);

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
    <View style={styles.logsContainer}>
      <DailyLogs
        key={`log-${refresh}`}
        deleteMode={deleteMode}
        setDeleteMode={setDeleteMode}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
    
    <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.DeleteButton} onPress={toggleEditActivities}>
          <Text style={styles.buttonText}>{editActivities ? "✓" : "-"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.AddButton} onPress={toggleAddActivity}>
          <Text style={styles.buttonText}>{showAddActivity ? "✓" : "+"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.activityContainer}>
      {showAddActivity && <AddDailyActivity onAdd={handleRefresh} />}
      <View style={styles.activitiesContainer}>
        <AllDailyActivities
          key={`${refresh}-${editActivities}`} // Changing the key to force re-render
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
    paddingHorizontal: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 0,
    justifyContent: 'center',
    paddingBottom: 150,
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
    borderTopColor: 'white',
    bottom: 19,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  activityContainer: {
    padding: 4,
  },
  activitiesContainer: {
    marginBottom: 14,
    marginHorizontal: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
  },
  AddButton: {
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
    backgroundColor: 'white',
    borderColor: '#E0E4ED',
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
    backgroundColor: 'white',
    borderColor: '#E0E4ED',
  },
  buttonText: {
    color: '#291F58',
    fontSize: 16,
    fontFamily: 'bold',
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  sortButton: {
    marginHorizontal: 4,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
});

export default Dashboard;


