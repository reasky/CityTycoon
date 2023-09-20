import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const CountdownTimer = (props) => {
  const { reFill, timePay } = props;

  const initialTime = timePay;
  const [remainingTime, setRemainingTime] = useState(initialTime);

  useEffect(()=>{
    setRemainingTime(timePay)
  },[initialTime])

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime(remainingTime - 1);
      } else {
        setRemainingTime(initialTime);
        reFill()
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [remainingTime, initialTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / timePay);
    const secondsLeft = seconds % timePay;
    return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
  };

  return (
    <View>
      <Text style={styles.text}>{formatTime(remainingTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "mt-bold",
  }
})

export default CountdownTimer;
