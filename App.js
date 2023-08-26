import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts } from 'expo-font';
import AppLoading  from 'expo-app-loading'

import RootStack from './src/navigation/RootStack';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded] = useFonts({
    'mt-bold': require('./src/fonts/mtbold.ttf'),
    'mt-light': require('./src/fonts/Montserrat-Light.ttf'),
    'mt-italic': require('./src/fonts/Montserrat-Italic.ttf')
  });

  React.useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync('overlay-swipe');
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <AppLoading />;
  }

  return (
    <React.Fragment>
      <StatusBar hidden={true} />

      <RootStack />

      <View onLayout={onLayoutRootView} />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
