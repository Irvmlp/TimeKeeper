import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import { RealmContext } from './RealmWrapper';

const DailyLogs = () => {
  const { user, app } = useContext(RealmContext);
  const [activityLogs, setActivityLogs] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [newDuration, setNewDuration] = useState('');

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
    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("ActivityLog");

    try {
      await realm.updateOne(
        { _id: editingLog._id },
        { $set: { duration: parseInt(newDuration, 10) } }
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

  return (
    <FlatList
      data={activityLogs}
      keyExtractor={item => item._id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text style={styles.itemText}>{item.title}</Text>
            <Text style={styles.itemText}>{item.description}</Text>
            <Text style={styles.itemText}>{item.duration} minutes</Text>
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
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: 300,
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
});

export default DailyLogs;
