import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { GlobalStateContext } from '../navigation/RootStack';
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { Ionicons } from '@expo/vector-icons';
import { colors, gStyle } from '../constants';

// import Components
import Button from './Button';

const PopupComponent = () => {
  const { modalHeader, modalText, modalVisible, setModalVisible } = useContext(GlobalStateContext);

  const handleCloseModal = () => {
    setModalVisible(0)
  }

  return (
    <FancyAlert
        visible={modalVisible == 1}
        icon={<View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 50, width: '100%' }}><Ionicons name="ios-notifications-sharp" size={24} color={'white'} /></View>} style={{ backgroundColor: 'white' }}
        style={{ backgroundColor: 'white' }}
      >
        <Text style={{ marginTop: -16, marginBottom: 32, fontFamily: "mt-bold", fontSize: 20 }}>{modalHeader == 'fail' ? 'Провал!' : 'Успех!'}</Text>
        <View style={{ alignItems: "center", justifyContent: "center", paddingLeft: 5, paddingRight: 5 }}>
          <Text style={{ marginTop: -16, marginBottom: 24, textAlign: "center", fontFamily: "mt-bold", fontSize: 12 }}>{modalText}</Text>
        </View>
        <View style={{ marginBottom: 15 }}>
          <Button onPress={handleCloseModal} text={`Принять`} />
        </View>
      </FancyAlert>
  )
}

export default PopupComponent;
