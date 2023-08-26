import React, { useState, createContext, useEffect } from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { ScrollView, Text, View, Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gStyle, colors } from '../constants';

// import screens
import OnboardScreen from '../OnboardScreen';

// tab navigation
import TabNavigation from './TabNavigation';

const Stack = createNativeStackNavigator();
export const GlobalStateContext = createContext();

function RootStack() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    readDataUser()
  },[])

  const readDataUser = async () => {
    try {
      var value = await AsyncStorage.getItem('user');
      if (value !== null) {
        setUser(JSON.parse(value))
      } else {
        setUser([])
      }
    } catch (e) {
      console.log('error ' + e)
    }
  }

  return (
    <GlobalStateContext.Provider value={{ user, setUser }}>
      <NavigationContainer theme={DarkTheme} independent={true}>
        <Stack.Navigator
          screenOptions={{
            presentation: 'fullScreenModal'
          }}
        >
          <Stack.Screen
            name="TabNavigation"
            component={TabNavigation}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Onboard"
            component={OnboardScreen}
            options={{
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalStateContext.Provider>
  );
}

export default RootStack;
