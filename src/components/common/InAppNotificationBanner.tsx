import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  CheckCircle,
  Flame,
  Sparkles,
  X,
  Zap,
} from 'lucide-react-native';
import { Palette } from '../../theme/colors';
import {
  InAppNotification,
  NotificationService,
} from '../../services/notificationService';
import { HapticService } from '../../services/hapticService';

export const InAppNotificationBanner: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [notification, setNotification] = useState<InAppNotification | null>(null);

  const translateY = useSharedValue(-150);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const unsubscribe = NotificationService.subscribe((notif) => {
      setNotification(notif);
      if (notif) {
        translateY.value = withSpring(0, { damping: 14, stiffness: 180 });
        opacity.value = withTiming(1, { duration: 200 });
      } else {
        translateY.value = withTiming(-150, { duration: 220 });
        opacity.value = withTiming(0, { duration: 180 });
      }
    });

    return unsubscribe;
  }, [translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!notification && opacity.value === 0) {
    return null;
  }

  const handleDismiss = () => {
    HapticService.selection();
    NotificationService.dismiss();
  };

  const handlePressBanner = () => {
    HapticService.selection();
    if (notification?.onPress) {
      notification.onPress();
    }
    NotificationService.dismiss();
  };

  const getThemeDetails = () => {
    switch (notification?.type) {
      case 'streak':
        return {
          color: Palette.streak,
          borderColor: 'rgba(245, 158, 11, 0.45)',
          bgColor: 'rgba(245, 158, 11, 0.15)',
          Icon: Flame,
        };
      case 'badge':
        return {
          color: Palette.primary,
          borderColor: 'rgba(178, 152, 231, 0.5)',
          bgColor: 'rgba(178, 152, 231, 0.18)',
          Icon: Sparkles,
        };
      case 'level':
        return {
          color: '#FBBF24',
          borderColor: 'rgba(251, 191, 36, 0.5)',
          bgColor: 'rgba(251, 191, 36, 0.18)',
          Icon: Zap,
        };
      case 'success':
        return {
          color: Palette.keepLight,
          borderColor: 'rgba(34, 197, 94, 0.45)',
          bgColor: 'rgba(34, 197, 94, 0.15)',
          Icon: CheckCircle,
        };
      default:
        return {
          color: Palette.eyebrow,
          borderColor: 'rgba(178, 152, 231, 0.35)',
          bgColor: 'rgba(178, 152, 231, 0.12)',
          Icon: Bell,
        };
    }
  };

  const theme = getThemeDetails();
  const IconComponent = theme.Icon;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.overlayContainer,
        { paddingTop: Math.max(insets.top, 14) + 6 },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={handlePressBanner}
        style={[styles.bannerCard, { borderColor: theme.borderColor }]}
      >
        <View style={[styles.iconWrapper, { backgroundColor: theme.bgColor }]}>
          <IconComponent size={20} color={theme.color} strokeWidth={2.4} />
        </View>

        <View style={styles.textCol}>
          <Text style={styles.titleText} numberOfLines={1}>
            {notification?.title ?? 'Notification'}
          </Text>
          <Text style={styles.messageText} numberOfLines={2}>
            {notification?.message ?? ''}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeButton}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={15} color={Palette.muted} strokeWidth={2.4} />
        </TouchableOpacity>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  bannerCard: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(23, 20, 36, 0.96)',
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  messageText: {
    fontSize: 11,
    color: Palette.secondary,
    lineHeight: 15,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
