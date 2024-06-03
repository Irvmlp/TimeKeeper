import React, { createContext, useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { App, Credentials } from 'realm';

const appId = "application-0-csflppd";
const app = new App({ id: appId });

export const RealmContext = createContext({ user: null, app, setUser: () => {} });

const RealmWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginAnonymous = async () => {
      const credentials = Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        console.log("Successfully logged in!", user.id);
        setUser(user);
      } catch (err) {
        console.error("Failed to log in", err);
      } finally {
        setLoading(false);
      }
    };

    loginAnonymous();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RealmContext.Provider value={{ user, app, setUser }}>
      {children}
    </RealmContext.Provider>
  );
};

export default RealmWrapper;
