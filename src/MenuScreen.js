import React, { useContext, useEffect, useState, useRef } from 'react';
import { Image } from 'expo-image';
import { ScrollView, Text, View, Dimensions, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { GlobalStateContext } from './navigation/RootStack';
import { useNavigation } from '@react-navigation/native';
import { colors, gStyle } from './constants';
const {width, height} = Dimensions.get('window');
import Lottie from 'lottie-react-native';
import StarRating from 'react-native-star-rating-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import cities
const tree = require('./assets/animations/cities/tree.json')
const village = require('./assets/animations/cities/village.json')
const smallcity = require('./assets/animations/cities/smallcity.json')
const mediumcity = require('./assets/animations/cities/mediumcity.json')
const bigcity = require('./assets/animations/cities/bigcity.json')
const largecity = require('./assets/animations/cities/largecity.json')

import SnackBar from './Components/SnackBar'
import Button from './Components/Button'

import { AntDesign, FontAwesome5, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';

function MenuScreen() {
  const { user, setUser } = useContext(GlobalStateContext);
  const animationRef = useRef(null);

  const navigation = useNavigation();

  const [isUpdated, setIsUpdated] = useState(false);

  // snackbar
  const [snackbar, setSnackbar] = useState(false);
  const [icon, setIcon] = useState(null);
  const [header, setHeader] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user == undefined) return console.log('undefined');
    if (user.length == 0) {
      console.log('onboard');
      navigation.navigate('Onboard');
    }
    animationRef.current?.play(1000);
  }, [user]);

  useEffect(() => {
    if (isUpdated) {
      setIsUpdated(false);
    }
  }, [isUpdated]);

  function giveMoney() {
    user[0].money = 100000
    save()
  }

  function buy() {
    if (user[0].city == 'tree') {
      if (user[0].money < getPriceUpgrade()) return ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Ошибка!', 'В казне города недостаточно средств.')
      user[0].money = user[0].money - getPriceUpgrade();
      user[0].city = 'village';
      ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Успех!', 'Вы успешно повысили уровень города')
      save()
    } else if (user[0].city == 'village') {
      if (user[0].money < getPriceUpgrade()) return ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Ошибка!', 'В казне города недостаточно средств.')
      user[0].money = user[0].money - getPriceUpgrade();
      user[0].city = 'smallcity';
      ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Успех!', 'Вы успешно повысили уровень города')
      save()
    } else if (user[0].city == 'smallcity') {
      if (user[0].money < getPriceUpgrade()) return ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Ошибка!', 'В казне города недостаточно средств.')
      user[0].money = user[0].money - getPriceUpgrade();
      user[0].city = 'mediumcity';
      ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Успех!', 'Вы успешно повысили уровень города')
      save()
    } else if (user[0].city == 'mediumcity') {
      if (user[0].money < getPriceUpgrade()) return ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Ошибка!', 'В казне города недостаточно средств.')
      user[0].money = user[0].money - getPriceUpgrade();
      user[0].city = 'bigcity';
      ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Успех!', 'Вы успешно повысили уровень города')
      save()
    } else if (user[0].city == 'bigcity') {
      if (user[0].money < getPriceUpgrade()) return ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Ошибка!', 'В казне города недостаточно средств.')
      user[0].money = user[0].money - getPriceUpgrade();
      user[0].city = 'largecity';
      ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Успех!', 'Вы успешно повысили уровень города')
      save()
    }
  }

  function getPriceUpgrade() {
    if (user[0].city == 'tree') return 75;
    if (user[0].city == 'village') return 1100;
    if (user[0].city == 'smallcity') return 4000;
    if (user[0].city == 'mediumcity') return 10000;
    if (user[0].city == 'bigcity') return 100000;
    if (user[0].city == 'largecity') return 500000;
  }

  function getCity(city, type) {
    console.log('city ' +city)
    if (type == 0) {
      if (city == 'tree') return tree
      if (city == 'village') return village
      if (city == 'smallcity') return smallcity
      if (city == 'mediumcity') return mediumcity
      if (city == 'bigcity') return bigcity
      if (city == 'largecity') return largecity
    } else {
      if (city == 'tree') return 'отсутствует'
      if (city == 'village') return 'деревня'
      if (city == 'smallcity') return 'маленький город'
      if (city == 'mediumcity') return 'средний город'
      if (city == 'bigcity') return 'большой город'
      if (city == 'largecity') return 'крупный город'
    }
  }

  async function save() {
    setUser(user)
    console.log(user)
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setIsUpdated(true);
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
    user != null ?
      user.length != 0 ?
        <View style={gStyle.container}>
          { snackbar ? <SnackBar icon={icon} header={header} message={message} /> : null }
          <ScrollView style={{ zIndex: -1 }}>
            <ImageBackground imageStyle={{ borderBottomLeftRadius: 100, borderBottomRightRadius: 100, width: width, height: 300, backgroundColor: colors.primary, }} source={require('./assets/images/money.jpg')}>
              <View style={{ width: 190, height: 190, backgroundColor: 'white', borderRadius: 150, marginTop: 180, borderColor: colors.primary, borderWidth: 3, marginLeft: width/2/2, justifyContent: "center", alignItems: "center" }}>
                <Lottie style={{ width: 180, height: 110 }} ref={animationRef} source={getCity(user[0].city, 0)} autoPlay loop />
              </View>
            </ImageBackground>
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.text, {marginTop: 20 }]}>
                {user[0].name}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text style={[styles.text, { fontSize: 15, opacity: 0.6 }]}>
                Казна города:
              </Text>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                <Text style={styles.text}>
                  {user[0].money}
                </Text>
                <MaterialIcons name="attach-money" style={{ bottom: 3 }} size={24} color="black" />
              </View>
            </View>
            <View style={[styles.cell, { marginTop: -20 }]}>
              <Text style={[styles.text, { fontSize: 15, opacity: 0.6 }]}>
                Налог:
              </Text>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                <Text style={styles.text}>
                  {user[0].tax}
                </Text>
                <MaterialIcons name="attach-money" style={{ bottom: 3 }} size={24} color="black" />
              </View>
            </View>
            <View style={[styles.cell, { marginTop: -20 }]}>
              <Text style={[styles.text, { fontSize: 15, opacity: 0.6 }]}>
                Уровень города:
              </Text>
              <Text style={styles.text}>
                {getCity(user[0].city, 1)}
              </Text>
            </View>
            <View style={[styles.cell, { marginTop: -15 }]}>
              <Text style={[styles.text, { fontSize: 15, opacity: 0.6 }]}>
                Население:
              </Text>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                <Text style={[styles.text, { right: 5 }]}>
                  {user[0].people}
                </Text>
                <Ionicons name="people-sharp" size={24} style={{ bottom: 3 }} color="black" />
              </View>
            </View>
            <View style={[styles.cell, { marginTop: -25 }]}>
              <Text style={[styles.text, { fontSize: 15, opacity: 0.6, marginTop: 4 }]}>
                Оценка жителей:
              </Text>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                <StarRating
                  style={{ marginTop: -3 }}
                  starStyle={{ width: 20 }}
                  rating={user[0].happiness}
                  onChange={(num) => { handleChange(num) }}
                />
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Button onPress={buy} text={`Улучшить город • ${getPriceUpgrade()}$`} />
            </View>
            <View style={{ alignItems: "center" }}>
              <Button onPress={giveMoney} text={`Кнопка в честь Глепа (даёт два ляма баксов, но я не про альбомы)`} />
            </View>
          </ScrollView>
        </View>
      : null
    : null
  );
}

const styles = StyleSheet.create({
  header: {
    width: width,
    height: 300,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  cell: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12
  },
  text: {
    fontFamily: "mt-bold"
  }
});

export default MenuScreen;
