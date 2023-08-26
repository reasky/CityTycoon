import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import screens
import ServicesScreen from '../ServicesScreen';

const Stack = createNativeStackNavigator();

function StackServices() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

export default StackServices;
