import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Check, Trash2 } from 'lucide-react-native';
import { Palette } from '../../theme/colors';

interface SwipeStampProps {
  type: 'keep' | 'trash';
  opacityVal: SharedValue<number>;
}

export const SwipeStamp: React.FC<SwipeStampProps> = ({ type, opacityVal }) => {
  const isKeep = type === 'keep';
  const color = isKeep ? Palette.keepLight : Palette.trashLight;

  const animatedStyle = useAnimatedStyle(() => {
    // Dynamic pop: scales from 0.76 up to 1.06 as user swipes with intent
    const scale = 0.76 + opacityVal.value * 0.3;
    const baseAngle = isKeep ? -12 : 12;
    const dynamicAngle =
      baseAngle + (1 - Math.min(1, opacityVal.value)) * (isKeep ? 6 : -6);

    return {
      opacity: opacityVal.value,
      transform: [
        { rotate: `${dynamicAngle.toFixed(1)}deg` },
        { scale },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.stamp,
        isKeep ? styles.keepStamp : styles.trashStamp,
        { borderColor: color },
        animatedStyle,
      ]}
    >
      {isKeep ? (
        <Check size={20} color={color} strokeWidth={3} />
      ) : (
        <Trash2 size={20} color={color} strokeWidth={2.8} />
      )}
      <Text style={[styles.stampText, { color }]}>
        {isKeep ? 'KEEP' : 'TRASH'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  stamp: {
    position: 'absolute',
    top: 36,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 2.8,
    backgroundColor: 'rgba(15, 16, 21, 0.65)',
  },
  keepStamp: {
    left: 20,
  },
  trashStamp: {
    right: 20,
  },
  stampText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
