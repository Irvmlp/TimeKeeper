import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { RealmContext } from './RealmWrapper';

const AddDailyActivity = ({ onAdd }) => {
  const { user, app } = useContext(RealmContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [desiredDuration, setDesiredDuration] = useState('');
  const [error, setError] = useState('');

  const handleAddData = async () => {
    if (!title || !description || !desiredDuration) return;

    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailyEntries");

    const newEntryDesiredDuration = parseInt(desiredDuration, 10); // Parse desired duration

    const newData = {
      _id: new Realm.BSON.ObjectId(),
      userId: user.id,
      title,
      description,
      desiredDuration: newEntryDesiredDuration, // Include desired duration
      timestamp: new Date(),
    };

    try {
      await realm.insertOne(newData);
      onAdd();
      setTitle('');
      setDescription('');
      setDesiredDuration(''); // Reset desired duration
      setError('');
    } catch (err) {
      console.error("Failed to add data", err);
      setError('Failed to add data');
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
        placeholder="Desired Duration (in hours)"
        value={desiredDuration}
        onChangeText={setDesiredDuration}
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
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});

export default AddDailyActivity;
