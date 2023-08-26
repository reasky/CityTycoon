import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { colors, gStyle } from '../constants';
import PropTypes from 'prop-types';
import { AntDesign, Entypo } from "@expo/vector-icons";

function SnackBar(props) {
  const windowHeight = Dimensions.get("window").height;
  const [status, setStatus] = useState(null);
  const popAnim = useRef(new Animated.Value(windowHeight * -1)).current;

  const { header, message, icon } = props;

  const color = "#ffff";

  const popIn = () => {
    Animated.timing(popAnim, {
      toValue: 10,
      duration: 300,
      useNativeDriver: true,
    }).start(popOut());
  };

  const popOut = () => {
    setTimeout(() => {
      Animated.timing(popAnim, {
        toValue: windowHeight * -1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 2000);
  };

  const instantPopOut = () => {
    Animated.timing(popAnim, {
      toValue: windowHeight * -1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    popIn();
  }, []);

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY: popAnim }],
        },
      ]}
    >
      <View style={styles.toastRow}>
        {icon}
        <View style={styles.toastText}>
          <Text style={{ fontWeight: "bold", fontSize: 15, color: "white", paddingTop: 6 }}>
            {header}
          </Text>
          <Text style={{ fontSize: 12, color: "white", paddingBottom: 7 }}>
            {message}
          </Text>
        </View>
        <TouchableOpacity onPress={instantPopOut}>
          <Entypo name="cross" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

SnackBar.defaultProps = {
  icon: null,
  header: 'Ошибка!',
  text: 'Произошла ошибка при показе информационного сообщения.'
};

SnackBar.propTypes = {
  // required
  icon: PropTypes.element,
  header: PropTypes.stirng,
  text: PropTypes.string,
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastRow: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  toastText: {
    width: "70%",
    padding: 2,
  },
});

export default SnackBar;
