import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';
import { Palette } from '../../theme/colors';

interface BrandMarkProps {
  compact?: boolean;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ compact = false }) => {
  const iconSize = compact ? 18 : 34;

  const floatY = useSharedValue(0);
  const backTilt = useSharedValue(-12);
  const frontScale = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1800 }),
        withTiming(2, { duration: 1800 })
      ),
      -1,
      true
    );

    backTilt.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 2200 }),
        withTiming(-10, { duration: 2200 })
      ),
      -1,
      true
    );

    frontScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1600 }),
        withTiming(0.98, { duration: 1600 })
      ),
      -1,
      true
    );
  }, [floatY, backTilt, frontScale]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const backCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${backTilt.value.toFixed(1)}deg` }],
  }));

  const frontCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: frontScale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        compact ? styles.containerCompact : styles.containerRegular,
        containerAnimatedStyle,
      ]}
    >
      {/* Back tilted card */}
      <Animated.View
        style={[
          styles.backCard,
          compact ? styles.backCardCompact : styles.backCardRegular,
          backCardAnimatedStyle,
        ]}
      />

      {/* Front active card */}
      <Animated.View
        style={[
          styles.frontCard,
          compact ? styles.frontCardCompact : styles.frontCardRegular,
          frontCardAnimatedStyle,
        ]}
      >
        <Sparkles size={iconSize} color="#FFFFFF" strokeWidth={2.6} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerRegular: {
    width: 96,
    height: 110,
  },
  containerCompact: {
    width: 38,
    height: 44,
  },
  backCard: {
    position: 'absolute',
    left: 2,
    top: 2,
    transform: [{ rotate: '-12deg' }],
    backgroundColor: 'rgba(178, 152, 231, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(196, 177, 238, 0.35)',
  },
  backCardRegular: {
    width: 76,
    height: 94,
    borderRadius: 22,
  },
  backCardCompact: {
    width: 30,
    height: 38,
    borderRadius: 9,
  },
  frontCard: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  frontCardRegular: {
    width: 76,
    height: 94,
    borderRadius: 22,
  },
  frontCardCompact: {
    width: 30,
    height: 38,
    borderRadius: 9,
  },
});
