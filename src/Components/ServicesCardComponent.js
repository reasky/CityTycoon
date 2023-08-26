import React, { useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
const {width, height} = Dimensions.get('window');
import Lottie from 'lottie-react-native';
import PropTypes from 'prop-types';
import NumericInput from 'react-native-numeric-input'
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '../constants'

const ServicesCardComponent = (props) => {
  const { lottie, onChange, type, maxFin, name, description, money, color, value } = props

  return (
    <View style={[styles.containerBusiness, { width: width - 30, borderRadius: 10, marginTop: 20, flexDirection: "row", backgroundColor: color }]}>
      <Lottie style={{ width: 160, height: 90, alignSelf: "flex-start", marginLeft: 0, marginTop: 3, marginLeft: "3%" }} source={lottie} autoPlay loop />
      <View style={{ marginLeft: -50 }}>
        <Text style={[styles.text, { marginTop: 13 }]}>Служба «{name}»</Text>
        <View style={{ marginTop: 8, flexDirection: "row" }}>
          <Text style={[styles.text, { marginTop: 1, fontSize: 10, alignSelf: "center", maxWidth: 190, marginTop: -7 }]}>{description}.</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end", bottom: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.text, { marginTop: 1, fontSize: 10, alignSelf: "center", maxWidth: 190 }]}>Финансирование: </Text>
            <NumericInput rounded={true} maxValue={maxFin} minValue={0} separatorWidth={0} value={value} onLimitReached={(isMax, msg) => console.log(isMax, msg)} inputStyle={{ color: colors.white, fontFamily: "mt-bold", whiteSpace: "nowrap" }} containerStyle={{ backgroundColor: colors.primary }} iconStyle={{ color: colors.white }} rightButtonBackgroundColor={colors.primary} backgroundColor={colors.primary} onChange={value => onChange(value, type)} leftButtonBackgroundColor={colors.primary} totalWidth={60} />
            <MaterialIcons name="attach-money" style={{ bottom: 1 }} size={24} color="white" />
          </View>
        </View>
      </View>
    </View>
  )
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
  containerBusiness: {
    height: 100,
    borderRadius: 10,
  },
  text: {
    fontFamily: "mt-bold",
    color: colors.white
  }
})

ServicesCardComponent.props = {
  name: PropTypes.string,
  description: PropTypes.string,
  money: PropTypes.string,
  price: PropTypes.int,
  color: PropTypes.string,
  type: PropTypes.string,
  level: PropTypes.int
}

export default ServicesCardComponent;
