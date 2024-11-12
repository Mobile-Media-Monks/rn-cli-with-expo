import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {DeviceMotion, DeviceMotionMeasurement} from 'expo-sensors';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('screen');
const circleSize = 120;

function App(): React.JSX.Element {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onDeviceMotionChange = (event: DeviceMotionMeasurement) => {
    const {x, y} = event.accelerationIncludingGravity;

    const maxX = (width - circleSize) / 2;
    const maxY = (height - circleSize) / 2;

    translateX.value = withTiming(Math.max(-maxX, Math.min(maxX, x * 200)), {
      easing: Easing.linear,
      duration: 1750,
    });
    translateY.value = withTiming(Math.max(-maxY, Math.min(maxY, y * 200)), {
      easing: Easing.linear,
      duration: 1750,
    });
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
  }));

  useEffect(() => {
    DeviceMotion.addListener(onDeviceMotionChange);
    return () => {
      DeviceMotion.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyles]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    height: 120,
    width: 120,
    backgroundColor: '#b58df1',
    borderRadius: 500,
  },
});

export default App;
