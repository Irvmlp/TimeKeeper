import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './DailyLogsStyles';

const SortButtons = ({ sortOrder, setSortOrder, deleteMode, toggleDeleteMode }) => {
  return (
    <View style={styles.controlButtons}>
      <TouchableOpacity
        style={[
          styles.sortButton,
          sortOrder === 'chronological' && styles.selectedButton
        ]}
        onPress={() => setSortOrder('chronological')}
      >
        <Text style={styles.buttonText}>Chronological</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.sortButton,
          sortOrder === 'duration' && styles.selectedButton
        ]}
        onPress={() => setSortOrder('duration')}
      >
        <Text style={styles.buttonText}>By Duration</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.sortButton,
          sortOrder === 'goodBad' && styles.selectedButton
        ]}
        onPress={() => setSortOrder('goodBad')}
      >
        <Text style={styles.buttonText}>Good/Bad</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.deleteToggle,
          deleteMode && styles.selectedButton
        ]}
        onPress={toggleDeleteMode}
      >
        <Text style={styles.deleteToggleText}>{deleteMode ? 'Confirm' : 'Delete Logs'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SortButtons;
