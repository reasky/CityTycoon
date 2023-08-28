import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper';
import Lottie from 'lottie-react-native';
import { GlobalStateContext } from './navigation/RootStack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

import { FontAwesome5 } from '@expo/vector-icons';

// import components
import Button from './Components/Button';
import SnackBar from './Components/SnackBar';

const {width, height} = Dimensions.get('window');

export default function OnboardingScreen() {
  const { user, setUser } = useContext(GlobalStateContext);

  const navigation = useNavigation();
  const [stage, setStage] = useState(0)
  const [name, setName] = useState('')

  // SnackBar
  const [snackbar, setSnackbar] = useState(false)
  const [icon, setIcon] = useState(null)
  const [header, setHeader] = useState('')
  const [message, setMessage] = useState('')

  const handleStart = async () => {
    if (name.length == 0) return ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Ошибка!', 'Название города не может быть пустым!')
    console.log('handleStart')
    user.push({name: name, city: 'tree', money: 100, people: 1, happiness: 5, tax: 3, cars: 0, agro: 0, electroEnergy: 0, oil: 0, chemist: 0, securityService: 0, firemanService: 0, medicineService: 0})
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUser(user)
    navigation.navigate('Menu', { update: true });
  }

  const doneButton = ({...props})=>{
    return (
      <TouchableOpacity style={styles.button} {...props} onPress={()=>{ setStage(1) }}>
        <Text style={{ color: "white", fontFamily: "mt-bold" }}>Завершить</Text>
      </TouchableOpacity>
    )
  }

  const nextButton = ({...props})=>{
    return (
      <TouchableOpacity style={styles.button} {...props}>
        <Text style={{ color: "black", fontFamily: "mt-bold" }}>Далее</Text>
      </TouchableOpacity>
    )
  }

  function ssb(icon, header, text) {
    setIcon(icon)
    setHeader(header)
    setMessage(text)
    setSnackbar(true)
    setTimeout(()=>{
      setSnackbar(false)
    },3000)
  }

  return (
    <View style={styles.container}>
      { snackbar ? <SnackBar icon={icon} header={header} message={message} /> : null }
      {stage == 0 ?
        <Onboarding
              bottomBarHighlight={false}
              DoneButtonComponent={doneButton}
              NextButtonComponent={nextButton}
              showSkip={false}
              containerStyles={{paddingHorizontal: 15}}
              pages={[
                  {
                      backgroundColor: '#a7f3d0',
                      image: (
                          <View style={styles.lottie}>
                              <Lottie source={require('./assets/animations/city.json')} autoPlay loop />
                          </View>
                      ),
                      title: (<View><Text style={styles.headerDark}>«CityScape»</Text></View>),
                      subtitle: 'Стань владельцем своего города в лучшем симуляторе на Android.',
                  },
                  {
                      backgroundColor: 'white',
                      image: (
                          <View style={styles.lottie}>
                              <Lottie source={require('./assets/animations/village.json')} autoPlay loop />
                          </View>
                      ),
                      title: (<View><Text style={styles.headerDark}>Развитие</Text></View>),
                      subtitle: 'Развивай инфраструктуру своего города и стань лидером.',
                  },
                  {
                      backgroundColor: '#8F322C',
                      image: (
                          <View style={styles.lottie}>
                              <Lottie source={require('./assets/animations/fire.json')} autoPlay loop />
                          </View>
                      ),
                      title: (<View><Text style={styles.headerLight}>Бедствия</Text></View>),
                      subtitle: 'Защищай свой город от стехиных бедствий, улучшая экстренные службы спасения и системы безопасности!',
                  },
              ]}
          />
        :
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Device.brand == 'Apple' ? 'padding' : null}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={{alignItems: "center", justifyContent: "center", marginTop: width/2 }}>
                <Lottie style={{ width: 200, height: 200 }} source={require('./assets/animations/village.json')} autoPlay loop />
                <TextInput style={styles.input} placeholder='Название города' value={name} onChangeText={(e)=>{ setName(e) }} />
                <Button text={'Продолжить'} onPress={handleStart} />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  input: {
    width: 250,
    height: 44,
    padding: 10,
    bottom: 5,
    marginBottom: 10,
    borderColor: '#e8e8e8',
    borderWidth: 2,
    borderRadius: 20
  },
  lottie:{
    width: width*0.9,
    height: width
  },
  button: {
    padding: 20,
  },
  headerLight: {
    fontFamily: "mt-bold",
    fontSize: 20,
    color: "white"
  },
  headerDark: {
    fontFamily: "mt-bold",
    fontSize: 20,
    color: "black"
  },
})
