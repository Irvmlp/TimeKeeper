import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, FlatList } from 'react-native';
import styles from './ControlButtonStyles';

const SortButtons = ({ sortOrder, setSortOrder, deleteMode, toggleDeleteMode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const sortingOptions = [
    { label: 'Chronological', value: 'chronological' },
    { label: 'By Duration', value: 'duration' },
    { label: 'Good/Bad', value: 'goodBad' },
  ];

  const handleSortChange = (value) => {
    setSortOrder(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.controlButtons}>
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.ChevronDown}>﹀</Text>
          <Text style={styles.dropdownButtonText}>
            {sortingOptions.find(option => option.value === sortOrder)?.label}
          </Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={sortingOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSortChange(item.value)}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
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
