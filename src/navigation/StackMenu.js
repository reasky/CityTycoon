import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import screens
import MenuScreen from '../MenuScreen';

const Stack = createNativeStackNavigator();

function StackHome() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

export default StackHome;
