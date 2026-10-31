import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Check, RotateCcw, SlidersHorizontal, Trash2 } from 'lucide-react-native';
import { Palette } from '../../theme/colors';
import { HapticService } from '../../services/hapticService';
import { useDeviceInsets } from '../common/ScreenContainer';

interface ControlsBarProps {
  canUndo: boolean;
  onUndo: () => void;
  onSwipeTrash: () => void;
  onSwipeKeep: () => void;
  onOpenFilter: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  canUndo,
  onUndo,
  onSwipeTrash,
  onSwipeKeep,
  onOpenFilter,
}) => {
  const { bottomNavHeight, isCompactScreen, is3ButtonNav } = useDeviceInsets();
  const extraPadding = is3ButtonNav ? 2 : 6;

  // Press animation scales
  const undoScale = useSharedValue(1);
  const trashScale = useSharedValue(1);
  const keepScale = useSharedValue(1);
  const filterScale = useSharedValue(1);

  // Aura breathing animation
  const auraPulse = useSharedValue(1);
  useEffect(() => {
    auraPulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1600 }),
        withTiming(0.97, { duration: 1600 })
      ),
      -1,
      true
    );
  }, [auraPulse]);

  const undoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: undoScale.value }],
  }));

  const trashAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trashScale.value }],
  }));

  const keepAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: keepScale.value }],
  }));

  const filterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: filterScale.value }],
  }));

  const auraAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: auraPulse.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        isCompactScreen && styles.containerCompact,
        { paddingBottom: bottomNavHeight + extraPadding },
      ]}
    >
      {/* Undo Button */}
      <Animated.View style={undoAnimatedStyle}>
        <Pressable
          onPressIn={() => {
            if (canUndo) undoScale.value = withSpring(0.88, { damping: 12, stiffness: 260 });
          }}
          onPressOut={() => {
            undoScale.value = withSpring(1, { damping: 10, stiffness: 220 });
          }}
          onPress={() => {
            if (!canUndo) return;
            HapticService.selection();
            onUndo();
          }}
          disabled={!canUndo}
          style={[
            styles.smallButton,
            isCompactScreen && styles.smallButtonCompact,
            !canUndo && styles.disabledButton,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Undo last swipe"
        >
          <RotateCcw
            size={isCompactScreen ? 18 : 20}
            color={canUndo ? Palette.secondary : Palette.muted}
            strokeWidth={2.4}
          />
        </Pressable>
      </Animated.View>

      {/* Trash Button with Glowing Dual-Ring Aura */}
      <Animated.View
        style={[
          styles.haloWrapper,
          styles.haloTrash,
          isCompactScreen && styles.haloCompact,
          auraAnimatedStyle,
          trashAnimatedStyle,
        ]}
      >
        <Pressable
          onPressIn={() => {
            trashScale.value = withSpring(0.88, { damping: 12, stiffness: 280 });
          }}
          onPressOut={() => {
            trashScale.value = withSpring(1, { damping: 10, stiffness: 240 });
          }}
          onPress={() => {
            HapticService.impactHeavy();
            onSwipeTrash();
          }}
          style={[
            styles.mainButton,
            styles.trashButton,
            isCompactScreen && styles.mainButtonCompact,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Trash photo"
        >
          <Trash2
            size={isCompactScreen ? 24 : 28}
            color="#FDA4AF"
            strokeWidth={2.4}
          />
        </Pressable>
      </Animated.View>

      {/* Keep Button with Glowing Dual-Ring Aura */}
      <Animated.View
        style={[
          styles.haloWrapper,
          styles.haloKeep,
          isCompactScreen && styles.haloCompact,
          auraAnimatedStyle,
          keepAnimatedStyle,
        ]}
      >
        <Pressable
          onPressIn={() => {
            keepScale.value = withSpring(0.88, { damping: 12, stiffness: 280 });
          }}
          onPressOut={() => {
            keepScale.value = withSpring(1, { damping: 10, stiffness: 240 });
          }}
          onPress={() => {
            HapticService.impactMedium();
            onSwipeKeep();
          }}
          style={[
            styles.mainButton,
            styles.keepButton,
            isCompactScreen && styles.mainButtonCompact,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Keep photo"
        >
          <Check
            size={isCompactScreen ? 26 : 30}
            color="#6EE7B7"
            strokeWidth={2.8}
          />
        </Pressable>
      </Animated.View>

      {/* Filter Button */}
      <Animated.View style={filterAnimatedStyle}>
        <Pressable
          onPressIn={() => {
            filterScale.value = withSpring(0.88, { damping: 12, stiffness: 260 });
          }}
          onPressOut={() => {
            filterScale.value = withSpring(1, { damping: 10, stiffness: 220 });
          }}
          onPress={() => {
            HapticService.selection();
            onOpenFilter();
          }}
          style={[
            styles.smallButton,
            isCompactScreen && styles.smallButtonCompact,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Filter deck photos"
        >
          <SlidersHorizontal
            size={isCompactScreen ? 18 : 20}
            color={Palette.secondary}
            strokeWidth={2.2}
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  containerCompact: {
    gap: 10,
    paddingTop: 4,
  },
  smallButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  smallButtonCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.3,
    elevation: 0,
  },
  haloWrapper: {
    borderRadius: 44,
    padding: 3,
  },
  haloCompact: {
    borderRadius: 36,
    padding: 2.5,
  },
  haloTrash: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  haloKeep: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  mainButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonCompact: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  trashButton: {
    backgroundColor: '#1E1216',
    borderWidth: 2,
    borderColor: '#F43F5E',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.65,
    shadowRadius: 20,
    elevation: 8,
  },
  keepButton: {
    backgroundColor: '#0D1E17',
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.65,
    shadowRadius: 20,
    elevation: 8,
  },
  pressed: {
    transform: [{ scale: 0.91 }],
    opacity: 0.88,
  },
});
