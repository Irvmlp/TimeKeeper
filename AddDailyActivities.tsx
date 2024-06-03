import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { RealmContext } from './RealmWrapper';
import EmojiInput from 'react-native-emoji-input';

const AddDailyActivity = ({ onAdd }) => {
  const { user, app } = useContext(RealmContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

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
      onAdd(); // Notify parent to refresh the list and close the add data form
    } catch (err) {
      console.error("Failed to add data", err);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setTitle(title + emoji.char);
    setIsEmojiPickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsEmojiPickerVisible(true)}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
      </TouchableOpacity>
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

      <Modal visible={isEmojiPickerVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <EmojiInput onEmojiSelected={handleEmojiSelect} />
          <Button title="Close" onPress={() => setIsEmojiPickerVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 20,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default AddDailyActivity;
