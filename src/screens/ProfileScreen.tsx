import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { DiceBearAvatar } from '../components/common/DiceBearAvatar';
import { NotificationModal } from '../components/common/NotificationModal';
import {
  Bell,
  Check,
  ChevronRight,
  Citrus,
  Dices,
  Flame,
  HardDrive,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  LockKeyhole,
  Shuffle,
  SlidersHorizontal,
  Trash2,
  Volume2,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Palette } from '../theme/colors';
import { useGameStore } from '../store/useGameStore';
import { HapticService } from '../services/hapticService';
import { formatBytes, PhotoService } from '../services/photoService';
import { RootStackNavigationProp } from '../types/navigation';
import { DICEBEAR_STYLES, getFruitItemByName } from '../utils/fruitIdentity';
import {
  evaluateAllBadges,
  EvaluatedBadge,
  getLevelInfo,
} from '../utils/progression';

interface ProfileScreenProps {
  onBack?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const navigation = useNavigation<RootStackNavigationProp<'Profile'>>();
  const streak = useGameStore((state) => state.streakCount);
  const score = useGameStore((state) => state.score);
  const totalBytesCleaned = useGameStore((state) => state.totalBytesCleaned);
  const photosCleanedCount = useGameStore((state) => state.photosCleanedCount);
  const decksCompletedCount = useGameStore((state) => state.decksCompletedCount);
  const soundAndHaptics = useGameStore((state) => state.soundAndHaptics);
  const toggleHaptics = useGameStore((state) => state.toggleHaptics);
  const dailyReminderTime = useGameStore((state) => state.dailyReminderTime);
  const dailyReminderEnabled = useGameStore(
    (state) => state.dailyReminderEnabled
  );

  const userName = useGameStore((state) => state.userName);
  const avatarSeed = useGameStore((state) => state.avatarSeed);
  const avatarStyle = useGameStore((state) => state.avatarStyle);
  const setAvatarStyle = useGameStore((state) => state.setAvatarStyle);
  const rerollFruitProfile = useGameStore((state) => state.rerollFruitProfile);

  const [cacheMb, setCacheMb] = useState(84);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Dynamic Level Calculation
  const levelInfo = useMemo(() => getLevelInfo(score), [score]);

  // Dynamic Badges & Milestones Evaluation
  const evaluatedBadges = useMemo(() => {
    return evaluateAllBadges({
      photosCleanedCount,
      totalBytesCleaned,
      streakCount: streak,
      decksCompletedCount,
      score,
      level: levelInfo.level,
    });
  }, [
    photosCleanedCount,
    totalBytesCleaned,
    streak,
    decksCompletedCount,
    score,
    levelInfo.level,
  ]);

  const unlockedCount = useMemo(() => {
    return evaluatedBadges.filter((b) => b.isUnlocked).length;
  }, [evaluatedBadges]);

  const fruitInfo = useMemo(() => getFruitItemByName(userName), [userName]);

  // Spring animation values on reroll
  const avatarScale = useSharedValue(1);
  const diceRotation = useSharedValue(0);

  const handleReroll = () => {
    HapticService.impactMedium();
    diceRotation.value = withSequence(
      withTiming(diceRotation.value + 360, { duration: 400 })
    );
    avatarScale.value = withSequence(
      withTiming(1.18, { duration: 150 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    rerollFruitProfile();
  };

  const handleBadgePress = (badge: EvaluatedBadge) => {
    HapticService.selection();
    Alert.alert(
      `${badge.name} • ${badge.tier}`,
      `${badge.lore}\n\n• Requirement: ${badge.detail}\n• Progress: ${badge.progressText}\n• Reward: +${badge.rewardXp} XP ${
        badge.isUnlocked ? '✓ (Achieved)' : '(Locked)'
      }`,
      [{ text: 'Got it', style: 'default' }]
    );
  };

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const diceAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${diceRotation.value}deg` }],
  }));

  const handleGoBack = () => {
    HapticService.selection();
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const clearReviewedPhotos = useGameStore((state) => state.clearReviewedPhotos);

  const handleClearCache = () => {
    HapticService.selection();
    Alert.alert(
      'Clear App Cache & Reset Deck History',
      `Clear ${cacheMb} MB of temporary thumbnail cache and reset reviewed photo history?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear & Reset',
          style: 'destructive',
          onPress: () => {
            setCacheMb(0);
            clearReviewedPhotos();
            PhotoService.resetCursor();
            HapticService.notificationSuccess();
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer applyTopInset applyBottomInset>
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Back to Swipe Arena"
        >
          <View style={styles.backIconWrapper}>
            <ChevronRight size={22} color={Palette.secondary} strokeWidth={2.6} />
          </View>
        </TouchableOpacity>

        <Text style={styles.navTitle}>PROFILE</Text>

        <View style={styles.navButton}>
          <SlidersHorizontal size={18} color={Palette.secondary} strokeWidth={2.4} />
        </View>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero */}
        <View style={styles.heroSection}>
          <Animated.View style={[styles.avatarWrapper, avatarAnimatedStyle]}>
            <DiceBearAvatar
              seed={avatarSeed || userName}
              styleName={avatarStyle}
              size={86}
              borderColor={fruitInfo?.accentColor || Palette.primary}
            />
            {/* Dynamic Level Badge at bottom right */}
            <View style={styles.avatarLevelBadge}>
              <Text style={styles.avatarLevelText}>{levelInfo.level}</Text>
            </View>
            {/* Quick shuffle button on avatar */}
            <TouchableOpacity
              onPress={handleReroll}
              style={styles.avatarShuffleBadge}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Shuffle Fruit Avatar"
            >
              <Animated.View style={diceAnimatedStyle}>
                <Shuffle size={13} color="#FFFFFF" strokeWidth={2.8} />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.heroEyebrow}>
            LEVEL {levelInfo.level} • {levelInfo.title.toUpperCase()}
          </Text>

          {/* Fruit Name Header with Dice Reroll */}
          <TouchableOpacity
            onPress={handleReroll}
            style={styles.nameRow}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Shuffle Fruit Name"
          >
            <Text style={styles.heroTitle}>{userName}</Text>
            <Text style={styles.heroEmoji}>{fruitInfo?.emoji ?? '🥭'}</Text>
            <View style={styles.rerollBtn}>
              <Animated.View style={diceAnimatedStyle}>
                <Dices size={18} color={Palette.eyebrow} strokeWidth={2.4} />
              </Animated.View>
            </View>
          </TouchableOpacity>

          <Text style={styles.heroSubtitle}>
            Tap name or dice button to roll a new fruit identity
          </Text>

          {/* Avatar Style Picker Chips */}
          <View style={styles.stylePickerRow}>
            {DICEBEAR_STYLES.map((st) => {
              const isSelected = avatarStyle === st.id;
              return (
                <TouchableOpacity
                  key={st.id}
                  onPress={() => {
                    HapticService.selection();
                    setAvatarStyle(st.id);
                  }}
                  style={[
                    styles.styleChip,
                    isSelected && styles.styleChipActive,
                  ]}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch avatar style to ${st.name}`}
                >
                  <Text
                    style={[
                      styles.styleChipText,
                      isSelected && styles.styleChipTextActive,
                    ]}
                  >
                    {st.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Dynamic Level Progress Bar */}
          <View style={styles.levelProgressContainer}>
            <View style={styles.levelRow}>
              <Text style={styles.levelXpText}>{score.toLocaleString()} XP</Text>
              <Text style={styles.levelXpTarget}>
                {levelInfo.nextLevelTargetXp.toLocaleString()} XP
              </Text>
            </View>
            <View style={styles.levelBarTrack}>
              <View
                style={[
                  styles.levelBarFill,
                  {
                    width: `${Math.round(levelInfo.progressRatio * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.levelHint}>
              {levelInfo.xpRemaining > 0
                ? `${levelInfo.xpRemaining.toLocaleString()} XP to Level ${
                    levelInfo.level + 1
                  }`
                : 'Maximum Level Reached!'}
            </Text>
          </View>
        </View>

        {/* Dynamic 4 KPI Stats Grid */}
        <View style={styles.kpiGrid}>
          {/* KPI 1: Streak */}
          <View style={styles.kpiCard}>
            <Flame size={20} color={Palette.streak} fill={Palette.streak} />
            <Text style={styles.kpiValue}>{streak}</Text>
            <Text style={styles.kpiLabel}>DAY STREAK</Text>
          </View>

          {/* KPI 2: Reclaimed Space */}
          <View style={styles.kpiCard}>
            <HardDrive size={20} color={Palette.eyebrow} strokeWidth={2.4} />
            <Text style={styles.kpiValue}>
              {formatBytes(totalBytesCleaned).replace(' ', '')}
            </Text>
            <Text style={styles.kpiLabel}>RECLAIMED</Text>
          </View>

          {/* KPI 3: Cleaned count */}
          <View style={styles.kpiCard}>
            <ImageIcon size={20} color={Palette.keepLight} strokeWidth={2.4} />
            <Text style={styles.kpiValue}>{photosCleanedCount}</Text>
            <Text style={styles.kpiLabel}>PHOTOS SWEPT</Text>
          </View>

          {/* KPI 4: Decks Crushed */}
          <View style={styles.kpiCard}>
            <Layers size={20} color="#38BDF8" strokeWidth={2.4} />
            <Text style={styles.kpiValue}>{decksCompletedCount}</Text>
            <Text style={styles.kpiLabel}>DECKS CRUSHED</Text>
          </View>
        </View>

        {/* Dynamic Badges & Milestones */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Badges & milestones</Text>
            <Text style={styles.sectionSubCount}>
              {unlockedCount} / {evaluatedBadges.length} Unlocked
            </Text>
          </View>

          <View style={styles.badgeListContainer}>
            {evaluatedBadges.map((badge, index) => {
              const { icon: IconComponent } = badge;
              const isLocked = !badge.isUnlocked;

              return (
                <TouchableOpacity
                  key={badge.id}
                  onPress={() => handleBadgePress(badge)}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel={`Badge ${badge.name}: ${badge.progressText}`}
                  style={[
                    styles.badgeRow,
                    isLocked && styles.badgeRowLocked,
                    index === evaluatedBadges.length - 1 && styles.badgeRowLast,
                  ]}
                >
                  <View
                    style={[
                      styles.badgeIconWrapper,
                      badge.isUnlocked
                        ? styles.badgeIconWrapperUnlocked
                        : styles.badgeIconWrapperLocked,
                    ]}
                  >
                    <IconComponent
                      size={20}
                      color={badge.isUnlocked ? badge.accentColor : Palette.muted}
                      strokeWidth={2.4}
                    />
                  </View>

                  <View style={styles.badgeTextCol}>
                    <View style={styles.badgeTitleRow}>
                      <Text style={styles.badgeName}>{badge.name}</Text>
                      <View
                        style={[
                          styles.tierTag,
                          badge.isUnlocked && styles.tierTagUnlocked,
                        ]}
                      >
                        <Text
                          style={[
                            styles.tierText,
                            badge.isUnlocked && styles.tierTextUnlocked,
                          ]}
                        >
                          {badge.tier} • +{badge.rewardXp} XP
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.badgeDetail}>{badge.detail}</Text>

                    {/* Real-time Dynamic Progress Bar */}
                    <View style={styles.badgeTrack}>
                      <View
                        style={[
                          styles.badgeFill,
                          badge.isUnlocked
                            ? styles.badgeFillUnlocked
                            : styles.badgeFillLocked,
                          {
                            width: `${Math.round(badge.progressRatio * 100)}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.badgeProgressText}>
                      {badge.progressText}
                    </Text>
                  </View>

                  {badge.isUnlocked ? (
                    <View style={styles.unlockedIconBubble}>
                      <Check size={16} color={Palette.keepLight} strokeWidth={3} />
                    </View>
                  ) : (
                    <LockKeyhole size={16} color={Palette.muted} strokeWidth={2.2} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Settings */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick settings</Text>
          </View>

          <View style={styles.settingsContainer}>
            {/* Setting 1: Fruit Persona */}
            <Pressable
              onPress={() => {
                HapticService.selection();
                Alert.alert(
                  'Fruit Persona',
                  `You are currently known as "${userName}". Roll a new random fruit identity?`,
                  [
                    { text: 'Keep', style: 'cancel' },
                    {
                      text: 'Shuffle New Fruit',
                      onPress: handleReroll,
                    },
                  ]
                );
              }}
              style={styles.settingRow}
            >
              <Citrus size={20} color={Palette.secondary} strokeWidth={2.2} />
              <Text style={styles.settingLabel}>Fruit identity</Text>
              <Text style={styles.settingDetail}>{userName}</Text>
              <ChevronRight size={18} color={Palette.muted} strokeWidth={2.4} />
            </Pressable>

            {/* Setting 2: Daily Reminder & Alerts */}
            <Pressable
              onPress={() => {
                HapticService.selection();
                setIsNotificationModalOpen(true);
              }}
              style={styles.settingRow}
            >
              <Bell size={20} color={Palette.secondary} strokeWidth={2.2} />
              <Text style={styles.settingLabel}>Daily reminder</Text>
              <Text style={styles.settingDetail}>
                {dailyReminderEnabled ? dailyReminderTime : 'Disabled'}
              </Text>
              <ChevronRight size={18} color={Palette.muted} strokeWidth={2.4} />
            </Pressable>

            {/* Setting 3: Sound & Haptics */}
            <View style={styles.settingRow}>
              <Volume2 size={20} color={Palette.secondary} strokeWidth={2.2} />
              <Text style={styles.settingLabel}>Sound & haptics</Text>
              <Switch
                value={soundAndHaptics}
                onValueChange={() => {
                  HapticService.selection();
                  toggleHaptics();
                }}
                trackColor={{ false: Palette.border, true: Palette.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Setting 4: Replay Intro Tutorial */}
            <Pressable
              onPress={() => {
                HapticService.selection();
                navigation.navigate('Intro');
              }}
              style={styles.settingRow}
            >
              <HelpCircle size={20} color={Palette.secondary} strokeWidth={2.2} />
              <Text style={styles.settingLabel}>Replay intro tutorial</Text>
              <ChevronRight size={18} color={Palette.muted} strokeWidth={2.4} />
            </Pressable>

            {/* Setting 5: Clear App Cache */}
            <Pressable
              onPress={handleClearCache}
              style={[styles.settingRow, styles.settingRowLast]}
            >
              <Trash2 size={20} color={Palette.secondary} strokeWidth={2.2} />
              <Text style={styles.settingLabel}>Clear app cache</Text>
              <Text style={styles.settingDetail}>{cacheMb} MB</Text>
              <ChevronRight size={18} color={Palette.muted} strokeWidth={2.4} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Notification Alerts Sheet Modal */}
      <NotificationModal
        visible={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bg,
  },
  navHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIconWrapper: {
    transform: [{ rotate: '180deg' }],
  },
  navTitle: {
    color: Palette.secondary,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarLevelBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.primary,
    borderWidth: 2.5,
    borderColor: Palette.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLevelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  avatarShuffleBadge: {
    position: 'absolute',
    left: -4,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.surface,
    borderWidth: 2,
    borderColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.eyebrow,
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroEmoji: {
    fontSize: 22,
  },
  rerollBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSubtitle: {
    fontSize: 11,
    color: Palette.muted,
    fontWeight: '600',
    marginBottom: 14,
  },
  stylePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  styleChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  styleChipActive: {
    backgroundColor: 'rgba(178, 152, 231, 0.22)',
    borderColor: Palette.primary,
  },
  styleChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.muted,
  },
  styleChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  levelProgressContainer: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  levelRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  levelXpText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  levelXpTarget: {
    color: Palette.muted,
    fontSize: 10.5,
    fontWeight: '800',
  },
  levelBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.border,
    overflow: 'hidden',
  },
  levelBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Palette.primary,
  },
  levelHint: {
    marginTop: 6,
    fontSize: 10,
    color: Palette.eyebrow,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  kpiCard: {
    width: '48%',
    flexGrow: 1,
    paddingVertical: 15,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  kpiValue: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 8,
  },
  kpiLabel: {
    marginTop: 4,
    color: Palette.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sectionWrap: {
    marginTop: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionSubCount: {
    color: Palette.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  badgeListContainer: {
    borderRadius: 20,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderColor: Palette.border,
  },
  badgeRowLast: {
    borderBottomWidth: 0,
  },
  badgeRowLocked: {
    opacity: 0.65,
  },
  badgeIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIconWrapperUnlocked: {
    backgroundColor: 'rgba(178, 152, 231, 0.16)',
  },
  badgeIconWrapperLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  badgeTextCol: {
    flex: 1,
    gap: 3,
  },
  badgeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  badgeName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tierTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  tierTagUnlocked: {
    borderColor: 'rgba(178, 152, 231, 0.45)',
    backgroundColor: 'rgba(178, 152, 231, 0.12)',
  },
  tierText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Palette.muted,
    letterSpacing: 0.4,
  },
  tierTextUnlocked: {
    color: Palette.eyebrow,
  },
  badgeDetail: {
    fontSize: 10,
    color: Palette.muted,
  },
  badgeTrack: {
    width: '100%',
    height: 3.5,
    borderRadius: 2,
    backgroundColor: Palette.border,
    marginTop: 4,
    overflow: 'hidden',
  },
  badgeFill: {
    height: '100%',
    borderRadius: 2,
  },
  badgeFillUnlocked: {
    backgroundColor: Palette.keepLight,
  },
  badgeFillLocked: {
    backgroundColor: Palette.primary,
  },
  badgeProgressText: {
    marginTop: 3,
    fontSize: 8.5,
    color: Palette.eyebrow,
    fontWeight: '700',
  },
  unlockedIconBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(34, 197, 94, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsContainer: {
    borderRadius: 20,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Palette.border,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingDetail: {
    fontSize: 11,
    color: Palette.muted,
    fontWeight: '600',
  },
});
