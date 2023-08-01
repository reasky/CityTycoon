import React, { useState, createContext, useEffect } from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { ScrollView, Text, View, Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gStyle, colors } from '../constants';

// import screens
import OnboardScreen from '../OnboardScreen';
import MenuScreen from '../MenuScreen';

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
        console.log(JSON.parse(value))
        setUser(JSON.parse(value))
      } else {
        console.log(value + ' value')
        setUser([])
      }
    } catch (e) {
      console.log('error ' + e)
    }
  }

  return (
    <GlobalStateContext.Provider value={{ user, setUser }}>
      <NavigationContainer theme={DarkTheme} independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="Menu"
            component={MenuScreen}
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
