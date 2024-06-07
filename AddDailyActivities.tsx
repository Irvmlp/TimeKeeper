import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Switch, TouchableOpacity } from 'react-native';
import { RealmContext } from './RealmWrapper';

const AddDailyActivity = ({ onAdd }) => {
  const { user, app } = useContext(RealmContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [desiredDuration, setDesiredDuration] = useState('');
  const [isGood, setIsGood] = useState(false); 
  const [criticalness, setCriticalness] = useState('');
  const [error, setError] = useState('');

  const handleAddData = async () => {
    if (!title || !description || !desiredDuration || !criticalness) return;

    const realm = app.currentUser.mongoClient("mongodb-atlas").db("DayTracker").collection("DailyEntries");

    const newEntryDesiredDuration = parseInt(desiredDuration, 10);
    const newEntryCriticalness = parseInt(criticalness, 10);

    const newData = {
      _id: new Realm.BSON.ObjectId(),
      userId: user.id,
      title,
      description,
      desiredDuration: newEntryDesiredDuration,
      timestamp: new Date(),
      isGood,
      criticalness: newEntryCriticalness,
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
      <Text style={styles.title}>Add Daily Activity</Text>
      
      <View style={styles.TitleDescriptionContainer}>
      <View style={styles.EmojiContainer}>
      <Text style={styles.Label}>Emoji</Text>
      <TextInput
        style={styles.EmojiInput}
        placeholder="Emoji"
        value={title}
        onChangeText={setTitle}
      />
       </View>
       <View style={styles.DescriptionContainer}>
      <Text style={styles.Label}>Description</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder="Ex: Sleep"
        value={description}
        onChangeText={setDescription}
      /> 
      </View>
      <View style={styles.TimeContainer}>
      <Text style={styles.Label}>Time</Text>
      <TextInput
        style={styles.TimeInput}
        placeholder="Ex. 8"
        value={desiredDuration}
        onChangeText={setDesiredDuration}
        keyboardType="numeric"
      />
       </View>
      </View>

      <View style={styles.TimeImportanceContainer}>

      <View style={styles.GoodBadContainer}>
       <View style={styles.GoodBadColumContainer}>
      <Text style={styles.Label}>Good</Text>
      <View style={styles.GoodBadGroupContainer}>
          <TouchableOpacity
            style={[
              styles.goodBadButton,
              isGood && styles.selectedGoodBadButton
            ]}
            onPress={() => setIsGood(true)}
          >
            <Text style={styles.goodBadButtonText}>👍🏻</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.goodBadButton,
              !isGood && styles.selectedGoodBadButton
            ]}
            onPress={() => setIsGood(false)}
          >
            <Text style={styles.goodBadButtonText}>👎🏻</Text>
          </TouchableOpacity>
          </View>
        </View>
        </View>


       <View style={styles.ImportanceContainer}>
      <Text style={styles.Label}>Importance</Text>
      <View style={styles.criticalnessContainer}>
        {[1, 2, 3, 4].map(value => (
          <TouchableOpacity
            key={value}
            style={[
              styles.criticalButton,
              criticalness == value && styles.selectedCriticalButton
            ]}
            onPress={() => setCriticalness(value.toString())}
          >
            <Text style={styles.criticalButtonText}>{'!'.repeat(value)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </View>
      </View>

      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.addButton} onPress={handleAddData}>
        <Text style={styles.addButtonText}>Add Data</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  LabelContainer: {
    flexDirection: 'column'
  },
  TitleDescriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6, 
  },
  EmojiContainer: {
    flex: 0.4,
  },
  TimeContainer: {
    flex: 0.3,
  },
  ImportanceContainer: {
    flex: 0.7
  },
  GoodBadContainer: {
    flex: 0.3,
  },
  EmojiInput: {
    height: 40,
    borderColor: '#E0E4ED',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
  },
  DescriptionContainer: {
    flex: 0.6,
  },
  descriptionInput: {
    flex: 0.6,
    height: 40,
    borderColor: '#E0E4ED',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007AFF',
  },
  input: {
    height: 40,
    borderColor: '#E0E4ED',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
  },
  TimeImportanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6, 
  },
  Timeinput: {
    flex: 0.2,
    height: 40,
    borderColor: '#E0E4ED',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
  },
  TimeInput: {
    flex: 0.2,
    height: 40,
    borderColor: '#E0E4ED',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  criticalnessContainer: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  GoodBadGroupContainer: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  criticalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    backgroundColor: '#F0F4F8',
    borderColor: '#E0E4ED',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedCriticalButton: {
    backgroundColor: 'white',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  criticalButtonText: {
    fontSize: 18,
    color: '#291F58',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  goodBadButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    backgroundColor: '#F0F4F8',
    borderColor: '#E0E4ED',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedGoodBadButton: {
    backgroundColor: 'white',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default AddDailyActivity;
