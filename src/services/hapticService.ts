import { Platform, Vibration } from 'react-native';
import { trigger } from 'react-native-haptic-feedback';

const defaultOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

export const HapticService = {
  selection: () => {
    try {
      trigger('selection', defaultOptions);
      if (Platform.OS === 'android') {
        Vibration.vibrate(25);
      }
    } catch {
      // safe fallback on unsupported environments
    }
  },

  impactLight: () => {
    try {
      trigger('impactLight', defaultOptions);
      if (Platform.OS === 'android') {
        Vibration.vibrate(35);
      }
    } catch {
      // safe fallback
    }
  },

  impactMedium: () => {
    try {
      trigger('impactMedium', defaultOptions);
      if (Platform.OS === 'android') {
        Vibration.vibrate(55);
      }
    } catch {
      // safe fallback
    }
  },

  impactHeavy: () => {
    try {
      trigger('impactHeavy', defaultOptions);
      if (Platform.OS === 'android') {
        Vibration.vibrate(80);
      }
    } catch {
      // safe fallback
    }
  },

  notificationSuccess: () => {
    try {
      trigger('notificationSuccess', defaultOptions);
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 40, 40, 70]);
      }
    } catch {
      // safe fallback
    }
  },

  notificationWarning: () => {
    try {
      trigger('notificationWarning', defaultOptions);
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 60, 50, 90]);
      }
    } catch {
      // safe fallback
    }
  },
};
