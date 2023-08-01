import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import PropTypes from 'prop-types'
import { colors } from '../constants';

const Button = (props) => {
  const { text, onPress } = props;

  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", width: 220, height: 50, borderRadius: 30 }}>
      <Text style={{ fontFamily: "mt-bold", color: "white" }}>{text}</Text>
    </TouchableOpacity>
  )
}

Button.PropTypes = {
  text: PropTypes.string
}

export default Button;
