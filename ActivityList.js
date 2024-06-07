import React from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import styles from './DailyLogsStyles';

const ActivityList = ({ activityLogs, sortOrder, handleDeleteLog, handleEdit, deleteMode }) => {
  return (
    <FlatList
      data={activityLogs}
      keyExtractor={item => item._id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.item,
            item.title === "🕒" ? styles.unloggedTimeItem : item.isGood ? styles.goodItem : styles.badItem,
            deleteMode && styles.selectedItem
          ]}
          onPress={() => deleteMode ? handleDeleteLog(item._id) : handleEdit(item)}
        >
          <View style={styles.itemContent}>
            <Text style={styles.itemEmoji}>{item.title}</Text>
            <Text style={styles.itemText2}>{item.description}</Text>
            <Text style={styles.itemText2}>{item.duration} hrs</Text>
            <View style={styles.exclamationContainer}>
              {Array(item.criticalness).fill('!').map((char, index) => (
                <Text key={index} style={styles.exclamationMark}>{char}</Text>
              ))}
            </View>
          </View>
          {deleteMode && (
            <TouchableOpacity onPress={() => handleDeleteLog(item._id)}>
              <Text style={styles.deleteCheck}>X</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ActivityList;
