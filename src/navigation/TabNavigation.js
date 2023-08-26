import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../constants';
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// import stacks
import StackMenu from './StackMenu';
import StackBusiness from './StackBusiness';
import StackServices from './StackServices';

const Tab = AnimatedTabBarNavigator();

function TabNavigation({ navigation, route }) {
  const [focusedTab, setFocusedTab] = useState('Город'); // Default tab name

  const handleTabPress = (tabName) => {
    setFocusedTab(tabName);
  };

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.white,
        inactiveTintColor: colors.black,
        activeBackgroundColor: colors.primary,
      }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color }) => {
          let icon = (
            <MaterialCommunityIcons name="home-city-outline" size={24} color={color} />
          );

          if (route.name === 'Бизнес') {
            icon = <MaterialIcons name="business-center" size={24} color={color} />;
          }
          if (route.name === 'Службы') {
            icon = <MaterialCommunityIcons name="police-badge" size={24} color={color} />;
          }

          return icon;
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Город"
        component={StackMenu}
        listeners={{
          tabPress: () => handleTabPress('Город'),
        }}
      />
      <Tab.Screen
        name="Бизнес"
        component={StackBusiness}
        listeners={{
          tabPress: () => handleTabPress('Бизнес'),
        }}
      />
      <Tab.Screen
        name="Службы"
        component={StackServices}
        listeners={{
          tabPress: () => handleTabPress('Службы'),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigation;
