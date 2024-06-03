import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { RealmContext } from './RealmWrapper';
import { DailyData } from './DailyData';

const AllDailyActivities = ({ editable }) => {
  const { user, app } = useContext(RealmContext);
  const [dailyData, setDailyData] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [refresh, setRefresh] = useState(false);

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
  }, [refresh, app]);

  const handleDelete = async (id) => {
    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailyEntries");

    try {
      await realm.deleteOne({ _id: id });
      setRefresh(!refresh); // Toggle refresh to re-fetch data
    } catch (err) {
      console.error("Failed to delete data", err);
    }
  };

  const handleItemPress = (id) => {
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  const renderDetails = (item) => (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailText}>Description: {item.description}</Text>
      <Text style={styles.detailText}>Duration: {item.duration} minutes</Text>
    </View>
  );

  return (
    <FlatList
      data={dailyData}
      keyExtractor={item => item._id.toString()}
      renderItem={({ item }) => (
        <View>
          <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item._id)}>
            <Text style={styles.itemText}>{item.title}</Text>
            {editable && (
              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          {selectedItemId === item._id && renderDetails(item)}
        </View>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default AllDailyActivities;
