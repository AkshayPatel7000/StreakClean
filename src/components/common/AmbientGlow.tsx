import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

interface AmbientGlowProps {
  color?: string;
  top?: number | string;
  size?: number;
  opacity?: number;
}

export const AmbientGlow: React.FC<AmbientGlowProps> = ({
  color = '#B298E7',
  top = '10%',
  size = 320,
  opacity = 0.28,
}) => {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 3400 }),
        withTiming(0.94, { duration: 3400 })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2800 }),
        withTiming(0.85, { duration: 2800 })
      ),
      -1,
      true
    );
  }, [pulseScale, pulseOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          width: size,
          height: size,
          top: top as any,
          marginLeft: -size / 2,
        },
        animatedStyle,
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient
            id="ambientGradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <Stop offset="55%" stopColor={color} stopOpacity={opacity * 0.45} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={size} height={size} fill="url(#ambientGradient)" />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    zIndex: 0,
  },
});
