import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ImageStyle,
  Pressable,
  StyleSheet,
  Text,
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
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Check,
  ChevronRight,
  Flame,
  HardDrive,
  Sparkles,
  Trash2,
} from 'lucide-react-native';
import { ScreenContainer, useDeviceInsets } from '../components/common/ScreenContainer';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { AmbientGlow } from '../components/common/AmbientGlow';
import { Photo } from '../types/photo';
import { PhotoService } from '../services/photoService';
import { HapticService } from '../services/hapticService';
import { Palette } from '../theme/colors';
import { Layout } from '../theme/layout';
import { useGameStore } from '../store/useGameStore';
import {
  RootStackNavigationProp,
  RootStackScreenProps,
} from '../types/navigation';

interface AnimatedThumbnailProps {
  item: Photo;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const AnimatedThumbnail: React.FC<AnimatedThumbnailProps> = ({
  item,
  isSelected,
  onToggle,
}) => {
  const badgeScale = useSharedValue(isSelected ? 1 : 0.6);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    badgeScale.value = withSpring(isSelected ? 1 : 0.6, {
      damping: 12,
      stiffness: 220,
    });
  }, [isSelected, badgeScale]);

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <Animated.View style={[styles.thumbnailWrap, containerAnimatedStyle]}>
      <Pressable
        onPressIn={() => {
          pressScale.value = withSpring(0.93, { damping: 14, stiffness: 240 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 12, stiffness: 220 });
        }}
        onPress={() => onToggle(item.id)}
        style={[styles.thumbnail, isSelected && styles.thumbnailSelected]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.thumbnailImage as ImageStyle}
          resizeMode="cover"
        />
        <Animated.View
          style={[
            styles.checkBadge,
            isSelected && styles.checkBadgeActive,
            badgeAnimatedStyle,
          ]}
        >
          {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

interface BatchReviewScreenProps {
  stagedPhotos?: Photo[];
  onFinishDelete?: (deletedCount: number, bytesFreed: number) => void;
  onKeepAll?: () => void;
}

export const BatchReviewScreen: React.FC<BatchReviewScreenProps> = ({
  stagedPhotos: propPhotos,
  onFinishDelete,
  onKeepAll,
}) => {
  const navigation = useNavigation<RootStackNavigationProp<'BatchReview'>>();
  const route = useRoute<RootStackScreenProps<'BatchReview'>['route']>();
  const { isCompactScreen } = useDeviceInsets();

  const recordDeckCompletion = useGameStore(
    (state) => state.recordDeckCompletion
  );

  // Staged photos passed from the swipe deck
  const photos = useMemo(() => {
    return route?.params?.stagedPhotos ?? propPhotos ?? [];
  }, [route?.params?.stagedPhotos, propPhotos]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(photos.map((p) => p.id))
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const chosenPhotos = useMemo(() => {
    return photos.filter((p) => selectedIds.has(p.id));
  }, [photos, selectedIds]);

  const totalBytesFreed = useMemo(() => {
    return chosenPhotos.reduce((sum, p) => sum + p.sizeBytes, 0);
  }, [chosenPhotos]);

  const totalMb = (totalBytesFreed / (1024 * 1024)).toFixed(1);

  const togglePhoto = (id: string) => {
    HapticService.selection();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirmDelete = async () => {
    if (chosenPhotos.length === 0) return;
    setIsDeleting(true);
    HapticService.notificationWarning();

    const xpEarned = 120 + chosenPhotos.length * 10;

    try {
      await PhotoService.deletePhotos(chosenPhotos);
      recordDeckCompletion(chosenPhotos.length, totalBytesFreed, xpEarned);
      HapticService.notificationSuccess();
    } catch (error) {
      console.warn('Batch delete error:', error);
    } finally {
      setIsDeleting(false);
      if (onFinishDelete) {
        onFinishDelete(chosenPhotos.length, totalBytesFreed);
      } else if (navigation) {
        navigation.replace('Celebration', {
          xpGained: xpEarned,
          bytesFreed: totalBytesFreed,
          deletedCount: chosenPhotos.length,
        });
      }
    }
  };

  const handleKeepAll = () => {
    HapticService.selection();
    recordDeckCompletion(0, 0, 100);
    if (onKeepAll) {
      onKeepAll();
    } else if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Swipe' }],
      });
    }
  };

  const handleNextDeck = () => {
    HapticService.selection();
    recordDeckCompletion(0, 0, 100);
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Swipe' }],
      });
    }
  };

  const handleViewProfile = () => {
    HapticService.selection();
    if (navigation) {
      navigation.navigate('Profile');
    }
  };

  // Pulse animation for All Kept celebratory icon
  const sparklesPulse = useSharedValue(1);
  useEffect(() => {
    sparklesPulse.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 1500 }),
        withTiming(0.96, { duration: 1500 })
      ),
      -1,
      true
    );
  }, [sparklesPulse]);

  const sparklesAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparklesPulse.value }],
  }));

  const renderThumbnail = ({ item }: { item: Photo }) => {
    const isSelected = selectedIds.has(item.id);
    return (
      <AnimatedThumbnail
        item={item}
        isSelected={isSelected}
        onToggle={togglePhoto}
      />
    );
  };

  // If nothing was marked for deletion in this deck (100% Kept)
  if (photos.length === 0) {
    return (
      <ScreenContainer applyTopInset applyBottomInset>
        <AmbientGlow color={Palette.keep} top="-6%" size={340} opacity={0.22} />

        <View style={styles.allKeptWrap}>
          <View style={styles.allKeptCenter}>
            {/* Celebratory Icon with pulse */}
            <Animated.View style={[styles.allKeptIconContainer, sparklesAnimatedStyle]}>
              <Sparkles size={36} color={Palette.keepLight} strokeWidth={2.4} />
            </Animated.View>

            <Text style={styles.allKeptEyebrow}>DECK COMPLETE • 100% KEPT</Text>
            <Text style={[styles.allKeptTitle, isCompactScreen && styles.allKeptTitleCompact]}>
              All memories preserved!
            </Text>
            <Text style={styles.allKeptSubtitle}>
              You didn’t stage any photos for deletion. Every photo from this deck remains safely stored in your camera roll.
            </Text>

            {/* Streak & XP reward card */}
            <View style={styles.allKeptRewardCard}>
              <View style={styles.allKeptRewardRow}>
                <View style={styles.allKeptStreakPill}>
                  <Flame size={18} color={Palette.streak} fill={Palette.streak} />
                  <Text style={styles.allKeptStreakText}>Streak Active</Text>
                </View>
                <Text style={styles.allKeptXpText}>+100 XP</Text>
              </View>
              <Text style={styles.allKeptRewardSubtext}>
                Keep up your decluttering momentum by reviewing your next batch.
              </Text>
            </View>
          </View>

          {/* Action Footer for All Kept */}
          <View style={[styles.footer, isCompactScreen && styles.footerCompact]}>
            <PrimaryButton
              label="Move to Next Deck"
              onPress={handleNextDeck}
              icon={<ChevronRight size={20} color="#FFFFFF" strokeWidth={2.6} />}
            />

            <PrimaryButton
              variant="secondary"
              label="Dashboard & Stats"
              onPress={handleViewProfile}
              style={[styles.keepAllButton, isCompactScreen && styles.keepAllButtonCompact]}
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // Normal Reclaim View with deletion grid
  return (
    <ScreenContainer applyTopInset applyBottomInset>
      {/* Header */}
      <View style={[styles.header, isCompactScreen && styles.headerCompact]}>
        <View
          style={[
            styles.reclaimIconWrapper,
            isCompactScreen && styles.reclaimIconWrapperCompact,
          ]}
        >
          <HardDrive
            size={isCompactScreen ? 22 : 28}
            color={Palette.trashLight}
            strokeWidth={2.4}
          />
        </View>

        <Text style={styles.eyebrow}>BATCH COMPLETE</Text>
        <Text style={[styles.title, isCompactScreen && styles.titleCompact]}>
          Ready to reclaim{'\n'}your storage?
        </Text>
        <Text style={styles.summaryText}>
          Clearing <Text style={styles.boldText}>{chosenPhotos.length} photos</Text> will free up{' '}
          <Text style={styles.boldText}>{totalMb} MB</Text>
        </Text>
      </View>

      {/* Grid of staged photos */}
      <View style={styles.gridSection}>
        <View style={styles.gridLabelRow}>
          <Text style={styles.gridLabelText}>SELECTED ITEMS</Text>
          <Text style={styles.gridLabelCount}>
            {chosenPhotos.length} OF {photos.length}
          </Text>
        </View>

        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={renderThumbnail}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Action Footer */}
      <View style={[styles.footer, isCompactScreen && styles.footerCompact]}>
        <PrimaryButton
          variant="danger"
          label={`Permanently Delete (${chosenPhotos.length})`}
          onPress={handleConfirmDelete}
          disabled={chosenPhotos.length === 0}
          loading={isDeleting}
          icon={<Trash2 size={20} color="#FFFFFF" strokeWidth={2.4} />}
        />

        <PrimaryButton
          variant="secondary"
          label="Keep All & Next Deck"
          onPress={handleKeepAll}
          style={[styles.keepAllButton, isCompactScreen && styles.keepAllButtonCompact]}
        />

        <Text style={[styles.footerNote, isCompactScreen && styles.footerNoteCompact]}>
          This uses your device’s native deletion confirmation.
        </Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bg,
  },
  allKeptWrap: {
    flex: 1,
    justifyContent: 'space-between',
  },
  allKeptCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  allKeptIconContainer: {
    width: 78,
    height: 78,
    borderRadius: 26,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    shadowColor: Palette.keep,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  allKeptEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.keepLight,
    letterSpacing: 2.2,
    marginBottom: 8,
  },
  allKeptTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 10,
  },
  allKeptTitleCompact: {
    fontSize: 26,
    lineHeight: 30,
    marginBottom: 8,
  },
  allKeptSubtitle: {
    fontSize: 13.5,
    color: Palette.secondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  allKeptRewardCard: {
    width: '100%',
    maxWidth: 330,
    marginTop: 26,
    padding: 16,
    borderRadius: Layout.radius.card,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.22)',
  },
  allKeptRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  allKeptStreakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Layout.radius.pill,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  allKeptStreakText: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.streak,
  },
  allKeptXpText: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.keepLight,
  },
  allKeptRewardSubtext: {
    fontSize: 11.5,
    color: Palette.muted,
    lineHeight: 16,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerCompact: {
    paddingTop: 10,
    paddingBottom: 8,
  },
  reclaimIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  reclaimIconWrapperCompact: {
    width: 46,
    height: 46,
    borderRadius: 16,
    marginBottom: 8,
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Palette.eyebrow,
    letterSpacing: 2.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 10,
  },
  titleCompact: {
    fontSize: 23,
    lineHeight: 27,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 13,
    color: Palette.secondary,
    textAlign: 'center',
  },
  boldText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  gridSection: {
    flex: 1,
    paddingHorizontal: 18,
  },
  gridLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  gridLabelText: {
    color: Palette.muted,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  gridLabelCount: {
    color: Palette.muted,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  listContent: {
    paddingBottom: 14,
  },
  columnWrapper: {
    gap: 8,
    marginBottom: 8,
  },
  thumbnailWrap: {
    flex: 1,
    aspectRatio: 0.88,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: Palette.card,
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.42,
  },
  thumbnailSelected: {
    borderColor: Palette.primary,
    opacity: 1,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    right: 6,
    top: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(15, 16, 21, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(46, 51, 70, 0.6)',
  },
  footerCompact: {
    paddingTop: 8,
    paddingBottom: 2,
  },
  keepAllButton: {
    marginTop: 10,
  },
  keepAllButtonCompact: {
    marginTop: 6,
  },
  footerNote: {
    textAlign: 'center',
    marginTop: 10,
    color: Palette.muted,
    fontSize: 10,
  },
  footerNoteCompact: {
    marginTop: 6,
  },
});
