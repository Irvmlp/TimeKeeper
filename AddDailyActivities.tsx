import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { RealmContext } from './RealmWrapper';

const AddDailyActivity = ({ onAdd }) => {
  const { user, app } = useContext(RealmContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');

  const handleAddData = async () => {
    if (!title || !description || !duration) return;

    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailyEntries");

    // Calculate the total logged time for the day
    const totalLoggedTime = (await realm.find({ userId: user.id, timestamp: { $gte: new Date().setHours(0, 0, 0, 0) } })).reduce((sum, entry) => sum + entry.duration, 0);
    const newEntryDuration = parseInt(duration, 10);

    if (totalLoggedTime + newEntryDuration > 24) {
      setError('Total logged time exceeds 24 hours');
      return;
    }

    const newData = {
      _id: new Realm.BSON.ObjectId(),
      userId: user.id,
      title,
      description,
      duration: newEntryDuration,
      timestamp: new Date(),
    };

    try {
      await realm.insertOne(newData);
      onAdd(); // Notify parent to refresh the list and close the add data form
      setTitle('');
      setDescription('');
      setDuration('');
      setError('');
    } catch (err) {
      console.error("Failed to add data", err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (in hours)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Add Data" onPress={handleAddData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});

export default AddDailyActivity;
