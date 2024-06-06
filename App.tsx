// App.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RealmContext } from './RealmWrapper';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';

const App = ({ navigation }) => {
  const { user } = useContext(RealmContext);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('App')}>
          <Text style={styles.headerTitle}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Summary')}>
          <Text style={styles.headerMenu}>sum</Text>
        </TouchableOpacity>
      </View>
      {user ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Dashboard />
        </View>
      ) : (
        <LoginScreen />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 2,
    marginTop: 88,
    marginLeft: 12,
    alignItems: 'left',
    justifyContent: 'left',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  headerMenu: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'light',
    justifyContent: 'flex-end',
    textDecorationLine: 1,
  },
  headerTitle: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default App;
