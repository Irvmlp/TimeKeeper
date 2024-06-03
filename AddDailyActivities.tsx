import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { RealmContext } from './RealmWrapper';
import { DailyData } from './DailyData';

const AddDailyActivity = ({ onAdd }) => {
  const { user, app } = useContext(RealmContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  const handleAddData = async () => {
    if (!title || !description || !duration) return;

    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailyEntries");
    const newData = {
      _id: new Realm.BSON.ObjectId(),
      userId: user.id,
      title,
      description,
      duration: parseInt(duration, 10),
      timestamp: new Date(),
    };

    try {
      await realm.insertOne(newData);
      onAdd(); // Notify parent to refresh the list
    } catch (err) {
      console.error("Failed to add data", err);
    }

    setTitle('');
    setDescription('');
    setDuration('');
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
        placeholder="Duration (in minutes)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
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
});

export default AddDailyActivity;
