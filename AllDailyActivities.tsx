import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RealmContext } from './RealmWrapper';
import { DailyData } from './DailyData';

const AllDailyActivities = () => {
  const { user, app } = useContext(RealmContext);
  const [dailyData, setDailyData] = useState([]);
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

  return (
    <FlatList
      data={dailyData}
      keyExtractor={item => item._id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{`${item.title}`}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default AllDailyActivities;
