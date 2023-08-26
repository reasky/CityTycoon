import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import screens
import BusinessScreen from '../BusinessScreen';

const Stack = createNativeStackNavigator();

function StackHome() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Business"
        component={BusinessScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

export default StackHome;
