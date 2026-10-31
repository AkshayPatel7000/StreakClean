import React, { useCallback, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { BrandMark } from '../components/common/BrandMark';
import { AmbientGlow } from '../components/common/AmbientGlow';
import { ScreenContainer, useDeviceInsets } from '../components/common/ScreenContainer';
import { Palette } from '../theme/colors';
import { useGameStore } from '../store/useGameStore';
import { PermissionService } from '../services/permissionService';
import { RootStackNavigationProp } from '../types/navigation';

interface SplashScreenProps {
  onDone?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDone }) => {
  const navigation = useNavigation<RootStackNavigationProp<'Splash'>>();
  const { bottomNavHeight } = useDeviceInsets();
  const hasCompletedIntro = useGameStore((state) => state.hasCompletedIntro);

  // Entrance animations
  const textOpacity = useSharedValue(0);
  const textScale = useSharedValue(0.92);

  useEffect(() => {
    textOpacity.value = withDelay(250, withTiming(1, { duration: 600 }));
    textScale.value = withDelay(250, withSpring(1, { damping: 14, stiffness: 180 }));
  }, [textOpacity, textScale]);

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ scale: textScale.value }],
  }));

  const handleProceed = useCallback(async () => {
    if (onDone) {
      onDone();
      return;
    }
    if (!navigation || !navigation.replace) return;

    // 1. If intro was never completed, route to Intro screen
    if (!hasCompletedIntro) {
      navigation.replace('Intro');
      return;
    }

    // 2. If intro is completed, check if permissions are already granted
    const photoGranted = await PermissionService.checkPhotoPermission();
    if (!photoGranted) {
      navigation.replace('Permissions');
      return;
    }

    // 3. Intro done & permissions granted -> Jump straight into Swipe deck!
    navigation.replace('Swipe');
  }, [hasCompletedIntro, onDone, navigation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleProceed();
    }, 1800);
    return () => clearTimeout(timer);
  }, [handleProceed]);

  return (
    <ScreenContainer applyTopInset applyBottomInset={false}>
      <Pressable style={styles.container} onPress={handleProceed}>
        <AmbientGlow color={Palette.primary} top="18%" size={340} opacity={0.3} />

        <View style={styles.content}>
          <BrandMark />

          <Animated.View style={[styles.typeBlock, textAnimatedStyle]}>
            <Text style={styles.wordmark}>SWIPECLEAN</Text>
            <Text style={styles.tagline}>DECLUTTER. SCORE. RECLAIM.</Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.statusRow,
            { bottom: bottomNavHeight + 16 },
            textAnimatedStyle,
          ]}
        >
          <View style={styles.statusDivider} />
          <Text style={styles.statusText}>YOUR PHOTOS. YOUR DEVICE.</Text>
          <View style={styles.statusDivider} />
        </Animated.View>
      </Pressable>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 32,
  },
  typeBlock: {
    alignItems: 'center',
  },
  wordmark: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4.5,
  },
  tagline: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: '700',
    color: Palette.secondary,
    letterSpacing: 2.4,
  },
  statusRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDivider: {
    width: 28,
    height: 1,
    backgroundColor: Palette.border,
  },
  statusText: {
    color: Palette.muted,
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
});
