import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Switch } from 'react-native';
import { RealmContext } from './RealmWrapper';

const AddDailyActivity = ({ onAdd }) => {
  const { user, app } = useContext(RealmContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [desiredDuration, setDesiredDuration] = useState('');
  const [isGood, setIsGood] = useState(false); // New state for isGood
  const [criticalness, setCriticalness] = useState(''); // New state for criticalness
  const [error, setError] = useState('');

  const handleAddData = async () => {
    if (!title || !description || !desiredDuration || !criticalness) return;

    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailyEntries");

    const newEntryDesiredDuration = parseInt(desiredDuration, 10);
    const newEntryCriticalness = parseInt(criticalness, 10); // Parse criticalness

    const newData = {
      _id: new Realm.BSON.ObjectId(),
      userId: user.id,
      title,
      description,
      desiredDuration: newEntryDesiredDuration,
      timestamp: new Date(),
      isGood, // Include isGood
      criticalness: newEntryCriticalness, // Include criticalness
    };

    try {
      await realm.insertOne(newData);
      onAdd();
      setTitle('');
      setDescription('');
      setDesiredDuration('');
      setIsGood(false);
      setCriticalness('');
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
      <View style={styles.switchContainer}>
        <Text>Good Activity</Text>
        <Switch
          value={isGood}
          onValueChange={setIsGood}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Criticalness (1-4)"
        value={criticalness}
        onChangeText={setCriticalness}
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});

export default AddDailyActivity;
