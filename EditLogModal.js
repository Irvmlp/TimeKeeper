import React from 'react';
import { View, Text, TextInput, Modal, Button } from 'react-native';
import styles from './DailyLogsStyles';

const EditLogModal = ({ visible, log, newDuration, setNewDuration, error, handleSaveEdit, handleCancelEdit }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
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
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button title="Save" onPress={handleSaveEdit} />
          <Button title="Cancel" onPress={handleCancelEdit} />
        </View>
      </View>
    </Modal>
  );
};

export default EditLogModal;
