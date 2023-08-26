import React, { useContext, useEffect, useState, useRef } from 'react';
import { Image } from 'expo-image';
import { ScrollView, Text, View, Dimensions, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useScrollToTop, useFocusEffect } from '@react-navigation/native';
import { GlobalStateContext } from './navigation/RootStack';
import { useNavigation } from '@react-navigation/native';
import { colors, gStyle } from './constants';
const {width, height} = Dimensions.get('window');

import AsyncStorage from '@react-native-async-storage/async-storage';

import SnackBar from './Components/SnackBar'
import Button from './Components/Button'
import ServicesCardComponent from './Components/ServicesCardComponent'

const previewSecurity = require('./assets/animations/security/preview.json')
const previewPolice = require('./assets/animations/police/preview.json')

import { AntDesign, FontAwesome5, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';

function ServicesScreen() {
  const { user, setUser } = useContext(GlobalStateContext);
  const animationRef = useRef(null);

  const navigation = useNavigation();

  const [isUpdated, setIsUpdated] = useState(false);

  // snackbar
  const [snackbar, setSnackbar] = useState(false);
  const [icon, setIcon] = useState(null);
  const [header, setHeader] = useState('');
  const [message, setMessage] = useState('');

  function ssb(icon, header, text) {
    setIcon(icon)
    setHeader(header)
    setMessage(text)
    setSnackbar(true)
    setTimeout(()=>{
      setSnackbar(false)
    },3000)
  }

  async function handleChangeFin(value, type) {
    if (user[0].city == 'tree') return ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Провал!', 'Ваш уровень города слишком мал!');
    user[0][type+'Service'] = value
    save()
  }

  async function save() {
    console.log(user)
    setUser(user)
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setIsUpdated(true);
  }

  useEffect(() => {
    if (isUpdated) {
      setIsUpdated(false);
    }
  }, [isUpdated]);

  useFocusEffect(
    React.useCallback(() => {
      setIsUpdated(true)

      return () => console.log('false');
    }, [])
  );

  return (
    user != null ?
      user.length != 0 ?
        <View style={gStyle.container}>
          { snackbar ? <SnackBar icon={icon} header={header} message={message} /> : null }
          <ScrollView style={{ zIndex: -1 }}>
            <View style={{ alignItems: "center" }}>
              <ServicesCardComponent maxFin={user[0].money - user[0].policeService} value={user[0].securityService} lottie={previewSecurity} onChange={handleChangeFin} type={'security'} color={'#474747'} name="Личная охрана" description="Личная охрана защищает вас от недоброжелателей" />
              <ServicesCardComponent maxFin={user[0].money - user[0].securityService} value={user[0].policeService} lottie={previewPolice} onChange={handleChangeFin} type={'police'} color={'#4a4e62'} name="Полиция" description="Следит за порядком в городе" />
            </View>
          </ScrollView>
        </View>
      : null
    : null
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "mt-bold",
    color: colors.white
  }
});

export default ServicesScreen;
