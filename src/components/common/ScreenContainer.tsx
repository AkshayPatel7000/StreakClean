import React, { useEffect } from 'react';
import {
  Platform,
  StatusBar,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette } from '../../theme/colors';

export interface DeviceInsetsInfo {
  insets: EdgeInsets;
  statusBarHeight: number;
  bottomNavHeight: number;
  hasBottomNav: boolean;
  is3ButtonNav: boolean;
  isCompactScreen: boolean;
  screenHeight: number;
  screenWidth: number;
}

/**
 * Hook to accurately detect device status bar height, navigation bar height,
 * and whether the device is using 3-button navigation or gesture navigation.
 */
export function useDeviceInsets(): DeviceInsetsInfo {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  // Find exact device status bar height:
  // On Android, StatusBar.currentHeight provides the exact platform status bar height.
  // insets.top provides the cutout / notch / status bar top inset from safe-area context.
  // We take Math.max to guarantee we never under-pad the top on any screen or cutout.
  const rawAndroidHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const statusBarHeight = Math.max(
    insets.top,
    rawAndroidHeight,
    Platform.OS === 'android' ? 24 : 20
  );

  // Identify whether the device is using Android 3-button navigation.
  // On Android:
  // - 3-button navigation produces insets.bottom >= 40dp (typically 48dp).
  // - Gesture navigation produces insets.bottom between 16dp and 24dp (or 34dp on modern iOS).
  // - Hardware buttons or hidden bar produce 0dp.
  const is3ButtonNav = Platform.OS === 'android' && insets.bottom >= 40;
  const hasBottomNav = insets.bottom > 0;

  // Ergonomic bottom clearance:
  // - If 3-button navigation: reserve insets.bottom + 8dp breathing room so interactive
  //   buttons never clash with the Android Back, Home, and Recents system buttons.
  // - If gesture navigation / home indicator: use insets.bottom.
  // - If hardware navigation keys (0dp inset): reserve a comfortable 16dp padding.
  const bottomNavHeight = is3ButtonNav
    ? insets.bottom + 8
    : Math.max(insets.bottom, 16);

  // Screen is compact if total viewport is under 720dp or if 3-button nav takes up space
  const isCompactScreen = screenHeight < 720 || (is3ButtonNav && screenHeight < 780);

  return {
    insets,
    statusBarHeight,
    bottomNavHeight,
    hasBottomNav,
    is3ButtonNav,
    isCompactScreen,
    screenHeight,
    screenWidth,
  };
}

/**
 * Helper hook to quickly access just the device status bar height
 */
export function useDeviceStatusBarHeight(): number {
  const { statusBarHeight } = useDeviceInsets();
  return statusBarHeight;
}

export interface ScreenContainerProps {
  children: React.ReactNode;
  applyTopInset?: boolean;
  applyBottomInset?: boolean;
  applyHorizontalInsets?: boolean;
  extraTopPadding?: number;
  extraBottomPadding?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
}

/**
 * Safe Area Screen Wrapper with transparent status bar and responsive
 * bottom navigation bar padding.
 * Guarantees zero status bar overlap and handles 3-button navigation.
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  applyTopInset = true,
  applyBottomInset = true,
  applyHorizontalInsets = false,
  extraTopPadding = 0,
  extraBottomPadding = 0,
  style,
  contentStyle,
  backgroundColor = Palette.bg,
  statusBarStyle = 'light-content',
}) => {
  const { statusBarHeight, bottomNavHeight, insets } = useDeviceInsets();

  // Enforce Android transparent status bar imperatively to avoid navigation glitches
  useEffect(() => {
    if (Platform.OS === 'android') {
      const androidStatusBar = StatusBar as unknown as {
        setTranslucent?: (translucent: boolean) => void;
        setBackgroundColor?: (color: string, animated?: boolean) => void;
      };
      androidStatusBar.setTranslucent?.(true);
      androidStatusBar.setBackgroundColor?.('transparent');
    }
  }, []);

  const containerPaddingStyle: ViewStyle = {
    paddingTop: applyTopInset ? statusBarHeight + extraTopPadding : 0,
    paddingBottom: applyBottomInset ? bottomNavHeight + extraBottomPadding : 0,
    paddingLeft: applyHorizontalInsets ? insets.left : 0,
    paddingRight: applyHorizontalInsets ? insets.right : 0,
  };

  return (
    <View style={[styles.root, { backgroundColor }, style]}>
      <StatusBar barStyle={statusBarStyle} />
      <View style={[styles.content, containerPaddingStyle, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

// Aliases for developer convenience & explicit naming
export const AppSafeAreaView = ScreenContainer;
export const SafeAreaContainer = ScreenContainer;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
