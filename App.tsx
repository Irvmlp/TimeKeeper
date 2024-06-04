import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RealmContext } from './RealmWrapper';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';

const App = () => {
  const { user } = useContext(RealmContext);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Today</Text>
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
  },
  headerTitle: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default App;
