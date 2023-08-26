import React, { useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
const {width, height} = Dimensions.get('window');
import Lottie from 'lottie-react-native';
import PropTypes from 'prop-types';

import { colors } from '../constants'

const BusinessCardComponent = (props) => {
  const { lottie, onPress, name, description, money, price, color, type, level } = props

  const handleClick = () => {
    onPress(type, name, money)
  }

  return (
    <View style={[styles.containerBusiness, { width: width - 30, marginTop: 20, flexDirection: "row", backgroundColor: color }]}>
      <Lottie style={{ width: 160, height: 90, alignSelf: "flex-start", marginLeft: type == 'electroEnergy' || type == 'oil' || type == 'chemist' ? 10 : 0 }} source={lottie} autoPlay loop />
      <View style={{ alignSelf: "flex-start", marginLeft: type == 'electroEnergy' || type == 'oil' || type == 'chemist' ? -30 : -20 }}>
        <Text style={[styles.text, { marginTop: 13 }]}>{name}</Text>
        <Text style={[styles.text, { marginTop: 1, fontSize: 10, alignSelf: "center", maxWidth: 190 }]}>{description}! (+{money}$)</Text>
        { level == 5 ?
          <View style={{ marginTop: 3, backgroundColor: "white", width: 170, height: 28, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
            <Text style={[styles.text, { color: "black", fontSize: 10 }]}>Вы достигли 5 ур.</Text>
          </View> :
          <TouchableOpacity onPress={()=>{ handleClick() }} style={{ marginTop: 3, backgroundColor: "white", width: 170, height: 28, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
            <Text style={[styles.text, { color: "black", fontSize: 10 }]}>Улучшить • {price}$</Text>
          </TouchableOpacity>
        }
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

BusinessCardComponent.props = {
  name: PropTypes.string,
  description: PropTypes.string,
  money: PropTypes.string,
  price: PropTypes.int,
  color: PropTypes.string,
  type: PropTypes.string,
  level: PropTypes.int
}

export default BusinessCardComponent;
