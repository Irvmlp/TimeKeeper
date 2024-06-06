import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RealmContext } from './RealmWrapper';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';
import { fetchData } from './apiService';

const App = ({ navigation }) => {
  const { user } = useContext(RealmContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      if (user) {
        try {
          const result = await fetchData(user.id); // Use the user ID as the dynamic ID
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    getData();
  }, [user]);

  return (
    <View style={{ backgroundColor: 'white' , flex: 1 }}>
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
      {/* {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <Text>Data: {JSON.stringify(data)}</Text>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 2,
    backgroundColor: 'white',
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
    backgroundColor: 'white',
    fontWeight: 'light',
    justifyContent: 'flex-end',
    textDecorationLine: 1,
  },
  headerTitle: {
    fontSize: 24,
    color: '#000',
    backgroundColor: 'white',
    fontWeight: 'bold',
  },
});

export default App;
