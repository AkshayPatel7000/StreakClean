import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { TopHud } from '../components/deck/TopHud';
import { PhotoCard } from '../components/deck/PhotoCard';
import { SwipeStamp } from '../components/deck/SwipeStamp';
import { ControlsBar } from '../components/deck/ControlsBar';
import { FilterSheet } from '../components/deck/FilterSheet';
import { Photo, PhotoFilter, SwipeDirection, SwipeRecord } from '../types/photo';
import { PhotoService } from '../services/photoService';
import { HapticService } from '../services/hapticService';
import { Palette } from '../theme/colors';
import { Layout } from '../theme/layout';
import { useGameStore } from '../store/useGameStore';
import { RootStackNavigationProp } from '../types/navigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 95;

interface SwipeArenaScreenProps {
  onReview?: (trashed: Photo[]) => void;
  onProfile?: () => void;
}

export const SwipeArenaScreen: React.FC<SwipeArenaScreenProps> = ({
  onReview,
  onProfile,
}) => {
  const navigation = useNavigation<RootStackNavigationProp<'Swipe'>>();
  const streak = useGameStore((state) => state.streakCount);
  const xp = useGameStore((state) => state.score);
  const recordReviewedPhotos = useGameStore((state) => state.recordReviewedPhotos);

  const [queue, setQueue] = useState<Photo[]>([]);
  const [history, setHistory] = useState<SwipeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PhotoFilter>('all');
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Gesture shared values - worklet thread-safe
  const isSwipingOut = useSharedValue(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const topCardOpacity = useSharedValue(1);
  const nextCardProgress = useSharedValue(0);

  const keepOpacity = useDerivedValue(() => {
    return Math.min(1, Math.max(0, translateX.value / 85));
  });

  const trashOpacity = useDerivedValue(() => {
    return Math.min(1, Math.max(0, -translateX.value / 85));
  });

  // Current cards: at most 2 mounted in DOM tree
  const topPhoto = queue[0];
  const nextPhoto = queue[1];

  // Prefetch upcoming images into cache so they render without delay
  useEffect(() => {
    if (nextPhoto?.uri) {
      Image.prefetch(nextPhoto.uri).catch(() => {});
    }
    if (queue[2]?.uri) {
      Image.prefetch(queue[2].uri).catch(() => {});
    }
  }, [nextPhoto?.uri, queue]);

  // Synchronously reset card transforms when the top photo updates.
  // This guarantees that the marked/swiped photo NEVER flickers or flashes
  // at position (0, 0) over the incoming photo.
  useLayoutEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    nextCardProgress.value = 0;
    topCardOpacity.value = 1;
    isSwipingOut.value = false;
  }, [topPhoto?.id, translateX, translateY, nextCardProgress, topCardOpacity, isSwipingOut]);

  // Load photos based on filter and exclude photos previously kept or trashed
  const loadPhotos = useCallback(async (filter: PhotoFilter) => {
    setLoading(true);
    const reviewedIds = useGameStore.getState().reviewedPhotoIds;
    const photos = await PhotoService.fetchDeckPhotos(filter, 25, reviewedIds);
    setQueue(photos);
    setHistory([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPhotos(activeFilter);
  }, [activeFilter, loadPhotos]);

  // Navigate to profile
  const handleOpenProfile = useCallback(() => {
    if (onProfile) {
      onProfile();
    } else if (navigation) {
      navigation.navigate('Profile');
    }
  }, [navigation, onProfile]);

  // Handle completed swipe
  const handleSwipeComplete = useCallback(
    (direction: SwipeDirection) => {
      if (queue.length === 0) return;

      const [currentPhoto, ...rest] = queue;
      const record: SwipeRecord = {
        photo: currentPhoto,
        direction,
        timestamp: Date.now(),
      };

      // Trigger strong haptic rumble
      if (direction === 'keep') {
        HapticService.impactMedium();
      } else {
        HapticService.impactHeavy();
      }

      const updatedHistory = [...history, record];
      setHistory(updatedHistory);
      setQueue(rest);

      // Check if deck finished
      if (rest.length === 0) {
        // Record all reviewed photos (both kept and trashed) so they never reappear in the next deck
        const allReviewedIds = updatedHistory.map((r) => r.photo.id);
        recordReviewedPhotos(allReviewedIds);

        const trashedPhotos = updatedHistory
          .filter((r) => r.direction === 'trash')
          .map((r) => r.photo);

        if (onReview) {
          onReview(trashedPhotos);
        } else if (navigation) {
          navigation.navigate('BatchReview', { stagedPhotos: trashedPhotos });
        }
      }
    },
    [queue, history, onReview, navigation, recordReviewedPhotos]
  );

  // Programmatic swipe (from buttons)
  const executeProgrammaticSwipe = useCallback(
    (direction: SwipeDirection) => {
      if (queue.length === 0 || isSwipingOut.value) return;
      isSwipingOut.value = true;

      const targetX = direction === 'keep' ? SCREEN_WIDTH * 1.35 : -SCREEN_WIDTH * 1.35;
      nextCardProgress.value = withTiming(1, { duration: 220 });
      translateX.value = withTiming(targetX, { duration: 220 }, (finished) => {
        if (finished) {
          topCardOpacity.value = 0;
          runOnJS(handleSwipeComplete)(direction);
        }
      });
    },
    [queue.length, isSwipingOut, handleSwipeComplete, translateX, nextCardProgress, topCardOpacity]
  );

  // Pan gesture for interactive swiping with worklet execution
  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .activeOffsetX([-10, 10])
      .onBegin(() => {
        'worklet';
      })
      .onUpdate((event) => {
        'worklet';
        if (isSwipingOut.value) return;
        translateX.value = event.translationX;
        translateY.value = event.translationY * 0.35;
        nextCardProgress.value = Math.min(
          1,
          Math.abs(event.translationX) / (SWIPE_THRESHOLD * 1.4)
        );
      })
      .onEnd((event) => {
        'worklet';
        if (isSwipingOut.value) return;
        const reachedThreshold = Math.abs(event.translationX) > SWIPE_THRESHOLD;
        const fastVelocity = Math.abs(event.velocityX) > 600;

        if (reachedThreshold || fastVelocity) {
          isSwipingOut.value = true;
          const direction: SwipeDirection =
            event.translationX > 0 ? 'keep' : 'trash';

          const targetX =
            direction === 'keep' ? SCREEN_WIDTH * 1.35 : -SCREEN_WIDTH * 1.35;

          nextCardProgress.value = withTiming(1, { duration: 200 });
          translateX.value = withTiming(
            targetX,
            { duration: 200 },
            (finished) => {
              if (finished) {
                topCardOpacity.value = 0;
                runOnJS(handleSwipeComplete)(direction);
              }
            }
          );
        } else {
          translateX.value = withSpring(0, { damping: 18, stiffness: 240 });
          translateY.value = withSpring(0, { damping: 18, stiffness: 240 });
          nextCardProgress.value = withSpring(0, { damping: 18, stiffness: 240 });
        }
      });
  }, [translateX, translateY, isSwipingOut, nextCardProgress, topCardOpacity, handleSwipeComplete]);

  // Animated styles for top card: moves, tilts, and smoothly tracks gesture
  const topCardAnimatedStyle = useAnimatedStyle(() => {
    const rotateDeg = `${(translateX.value / 18).toFixed(1)}deg`;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: rotateDeg },
      ],
      opacity: topCardOpacity.value,
    };
  });

  // Animated styles for next preview card:
  // Smoothly scales up from 0.92 to 1.0, translates Y from 20 to 0,
  // and fades opacity from 0.62 to 1.0 as top card is swiped away!
  const nextCardAnimatedStyle = useAnimatedStyle(() => {
    const scale = 0.92 + nextCardProgress.value * (1 - 0.92);
    const translateYVal = 20 * (1 - nextCardProgress.value);
    const opacityVal = 0.62 + nextCardProgress.value * (1 - 0.62);

    return {
      transform: [
        { scale },
        { translateY: translateYVal },
      ],
      opacity: opacityVal,
    };
  });

  // Undo last swipe
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isSwipingOut.value) return;
    const lastRecord = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setQueue((prev) => [lastRecord.photo, ...prev]);
  }, [history, isSwipingOut]);

  const totalDeckCards = queue.length + history.length;
  const currentProgress = history.length + 1;

  return (
    <ScreenContainer applyTopInset applyBottomInset={false}>
      {/* Top HUD */}
      <TopHud
        streak={streak}
        currentCardIndex={Math.min(currentProgress, totalDeckCards)}
        totalCards={totalDeckCards}
        xp={xp}
        onPressProfile={handleOpenProfile}
      />

      {/* Main Deck Container */}
      <View style={styles.deckWrap}>
        {/* Meta Bar */}
        <View style={styles.deckMeta}>
          <View style={styles.metaLive}>
            <View style={styles.liveDot} />
            <Text style={styles.metaLiveText}>CAMERA ROLL</Text>
          </View>
          <Text style={styles.metaCount}>{queue.length} LEFT</Text>
        </View>

        {/* Card Stage */}
        <View style={styles.stage}>
          {/* Card 2 (Next Preview Card) - dynamically scales up & fades in as top card moves */}
          {nextPhoto && (
            <Animated.View
              style={[
                styles.cardAbsolute,
                styles.nextCardContainer,
                nextCardAnimatedStyle,
              ]}
            >
              <PhotoCard photo={nextPhoto} isTopCard={false} />
            </Animated.View>
          )}

          {/* Card 1 (Top Interactive Card) */}
          {topPhoto && (
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={[
                  styles.cardAbsolute,
                  styles.topCardContainer,
                  topCardAnimatedStyle,
                ]}
              >
                <PhotoCard photo={topPhoto} isTopCard={true} />
                <SwipeStamp type="keep" opacityVal={keepOpacity} />
                <SwipeStamp type="trash" opacityVal={trashOpacity} />
              </Animated.View>
            </GestureDetector>
          )}

          {/* Empty Deck State */}
          {!topPhoto && !loading && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Deck Complete!</Text>
              <Text style={styles.emptySubtext}>
                Proceeding to review your selections...
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Controls */}
      <ControlsBar
        canUndo={history.length > 0}
        onUndo={handleUndo}
        onSwipeTrash={() => executeProgrammaticSwipe('trash')}
        onSwipeKeep={() => executeProgrammaticSwipe('keep')}
        onOpenFilter={() => setShowFilterSheet(true)}
      />

      {/* Filter Bottom Sheet */}
      <FilterSheet
        visible={showFilterSheet}
        activeFilter={activeFilter}
        onSelectFilter={(newFilter) => {
          setActiveFilter(newFilter);
          loadPhotos(newFilter);
        }}
        onClose={() => setShowFilterSheet(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bg,
  },
  deckWrap: {
    flex: 1,
    paddingHorizontal: 16,
  },
  deckMeta: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  metaLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.keepLight,
    shadowColor: Palette.keepLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  metaLiveText: {
    fontSize: 9,
    fontWeight: '800',
    color: Palette.muted,
    letterSpacing: 1.4,
  },
  metaCount: {
    fontSize: 9,
    fontWeight: '800',
    color: Palette.muted,
    letterSpacing: 1.4,
  },
  stage: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  cardAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Layout.radius.card,
    overflow: 'hidden',
  },
  topCardContainer: {
    zIndex: 10,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 26,
  },
  nextCardContainer: {
    zIndex: 1,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  emptyCard: {
    flex: 1,
    backgroundColor: Palette.card,
    borderRadius: Layout.radius.card,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: Palette.secondary,
    textAlign: 'center',
  },
});
