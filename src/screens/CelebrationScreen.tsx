import React, { useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronRight, Flame, Zap } from 'lucide-react-native';
import { Confetti } from '../components/celebration/Confetti';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { ScreenContainer, useDeviceInsets } from '../components/common/ScreenContainer';
import { Palette } from '../theme/colors';
import { Layout } from '../theme/layout';
import { useGameStore } from '../store/useGameStore';
import { HapticService } from '../services/hapticService';
import { formatBytes } from '../services/photoService';
import { getLevelInfo } from '../utils/progression';
import { NotificationService } from '../services/notificationService';
import {
  RootStackNavigationProp,
  RootStackScreenProps,
} from '../types/navigation';

interface CelebrationScreenProps {
  xpGained?: number;
  bytesFreed?: number;
  onNextDeck?: () => void;
  onViewProfile?: () => void;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({
  xpGained: propXp,
  bytesFreed: propBytes,
  onNextDeck,
  onViewProfile,
}) => {
  const navigation = useNavigation<RootStackNavigationProp<'Celebration'>>();
  const route = useRoute<RootStackScreenProps<'Celebration'>['route']>();
  const { isCompactScreen } = useDeviceInsets();
  const streak = useGameStore((state) => state.streakCount);
  const userName = useGameStore((state) => state.userName);
  const score = useGameStore((state) => state.score);

  const levelInfo = useMemo(() => getLevelInfo(score), [score]);

  const xpGained = route?.params?.xpGained ?? propXp ?? 120;
  const bytesFreed = route?.params?.bytesFreed ?? propBytes ?? 48.6 * 1024 * 1024;

  // Entrance spring animations
  const iconScale = useSharedValue(0.3);
  const cardScale = useSharedValue(0.85);
  const cardOpacity = useSharedValue(0);
  const zapPulse = useSharedValue(1);

  useEffect(() => {
    // Pop celebration icon with spring
    iconScale.value = withSpring(1, { damping: 10, stiffness: 180 });

    // Fade and spring card with slight delay
    cardScale.value = withDelay(180, withSpring(1, { damping: 12, stiffness: 200 }));
    cardOpacity.value = withDelay(180, withTiming(1, { duration: 250 }));

    // Continuous gentle pulse on the Zap icon
    zapPulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200 }),
        withTiming(0.96, { duration: 1200 })
      ),
      -1,
      true
    );

    // Notification toast announcement
    const timer = setTimeout(() => {
      NotificationService.showNotification({
        type: 'level',
        title: `⚡ Level ${levelInfo.level} Progress!`,
        message: `+${xpGained} XP awarded to ${userName}. Next rank: ${levelInfo.title}!`,
        durationMs: 4000,
      });
    }, 700);

    return () => clearTimeout(timer);
  }, [iconScale, cardScale, cardOpacity, zapPulse, levelInfo.level, levelInfo.title, xpGained, userName]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value * zapPulse.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const handleNext = () => {
    HapticService.selection();
    if (onNextDeck) {
      onNextDeck();
    } else if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Swipe' }],
      });
    }
  };

  const handleProfile = () => {
    HapticService.selection();
    if (onViewProfile) {
      onViewProfile();
    } else if (navigation) {
      navigation.navigate('Profile');
    }
  };

  return (
    <ScreenContainer applyTopInset applyBottomInset>
      {/* Confetti Explosion Animation */}
      <Confetti />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isCompactScreen && styles.scrollContentCompact,
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.centerCol}>
          {/* Glowing Zap Icon with spring entrance */}
          <Animated.View
            style={[
              styles.celebrationIcon,
              isCompactScreen && styles.celebrationIconCompact,
              iconAnimatedStyle,
            ]}
          >
            <Zap
              size={isCompactScreen ? 30 : 38}
              color="#FBBF24"
              fill="#FBBF24"
            />
          </Animated.View>

          <Text style={styles.eyebrow}>
            DECK CRUSHED • {userName.toUpperCase()}
          </Text>
          <Text style={[styles.title, isCompactScreen && styles.titleCompact]}>
            Clean sweep!
          </Text>
          <Text style={styles.lead}>
            Your camera roll is lighter and your streak is stronger.
          </Text>

          {/* Reward Card with spring entrance */}
          <Animated.View
            style={[
              styles.rewardCard,
              isCompactScreen && styles.rewardCardCompact,
              cardAnimatedStyle,
            ]}
          >
            <View style={styles.rewardCol}>
              <Text style={styles.rewardLabel}>XP EARNED</Text>
              <Text style={styles.rewardValue}>
                +{xpGained} <Text style={styles.rewardUnit}>XP</Text>
              </Text>
            </View>

            <View style={styles.rewardDivider} />

            <View style={styles.rewardCol}>
              <Text style={styles.rewardLabel}>SPACE FREED</Text>
              <Text style={styles.rewardValue}>
                +{formatBytes(bytesFreed)}
              </Text>
            </View>
          </Animated.View>

          {/* Streak Preservation Banner */}
          <View
            style={[
              styles.streakBanner,
              isCompactScreen && styles.streakBannerCompact,
            ]}
          >
            <View style={styles.streakIconBubble}>
              <Flame size={24} color={Palette.streak} fill={Palette.streak} />
            </View>
            <View style={styles.streakTextCol}>
              <Text style={styles.streakTitle}>
                Day {streak} Streak Preserved!
              </Text>
              <Text style={styles.streakSubtitle}>
                Come back tomorrow to keep it alive.
              </Text>
            </View>
          </View>

          {/* Dynamic Level & XP Progress Banner */}
          <View
            style={[
              styles.levelBanner,
              isCompactScreen && styles.levelBannerCompact,
            ]}
          >
            <View style={styles.levelBannerHeader}>
              <View style={styles.levelBadgeBubble}>
                <Text style={styles.levelBadgeNumber}>{levelInfo.level}</Text>
              </View>
              <View style={styles.levelTextCol}>
                <Text style={styles.levelBannerTitle}>
                  {levelInfo.title}
                </Text>
                <Text style={styles.levelBannerSubtitle}>
                  {score.toLocaleString()} / {levelInfo.nextLevelTargetXp.toLocaleString()} XP
                </Text>
              </View>
            </View>
            <View style={styles.levelTrack}>
              <View
                style={[
                  styles.levelFill,
                  { width: `${Math.round(levelInfo.progressRatio * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.levelRemainingHint}>
              {levelInfo.xpRemaining > 0
                ? `${levelInfo.xpRemaining.toLocaleString()} XP to Level ${
                    levelInfo.level + 1
                  }`
                : 'Maximum Level Achieved!'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={[styles.footer, isCompactScreen && styles.footerCompact]}>
        <PrimaryButton
          label="Next Deck"
          onPress={handleNext}
          icon={<ChevronRight size={20} color="#FFFFFF" strokeWidth={2.6} />}
        />

        <TouchableOpacity
          onPress={handleProfile}
          style={styles.profileTextButton}
          accessibilityRole="button"
        >
          <Text style={styles.profileButtonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bg,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
  },
  scrollContentCompact: {
    paddingTop: 18,
    paddingBottom: 8,
  },
  centerCol: {
    width: '100%',
    alignItems: 'center',
  },
  celebrationIcon: {
    width: 78,
    height: 78,
    borderRadius: 27,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.streak,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 8,
    marginBottom: 20,
  },
  celebrationIconCompact: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginBottom: 10,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.streak,
    letterSpacing: 2.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  titleCompact: {
    fontSize: 30,
    marginBottom: 6,
  },
  lead: {
    fontSize: 13.5,
    color: Palette.secondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
  },
  rewardCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 28,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: Layout.radius.card,
    backgroundColor: 'rgba(26, 28, 36, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(196, 177, 238, 0.22)',
  },
  rewardCardCompact: {
    marginTop: 16,
    paddingVertical: 14,
  },
  rewardCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  rewardLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Palette.muted,
    letterSpacing: 1.4,
  },
  rewardValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.eyebrow,
  },
  rewardUnit: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.muted,
  },
  rewardDivider: {
    width: 1,
    height: 38,
    backgroundColor: Palette.border,
  },
  streakBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.18)',
  },
  streakBannerCompact: {
    marginTop: 10,
    padding: 10,
  },
  streakIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTextCol: {
    flex: 1,
    gap: 3,
  },
  streakTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  streakSubtitle: {
    fontSize: 11,
    color: Palette.muted,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  footerCompact: {
    paddingBottom: 4,
  },
  profileTextButton: {
    marginTop: 12,
    padding: 10,
  },
  profileButtonText: {
    color: Palette.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  levelBanner: {
    width: '100%',
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(178, 152, 231, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(178, 152, 231, 0.2)',
  },
  levelBannerCompact: {
    marginTop: 10,
    padding: 10,
  },
  levelBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  levelBadgeBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  levelTextCol: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  levelBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  levelBannerSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Palette.muted,
  },
  levelTrack: {
    width: '100%',
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.border,
    overflow: 'hidden',
  },
  levelFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Palette.primary,
  },
  levelRemainingHint: {
    marginTop: 6,
    fontSize: 9.5,
    color: Palette.eyebrow,
    fontWeight: '700',
    textAlign: 'right',
  },
});
