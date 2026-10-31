import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Check, ChevronRight, Trash2, Trophy } from 'lucide-react-native';
import { BrandMark } from '../components/common/BrandMark';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ScreenContainer, useDeviceInsets } from '../components/common/ScreenContainer';
import { Palette } from '../theme/colors';
import { HapticService } from '../services/hapticService';
import { useGameStore } from '../store/useGameStore';
import { PermissionService } from '../services/permissionService';
import { RootStackNavigationProp } from '../types/navigation';

interface IntroScreenProps {
  onComplete?: () => void;
}

const INTRO_STEPS = [
  {
    eyebrow: 'KEEP THE GOOD',
    title: 'Swipe Right\nto Keep',
    copy: 'The moments you love stay exactly where they are.',
    Icon: Check,
    tone: 'keep' as const,
    direction: 'RIGHT',
    color: Palette.keepLight,
  },
  {
    eyebrow: 'STAGE THE REST',
    title: 'Swipe Left\nto Trash',
    copy: 'Nothing is deleted instantly. You review every choice first.',
    Icon: Trash2,
    tone: 'trash' as const,
    direction: 'LEFT',
    color: Palette.trashLight,
  },
  {
    eyebrow: 'BUILD MOMENTUM',
    title: 'Gamify Your\nStorage',
    copy: 'Earn XP, protect your streak, and climb storage tiers.',
    Icon: Trophy,
    tone: 'streak' as const,
    direction: 'LEVEL UP',
    color: Palette.streak,
  },
];

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const navigation = useNavigation<RootStackNavigationProp<'Intro'>>();
  const { isCompactScreen } = useDeviceInsets();
  const setHasCompletedIntro = useGameStore((state) => state.setHasCompletedIntro);
  const [step, setStep] = useState(0);
  const currentItem = INTRO_STEPS[step];
  const { Icon } = currentItem;

  // Floating idle motion and spring step transitions
  const floatY = useSharedValue(0);
  const cardRotate = useSharedValue(6);
  const cardX = useSharedValue(12);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1800 }),
        withTiming(4, { duration: 1800 })
      ),
      -1,
      true
    );
  }, [floatY]);

  useEffect(() => {
    if (currentItem.tone === 'keep') {
      cardRotate.value = withSpring(7, { damping: 14, stiffness: 180 });
      cardX.value = withSpring(16, { damping: 14, stiffness: 180 });
    } else if (currentItem.tone === 'trash') {
      cardRotate.value = withSpring(-7, { damping: 14, stiffness: 180 });
      cardX.value = withSpring(-16, { damping: 14, stiffness: 180 });
    } else {
      cardRotate.value = withSpring(0, { damping: 14, stiffness: 180 });
      cardX.value = withSpring(0, { damping: 14, stiffness: 180 });
    }
  }, [currentItem.tone, cardRotate, cardX]);

  const demoCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${cardRotate.value.toFixed(1)}deg` },
      { translateX: cardX.value },
      { translateY: floatY.value },
    ],
  }));

  const handleFinish = async () => {
    HapticService.selection();
    setHasCompletedIntro(true);

    if (onComplete) {
      onComplete();
    } else if (navigation && navigation.replace) {
      const photoGranted = await PermissionService.checkPhotoPermission();
      if (photoGranted) {
        navigation.replace('Swipe');
      } else {
        navigation.replace('Permissions');
      }
    }
  };

  const handleNext = () => {
    HapticService.selection();
    if (step === INTRO_STEPS.length - 1) {
      handleFinish();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <ScreenContainer applyTopInset applyBottomInset>
      {/* Top Header */}
      <View style={[styles.header, isCompactScreen && styles.headerCompact]}>
        <BrandMark compact />
        <TouchableOpacity
          onPress={handleFinish}
          style={styles.skipButton}
          accessibilityRole="button"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Gesture Demonstration Graphic */}
        <View
          style={[
            styles.gestureContainer,
            isCompactScreen && styles.gestureContainerCompact,
          ]}
        >
          {/* Ghost background card */}
          <View style={styles.ghostCard} />

          {/* Interactive foreground demonstration card */}
          <Animated.View
            style={[
              styles.demoCard,
              demoCardAnimatedStyle,
            ]}
          >
            <View
              style={[
                styles.iconBubble,
                isCompactScreen && styles.iconBubbleCompact,
              ]}
            >
              <Icon
                size={isCompactScreen ? 36 : 46}
                color={currentItem.color}
                strokeWidth={2.4}
              />
            </View>

            <View style={[styles.cardLine, styles.cardLineShort]} />
            <View style={styles.cardLine} />

            <View
              style={[
                styles.directionPill,
                { borderColor: currentItem.color },
              ]}
            >
              <Text
                style={[
                  styles.directionPillText,
                  { color: currentItem.color },
                ]}
              >
                {currentItem.direction}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Copy Text */}
        <View style={styles.copyBlock}>
          <Text style={[styles.eyebrow, { color: currentItem.color }]}>
            {currentItem.eyebrow}
          </Text>
          <Text style={[styles.title, isCompactScreen && styles.titleCompact]}>
            {currentItem.title}
          </Text>
          <Text style={styles.copy}>{currentItem.copy}</Text>
        </View>
      </ScrollView>

      {/* Footer Controls */}
      <View style={[styles.footer, isCompactScreen && styles.footerCompact]}>
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {INTRO_STEPS.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => {
                HapticService.selection();
                setStep(index);
              }}
              style={[
                styles.paginationDot,
                index === step && styles.paginationDotActive,
              ]}
              accessibilityLabel={`Go to step ${index + 1}`}
            />
          ))}
        </View>

        {/* Action Button */}
        <PrimaryButton
          label={step === INTRO_STEPS.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          icon={<ChevronRight size={20} color="#FFFFFF" strokeWidth={2.6} />}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bg,
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  headerCompact: {
    height: 52,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: Palette.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  gestureContainer: {
    position: 'relative',
    width: 190,
    height: 260,
    marginBottom: 42,
  },
  gestureContainerCompact: {
    width: 160,
    height: 200,
    marginBottom: 18,
  },
  ghostCard: {
    position: 'absolute',
    inset: 0,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.card,
    transform: [{ rotate: '-8deg' }, { translateX: -16 }, { translateY: 8 }],
    opacity: 0.6,
  },
  demoCard: {
    position: 'absolute',
    inset: 0,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 8,
  },
  demoCardKeep: {
    transform: [{ rotate: '6deg' }, { translateX: 12 }],
  },
  demoCardTrash: {
    transform: [{ rotate: '-6deg' }, { translateX: -12 }],
  },
  demoCardStreak: {
    transform: [{ rotate: '0deg' }, { translateY: -4 }],
  },
  iconBubble: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconBubbleCompact: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 14,
  },
  cardLine: {
    width: 110,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(148, 163, 184, 0.14)',
    marginTop: 8,
  },
  cardLineShort: {
    width: 70,
  },
  directionPill: {
    marginTop: 20,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    transform: [{ rotate: '-5deg' }],
  },
  directionPillText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  copyBlock: {
    alignItems: 'center',
    textAlign: 'center',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.2,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  titleCompact: {
    fontSize: 27,
    lineHeight: 31,
    marginBottom: 8,
  },
  copy: {
    color: Palette.secondary,
    fontSize: 14.5,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  footerCompact: {
    paddingBottom: 4,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  paginationDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Palette.border,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: Palette.primary,
  },
});
