import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Flame } from 'lucide-react-native';
import { Palette } from '../../theme/colors';
import { Layout } from '../../theme/layout';
import { HapticService } from '../../services/hapticService';
import { DiceBearAvatar } from '../common/DiceBearAvatar';
import { useGameStore } from '../../store/useGameStore';

interface TopHudProps {
  streak: number;
  currentCardIndex: number;
  totalCards: number;
  xp: number;
  onPressProfile: () => void;
}

export const TopHud: React.FC<TopHudProps> = ({
  streak,
  currentCardIndex,
  totalCards,
  xp,
  onPressProfile,
}) => {
  const userName = useGameStore((state) => state.userName);
  const avatarSeed = useGameStore((state) => state.avatarSeed);
  const avatarStyle = useGameStore((state) => state.avatarStyle);
  const progressRatio = totalCards > 0 ? Math.min(1, currentCardIndex / totalCards) : 0;

  // Animated progress bar fill
  const progressPercent = useSharedValue(progressRatio * 100);
  useEffect(() => {
    progressPercent.value = withTiming(progressRatio * 100, { duration: 240 });
  }, [progressRatio, progressPercent]);

  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${Math.round(progressPercent.value)}%`,
  }));

  // Flame continuous pulse
  const flameScale = useSharedValue(1);
  useEffect(() => {
    flameScale.value = withRepeat(
      withSequence(
        withTiming(1.14, { duration: 750 }),
        withTiming(0.96, { duration: 750 })
      ),
      -1,
      true
    );
  }, [flameScale]);

  const flameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  // XP bounce on score update
  const xpPop = useSharedValue(1);
  useEffect(() => {
    xpPop.value = withSequence(
      withTiming(1.15, { duration: 140 }),
      withSpring(1, { damping: 10, stiffness: 220 })
    );
  }, [xp, xpPop]);

  const xpPillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: xpPop.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Streak pill */}
      <View style={[styles.pill, styles.streakPill]}>
        <Animated.View style={flameAnimatedStyle}>
          <Flame size={17} color={Palette.streak} fill={Palette.streak} />
        </Animated.View>
        <Text style={styles.streakText}>{streak}</Text>
      </View>

      {/* Progress center */}
      <View style={styles.progressCenter}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressCount}>{currentCardIndex}</Text>
          <Text style={styles.progressTotal}> / {totalCards}</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[styles.progressBarFill, progressBarAnimatedStyle]}
          />
        </View>
      </View>

      {/* XP badge pill (opens profile) */}
      <Animated.View style={xpPillAnimatedStyle}>
        <Pressable
          onPress={() => {
            HapticService.selection();
            onPressProfile();
          }}
          style={({ pressed }) => [
            styles.pill,
            styles.xpPill,
            pressed && styles.pressed,
          ]}
        >
          <DiceBearAvatar
            seed={avatarSeed || userName}
            styleName={avatarStyle}
            size={22}
            showBorder={true}
            borderColor={Palette.primary}
          />
          <Text style={styles.xpText}>{xp.toLocaleString()}</Text>
          <Text style={styles.xpUnit}>XP</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  pill: {
    height: 38,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Layout.radius.pill,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  streakPill: {
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  streakText: {
    color: Palette.streak,
    fontWeight: '800',
    fontSize: 13,
  },
  progressCenter: {
    alignItems: 'center',
    minWidth: 90,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  progressCount: {
    color: Palette.text,
    fontSize: 14,
    fontWeight: '800',
  },
  progressTotal: {
    color: Palette.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarTrack: {
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.border,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: Palette.primary,
  },
  xpPill: {
    borderColor: 'rgba(178, 152, 231, 0.25)',
  },
  xpText: {
    color: Palette.text,
    fontWeight: '800',
    fontSize: 12,
  },
  xpUnit: {
    color: Palette.eyebrow,
    fontSize: 9,
    fontWeight: '900',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.85,
  },
});
