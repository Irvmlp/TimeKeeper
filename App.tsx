import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { RealmContext } from './RealmWrapper';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';

const App = () => {
  const { user } = useContext(RealmContext);

  return (
    <View style={{ flex: 1 }}>
      {user ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{`Logged in as ${user.id}`}</Text>
          <Dashboard/>
        </View>
      ) : (
        <LoginScreen />
      )}
    </View>
  );
};

export default App;


