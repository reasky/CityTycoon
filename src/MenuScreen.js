import React, { useContext, useEffect, useState, useRef } from 'react';
import { Image } from 'expo-image';
import { ScrollView, Text, View, Dimensions, TouchableOpacity, StyleSheet, ImageBackground, TextInput } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { GlobalStateContext } from './navigation/RootStack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, gStyle } from './constants';
const {width, height} = Dimensions.get('window');
import { Audio } from 'expo-av';
import Lottie from 'lottie-react-native';
import NumericInput from 'react-native-numeric-input'
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
import CountdownTimer from './Components/ReFillComponent'

import { AntDesign, FontAwesome5, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';

function getRandomInt(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

function MenuScreen({ navigation, route }) {
  const { user, setUser } = useContext(GlobalStateContext);
  const animationRef = useRef(null);

  const [isUpdated, setIsUpdated] = useState(false);
  const [sound, setSound] = useState();
  const [isSoundFinish, setIsSoundFinish] = useState(true)

  // snackbar
  const [snackbar, setSnackbar] = useState(false);
  const [icon, setIcon] = useState(null);
  const [header, setHeader] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user == undefined) return
    if (user.length == 0) {
      navigation.navigate('Onboard');
    }
    animationRef.current?.play(1000);
  }, [user]);

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

  useEffect(()=>{
    playSound()
  },[isSoundFinish])

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && !status.isPlaying && status.positionMillis === status.durationMillis) {
      setIsSoundFinish(!isSoundFinish)
    }
  }

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
       require('./assets/music/default.mp3'),
    );
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    setSound(sound);
    await sound.replayAsync();
  }

  /*setTimeout(async () => {
    console.log('timeout')
    try {
      var value = await AsyncStorage.getItem('user');
      if (value !== null) {
        setUser(JSON.parse(value));
      } else {
        setUser([]);
      }
    } catch (e) {
      console.log('error ' + e);
    }
  }, 3000); */

  function buy() {
    const cityLevels = ['tree', 'village', 'smallcity', 'mediumcity', 'bigcity', 'largecity'];
    const currentCityIndex = cityLevels.indexOf(user[0].city);

    if (user[0].money < getPriceUpgrade()) {
      return ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Ошибка!', 'В казне города недостаточно средств.');
    }

    if (currentCityIndex < cityLevels.length - 1) {
      user[0].money -= getPriceUpgrade();
      user[0].city = cityLevels[currentCityIndex + 1];
      ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Успех!', 'Вы успешно повысили уровень города');
      save();
    }
  }

  function getTaxLimits() {
    console.log('wasd')
    const userData = user[0];
    const city = userData.city;
    console.log(userData)

    const taxLimits = {
        'tree': { maxTax: 3, minTax: 3 },
        'village': { maxTax: 10, minTax: 3 },
        'smallcity': { maxTax: 15, minTax: 3 },
        'mediumcity': { maxTax: 40, minTax: 10 },
        'bigcity': { maxTax: 50, minTax: 20 },
        'largecity': { maxTax: 55, minTax: 25 }
    };

    let { maxTax, minTax } = taxLimits[city];

    return [maxTax, minTax]
  }

  function handleChangeTax(text) {
    const userData = user[0];
    if (user[0].city == 'tree') return;

    userData.tax = text;

    save();
  }

  function giveTax() {
    const userData = user[0];
    let { city, tax, people, money, happiness } = userData;

    const taxChanges = {
        'village': { maxNalog: 6, minNalog: 4 },
        'smallcity': { maxNalog: 10, minNalog: 5 },
        'mediumcity': { maxNalog: 25, minNalog: 15 },
        'bigcity': { maxNalog: 40, minNalog: 25 },
        'largecity': { maxNalog: 50, minNalog: 30 }
    };

    if (city in taxChanges) {
        const { maxNalog, minNalog } = taxChanges[city];

        if (tax > maxNalog && happiness > 0) {
            happiness -= 0.5;
        } else if (tax <= minNalog && happiness < 5) {
            happiness += 0.5;
        }

        if (people <= 1) {
            userData.happiness = happiness;
            userData.money = money;
            save();
            return;
        }

        userData.money = userData.money + tax*(people-1) + userData.cars*15 + userData.agro*30 + userData.electroEnergy*5 + userData.oil*100 + userData.chemist*40 - userData.securityService - userData.policeService;
        userData.happiness = happiness;
        save();
    }
  }

  function managePopulation() {
    const cityData = {
        'village': { increase: [1, 4], decrease: [1, 3], maxPopulation: 5 },
        'smallcity': { increase: [2, 7], decrease: [3, 6], maxPopulation: 20 },
        'mediumcity': { increase: [4, 12], decrease: [4, 7], maxPopulation: 30 },
        'bigcity': { increase: [10, 20], decrease: [10, 15], maxPopulation: 40 },
        'largecity': { increase: [20, 40], decrease: [20, 25], maxPopulation: 100 }
    };

    const userData = user[0];
    let { city, happiness, people } = userData;
    const cityChanges = cityData[city];

    if (cityChanges) {
        const { increase, decrease, maxPopulation } = cityChanges;

        if (happiness > 3 && people < maxPopulation) {
            const increaseAmount = Math.min(getRandomInt(increase[0], increase[1]), maxPopulation - people);
            userData.people = people < 1 ? 1 : Math.min(people + increaseAmount, maxPopulation);
        } else if (happiness <= 2.5) {
            userData.people = Math.max(people - getRandomInt(decrease[0], decrease[1]), 0);
            if (userData.people < 1) {
                userData.people = 1;
                save();
                return;
            }
        }

        save();
    }
  }

  function getKeeping(city) {
    if (city == 'tree') return 0

    const cityData = {
        'village': { money: 15, maxPopulation: 5 },
        'smallcity': { money: 100, maxPopulation: 20 },
        'mediumcity': { money: 350, maxPopulation: 30 },
        'bigcity': { money: 1200, maxPopulation: 40 },
        'largecity': { money: 4000, maxPopulation: 100 }
    };
    return cityData[city].money
  }

  function keepingCity() {
    const cityData = {
        'village': { money: 15, maxPopulation: 5 },
        'smallcity': { money: 100, maxPopulation: 20 },
        'mediumcity': { money: 350, maxPopulation: 30 },
        'bigcity': { money: 1200, maxPopulation: 40 },
        'largecity': { money: 4000, maxPopulation: 100 }
    };

    const userData = user[0];
    let { city, happiness, people } = userData;
    const cityChanges = cityData[city];
    const previousCity = cityData[userData.city];

    // Найдем имя предыдущего города
    let previousCityName = 'tree';
    for (const cityName in cityData) {
        if (cityName === city) {
            break;
        }
        previousCityName = cityName;
    }

    if (cityChanges) {
        const { money, maxPopulation } = cityChanges;

        if (userData.money < money) {
            if (previousCity && previousCity.maxPopulation === 0) {
                userData.people = 0;
            }

            // Перед установкой города в "tree" устанавливаем население в 1
            if (previousCityName === 'tree') {
                userData.people = 1;
            }

            userData.city = previousCityName;
            ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Провал!', 'В казне не хватило денег для оплаты содержания города, поэтому Вы были возвращены на предыдущий уровень');

            if (userData.city == 'tree') {
                user[0].money = 100;
                console.log(user[0].securityService)
                user[0].securityService = 0;
                user[0].policeService = 0;
                save()
            }

            if (previousCityName !== 'tree' && cityData.hasOwnProperty(previousCityName)) {
                const previousCityChanges = cityData[previousCityName];
                if (previousCityChanges.maxPopulation >= userData.people) {
                    ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Провал!', 'В казне не хватило денег для оплаты содержания города, поэтому Вы были возвращены на предыдущий уровень');
                } else {
                    userData.people = previousCityChanges.maxPopulation;
                    ssb(<FontAwesome5 name="city" size={24} color="white" />, 'Провал!', 'В казне не хватило денег для оплаты содержания города, поэтому Вы были возвращены на предыдущий уровень');
                }
            }
        } else {
            userData.money -= money;

            if (city === 'village' && previousCity && previousCity.maxPopulation === 0) {
                userData.people = 0;
            } else {
                userData.people = Math.min(maxPopulation, userData.people);
            }
        }

        save();
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
    console.log(user)
    setUser(user)
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

  function reFill() {
    if (user == undefined) return;
    if (user.length == 0) return;
    giveTax();
    managePopulation();
    keepingCity();
  }

  return (
    user != null ?
      user.length != 0 ?
        <View style={gStyle.container}>
          { snackbar ? <SnackBar icon={icon} header={header} message={message} /> : null }
          <ScrollView style={{ zIndex: -1 }}>
            <ImageBackground imageStyle={{ borderBottomLeftRadius: 100, borderBottomRightRadius: 100, width: width, height: 300, backgroundColor: colors.primary, }} source={require('./assets/images/money.jpg')}>
              <View style={{ width: 190, height: 190, backgroundColor: 'white', borderRadius: 150, marginTop: 180, borderColor: colors.primary, borderWidth: 3, marginLeft: width/2/2, justifyContent: "center", alignItems: "center" }}>
                <Lottie style={{ width: 160, height: 90 }} ref={animationRef} source={getCity(user[0].city, 0)} autoPlay loop />
              </View>
            </ImageBackground>
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.text, {marginTop: 20 }]}>
                {user[0].name}
              </Text>
            </View>
            <View style={[styles.cell]}>
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
                Налог на жителя:
              </Text>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                <View style={{ marginTop: -3 }}>
                  <NumericInput rounded={true} separatorWidth={0} inputStyle={{ color: colors.white, fontFamily: "mt-bold" }} containerStyle={{ backgroundColor: colors.primary }} iconStyle={{ color: colors.white }} rightButtonBackgroundColor={colors.primary} backgroundColor={colors.primary} leftButtonBackgroundColor={colors.primary} minValue={getTaxLimits()[1]} initValue={user[0].tax} maxValue={getTaxLimits()[0]} onLimitReached={(isMax,msg) => console.log(isMax,msg)} rightButtonBackgroundColor={colors.primary} onChange={value => handleChangeTax(value)} upDownButtonsBackgroundColor={colors.primary} leftButtonBackgroundColor={colors.primary} totalWidth={60} />
                </View>
                <MaterialIcons name="attach-money" style={{ bottom: 3 }} size={24} color="black" />
              </View>
            </View>
            <View style={[styles.cell, { marginTop: -20 }]}>
              <Text style={[styles.text, { fontSize: 15, opacity: 0.6 }]}>
                Содержание города:
              </Text>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                <Text style={styles.text}>
                  {getKeeping(user[0].city)}
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
            <View style={[styles.cell, { marginTop: -20 }]}>
              <Text style={[styles.text, { fontSize: 15, opacity: 0.6 }]}>
                До пополнения:
              </Text>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", paddingRight: 4 }}>
                <CountdownTimer reFill={reFill} />
              </View>
            </View>
            <View style={[styles.cell, { marginTop: -20 }]}>
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
                  onChange={() => {  }}
                />
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              {user[0].city == 'largecity' ? null : <Button onPress={buy} text={`Улучшить город • ${getPriceUpgrade()}$`} /> }
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
  },
  input: {
    width: 100,
    height: 20,
    color: 'gray',
    fontFamily: "mt-bold"
  },
});

export default MenuScreen;
