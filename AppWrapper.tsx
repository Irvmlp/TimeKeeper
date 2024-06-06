// AppWrapper.js
import React from 'react';
import RealmWrapper from './RealmWrapper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from './App';
import SummaryScreen from './SummaryScreen';  // Make sure you create this component

const Stack = createNativeStackNavigator();

const AppWrapper = () => (
  <RealmWrapper>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="App">
        <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
        <Stack.Screen name="Summary" component={SummaryScreen} options={{ title: 'Summary' }} />
      </Stack.Navigator>
    </NavigationContainer>
  </RealmWrapper>
);

export default AppWrapper;
