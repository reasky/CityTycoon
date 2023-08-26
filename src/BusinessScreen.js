import React, { useContext, useEffect, useState, useRef } from 'react';
import { Image } from 'expo-image';
import { ScrollView, Text, View, Dimensions, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { GlobalStateContext } from './navigation/RootStack';
import { useNavigation } from '@react-navigation/native';
import { colors, gStyle } from './constants';
const {width, height} = Dimensions.get('window');

import AsyncStorage from '@react-native-async-storage/async-storage';

const previewCar = require('./assets/animations/cars/preview.json')
const previewAgro = require('./assets/animations/agro/preview.json')
const previewElectroEnergy = require('./assets/animations/electroEnergy/preview.json')
const previewOil = require('./assets/animations/oil/preview.json')
const previewChemist = require('./assets/animations/chemist/preview.json')

import SnackBar from './Components/SnackBar'
import Button from './Components/Button'
import BusinessCardComponent from './Components/BusinessCardComponent'

import { AntDesign, FontAwesome5, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';

function BusinessScreen() {
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

  function getPriceUpgradeBusiness(businessType) {
    const businessLevels = {
      cars: [100, 500, 1200, 5000, 6000, 10000],
      agro: [150, 650, 1300, 6000, 7000, 12000],
      electroEnergy: [600, 1000, 2000, 8000, 10000, 17000],
      oil: [5000, 20000, 50000, 65000, 80000, 95000],
      chemist: [750, 1500, 6000, 12000, 18000, 20000],
    };

    const currentLevel = user[0][businessType];
    const prices = businessLevels[businessType];

    if (currentLevel < prices.length) {
      return prices[currentLevel];
    }

    return 0;
  }

  function buyBusiness(businessType, description, moneyEarned) {
    if (user[0].city == 'tree') return ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Ошибка!', `Вы не можете вложиться в бизнес «${description}», так как у Вас нет города.`);

    const businessLevels = [0, 1, 2, 3, 4, 5];
    const currentBusinessIndex = businessLevels.indexOf(user[0][businessType]);

    if (user[0].money < getPriceUpgradeBusiness(businessType)) {
      return ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Ошибка!', 'В казне города недостаточно средств.');
    }

    if (currentBusinessIndex < businessLevels.length - 1) {
      user[0].money -= getPriceUpgradeBusiness(businessType);
      user[0][businessType] = businessLevels[currentBusinessIndex + 1];
      ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Успех!', `Вы успешно повысили уровень бизнеса «${description}». Теперь он приносит вам ${moneyEarned*businessLevels[currentBusinessIndex + 1]}$.`);
      save();
    } else {
      ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Ошибка!', `Вы уже достигли максимального уровня бизнеса «${description}». Он приносит вам ${moneyEarned*businessLevels[currentBusinessIndex]}$.`);
    }
  }

  async function save() {
    setUser(user)
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setIsUpdated(true);
  }

  return (
    user != null ?
      user.length != 0 ?
        <View style={gStyle.container}>
          { snackbar ? <SnackBar icon={icon} header={header} message={message} /> : null }
          <ScrollView style={{ zIndex: -1 }}>
            <View style={{ alignItems: "center" }}>
              <BusinessCardComponent lottie={previewCar} onPress={buyBusiness} level={user[0].cars} type={'cars'} name={'Автопромышленность'} description={'Автомобильная промышленность повышает Ваши доходы'} money={'15'} price={getPriceUpgradeBusiness('cars')} color={'#b2b6bb'} />
              <BusinessCardComponent lottie={previewAgro} onPress={buyBusiness} level={user[0].agro} type={'agro'} name={'Агропромышленность'} description={'Агропромышленность повышает Ваши доходы'} money={'30'} price={getPriceUpgradeBusiness('agro')} color={'#7dcca0'} />
              <BusinessCardComponent lottie={previewElectroEnergy} onPress={buyBusiness} level={user[0].electroEnergy} type={'electroEnergy'} name={'Электроэнергетика'} description={'Электроэнергетика повышает Ваши доходы'} money={'5'} price={getPriceUpgradeBusiness('electroEnergy')} color={'#f87d55'} />
              <BusinessCardComponent lottie={previewOil} onPress={buyBusiness} level={user[0].oil} type={'oil'} name={'Нефтедобыча'} description={'Нефтедобыча повышает Ваши доходы'} money={'100'} price={getPriceUpgradeBusiness('oil')} color={'#4765b2'} />
              <BusinessCardComponent lottie={previewChemist} onPress={buyBusiness} level={user[0].chemist} type={'chemist'} name={'Хим. промышленность'} description={'Хим. промышленность повышает Ваши доходы'} money={'40'} price={getPriceUpgradeBusiness('chemist')} color={'#a90000'} />
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

export default BusinessScreen;
