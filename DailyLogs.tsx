// DailyLogs.tsx
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal, Button, Dimensions, ScrollView } from 'react-native';
import { RealmContext } from './RealmWrapper';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const DailyLogs = () => {
  const { user, app } = useContext(RealmContext);
  const [activityLogs, setActivityLogs] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [newDuration, setNewDuration] = useState('');
  const [timeFrame, setTimeFrame] = useState('day');

  useEffect(() => {
    const fetchLogs = async () => {
      const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");

      try {
        const result = await realm.find({ userId: user.id });
        setActivityLogs(result);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchLogs();
  }, [refresh, app]);

  const handleDelete = async (id) => {
    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");

    try {
      await realm.deleteOne({ _id: id });
      setRefresh(!refresh); // Toggle refresh to re-fetch data
    } catch (err) {
      console.error("Failed to delete log", err);
    }
  };

  const handleEdit = (item) => {
    setEditingLog(item);
    setNewDuration(item.duration.toString());
  };

  const handleSaveEdit = async () => {
    const duration = parseInt(newDuration, 10);
    if (isNaN(duration) || duration < 0 || duration > 12) {
      alert('Duration must be between 0 and 12 hours.');
      return;
    }

    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");

    try {
      await realm.updateOne(
        { _id: editingLog._id },
        { $set: { duration: duration } }
      );
      setEditingLog(null);
      setRefresh(!refresh); // Toggle refresh to re-fetch data
    } catch (err) {
      console.error("Failed to update log", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingLog(null);
    setNewDuration('');
  };

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
      case 'day':
        return 'Day';
      case 'week':
        return '1W';
      case 'month':
        return '1M';
      case '3months':
        return '3M';
      case '6months':
        return '6M';
      case 'year':
        return '1YR';
      case '5years':
        return '5YRS';
      default:
        return 'All';
    }
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
        width={screenWidth - 16} // from react-native
        height={220}
        yAxisLabel=""
        yAxisSuffix=" hrs"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "white",
          backgroundGradientFrom: "gray",
          backgroundGradientTo: "gray",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          }
        }}
        style={{
          borderRadius: 4,
          marginTop: -10,
        }}
        fromZero={true}
      />
      <FlatList
        data={activityLogs}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemContent}>
              <Text style={styles.itemText}>{item.title}</Text>
              <Text style={styles.itemText}>{item.description}</Text>
              <Text style={styles.itemText}>{item.duration} hrs</Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
            {editingLog && editingLog._id === item._id && (
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
                    <Button title="Save" onPress={handleSaveEdit} />
                    <Button title="Cancel" onPress={handleCancelEdit} />
                  </View>
                </View>
              </Modal>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  chartTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
  },
  timeFrameButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timeFrameButton: {
    margin: 4,
    padding: 8,
    color: 'black',
    borderRadius: 5,
  },
  timeFrameButtonText: {
    color: '#000',
    fontSize: 14,
  },
  selectedTimeFrame: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: screenWidth - 32,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  itemContent: {
    flex: 1,
    gap: 6, 
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 16,
  },
  editButton: {
    color: 'blue',
    fontWeight: 'bold',
    marginRight: 8,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
  selectedTimeFrameButton: {
    backgroundColor: 'grey',
  }
});

export default DailyLogs;
