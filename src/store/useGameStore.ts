import { create } from 'zustand';
import { createMMKV, MMKV } from 'react-native-mmkv';
import { getRandomFruitName } from '../utils/fruitIdentity';

let mmkvInstance: MMKV | null = null;
try {
  mmkvInstance = createMMKV();
} catch (error) {
  console.warn('MMKV could not be initialized directly, falling back to memory store:', error);
}

const memoryStore: Record<string, any> = {};

const safeStorage = {
  getNumber: (key: string, defaultValue: number): number => {
    try {
      if (mmkvInstance) {
        return mmkvInstance.getNumber(key) ?? defaultValue;
      }
    } catch {}
    return memoryStore[key] ?? defaultValue;
  },

  setNumber: (key: string, value: number): void => {
    try {
      if (mmkvInstance) {
        mmkvInstance.set(key, value);
        return;
      }
    } catch {}
    memoryStore[key] = value;
  },

  getString: (key: string, defaultValue: string | null): string | null => {
    try {
      if (mmkvInstance) {
        return mmkvInstance.getString(key) ?? defaultValue;
      }
    } catch {}
    return memoryStore[key] ?? defaultValue;
  },

  setString: (key: string, value: string): void => {
    try {
      if (mmkvInstance) {
        mmkvInstance.set(key, value);
        return;
      }
    } catch {}
    memoryStore[key] = value;
  },

  getBoolean: (key: string, defaultValue: boolean): boolean => {
    try {
      if (mmkvInstance) {
        return mmkvInstance.getBoolean(key) ?? defaultValue;
      }
    } catch {}
    return memoryStore[key] ?? defaultValue;
  },

  setBoolean: (key: string, value: boolean): void => {
    try {
      if (mmkvInstance) {
        mmkvInstance.set(key, value);
        return;
      }
    } catch {}
    memoryStore[key] = value;
  },
};

interface GameState {
  score: number;
  streakCount: number;
  lastActiveDate: string | null;
  totalBytesCleaned: number;
  photosCleanedCount: number;
  soundAndHaptics: boolean;
  dailyReminderTime: string;
  dailyReminderEnabled: boolean;
  streakAlertsEnabled: boolean;
  badgeAlertsEnabled: boolean;
  reviewedPhotoIds: string[];
  hasCompletedIntro: boolean;
  hasRequestedPermissions: boolean;
  decksCompletedCount: number;
  userName: string;
  avatarSeed: string;
  avatarStyle: string;

  checkAndUpdateStreak: () => void;
  recordDeckCompletion: (count: number, bytesCleaned: number, xpEarned: number) => void;
  recordReviewedPhotos: (ids: string[]) => void;
  clearReviewedPhotos: () => void;
  setHasCompletedIntro: (completed: boolean) => void;
  setHasRequestedPermissions: (requested: boolean) => void;
  resetOnboarding: () => void;
  toggleHaptics: () => void;
  setDailyReminderTime: (time: string) => void;
  setDailyReminderEnabled: (enabled: boolean) => void;
  setStreakAlertsEnabled: (enabled: boolean) => void;
  setBadgeAlertsEnabled: (enabled: boolean) => void;
  setUserName: (name: string) => void;
  setAvatarSeed: (seed: string) => void;
  setAvatarStyle: (style: string) => void;
  rerollFruitProfile: () => { name: string; style: string };
  clearCache: () => void;
}

const parseInitialReviewedIds = (): string[] => {
  try {
    const raw = safeStorage.getString('reviewed_photo_ids', '[]');
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const getInitialUserName = (): string => {
  const saved = safeStorage.getString('user_name', null);
  if (saved && saved.trim().length > 0) return saved;
  const generated = getRandomFruitName();
  safeStorage.setString('user_name', generated);
  return generated;
};

const getInitialAvatarSeed = (defaultName: string): string => {
  const saved = safeStorage.getString('avatar_seed', null);
  if (saved && saved.trim().length > 0) return saved;
  safeStorage.setString('avatar_seed', defaultName);
  return defaultName;
};

const getInitialAvatarStyle = (): string => {
  return safeStorage.getString('avatar_style', 'fun-emoji') ?? 'fun-emoji';
};

const initialFruitName = getInitialUserName();
const initialAvatarSeed = getInitialAvatarSeed(initialFruitName);
const initialAvatarStyle = getInitialAvatarStyle();

export const useGameStore = create<GameState>((set, get) => ({
  score: safeStorage.getNumber('user_score', 1420),
  streakCount: safeStorage.getNumber('user_streak', 14),
  lastActiveDate: safeStorage.getString('last_active_date', null),
  totalBytesCleaned: safeStorage.getNumber(
    'total_bytes_cleaned',
    2.4 * 1024 * 1024 * 1024
  ),
  photosCleanedCount: safeStorage.getNumber('photos_cleaned_count', 486),
  soundAndHaptics: safeStorage.getBoolean('sound_and_haptics', true),
  dailyReminderTime: safeStorage.getString('daily_reminder_time', '8:00 PM') ?? '8:00 PM',
  dailyReminderEnabled: safeStorage.getBoolean('daily_reminder_enabled', true),
  streakAlertsEnabled: safeStorage.getBoolean('streak_alerts_enabled', true),
  badgeAlertsEnabled: safeStorage.getBoolean('badge_alerts_enabled', true),
  reviewedPhotoIds: parseInitialReviewedIds(),
  hasCompletedIntro: safeStorage.getBoolean('has_completed_intro', false),
  hasRequestedPermissions: safeStorage.getBoolean('has_requested_permissions', false),
  decksCompletedCount: safeStorage.getNumber('decks_completed_count', 18),
  userName: initialFruitName,
  avatarSeed: initialAvatarSeed,
  avatarStyle: initialAvatarStyle,

  checkAndUpdateStreak: () => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = get().lastActiveDate;

    if (!lastDate) {
      set({ streakCount: 14, lastActiveDate: today });
      safeStorage.setNumber('user_streak', 14);
      safeStorage.setString('last_active_date', today);
      return;
    }

    if (lastDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (lastDate === yesterdayStr) {
      newStreak = get().streakCount + 1;
    }

    set({ streakCount: newStreak, lastActiveDate: today });
    safeStorage.setNumber('user_streak', newStreak);
    safeStorage.setString('last_active_date', today);
  },

  recordDeckCompletion: (count: number, bytesCleaned: number, xpEarned: number) => {
    const current = get();
    const newScore = current.score + xpEarned;
    const newBytes = current.totalBytesCleaned + bytesCleaned;
    const newCount = current.photosCleanedCount + count;
    const newDecks = current.decksCompletedCount + 1;

    set({
      score: newScore,
      totalBytesCleaned: newBytes,
      photosCleanedCount: newCount,
      decksCompletedCount: newDecks,
    });

    safeStorage.setNumber('user_score', newScore);
    safeStorage.setNumber('total_bytes_cleaned', newBytes);
    safeStorage.setNumber('photos_cleaned_count', newCount);
    safeStorage.setNumber('decks_completed_count', newDecks);
  },

  toggleHaptics: () => {
    const updated = !get().soundAndHaptics;
    set({ soundAndHaptics: updated });
    safeStorage.setBoolean('sound_and_haptics', updated);
  },

  setDailyReminderTime: (time: string) => {
    set({ dailyReminderTime: time });
    safeStorage.setString('daily_reminder_time', time);
  },

  setDailyReminderEnabled: (enabled: boolean) => {
    set({ dailyReminderEnabled: enabled });
    safeStorage.setBoolean('daily_reminder_enabled', enabled);
  },

  setStreakAlertsEnabled: (enabled: boolean) => {
    set({ streakAlertsEnabled: enabled });
    safeStorage.setBoolean('streak_alerts_enabled', enabled);
  },

  setBadgeAlertsEnabled: (enabled: boolean) => {
    set({ badgeAlertsEnabled: enabled });
    safeStorage.setBoolean('badge_alerts_enabled', enabled);
  },

  recordReviewedPhotos: (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const existing = get().reviewedPhotoIds;
    const combined = Array.from(new Set([...existing, ...ids]));
    set({ reviewedPhotoIds: combined });
    safeStorage.setString('reviewed_photo_ids', JSON.stringify(combined));
  },

  clearReviewedPhotos: () => {
    set({ reviewedPhotoIds: [] });
    safeStorage.setString('reviewed_photo_ids', '[]');
  },

  setHasCompletedIntro: (completed: boolean) => {
    set({ hasCompletedIntro: completed });
    safeStorage.setBoolean('has_completed_intro', completed);
  },

  setHasRequestedPermissions: (requested: boolean) => {
    set({ hasRequestedPermissions: requested });
    safeStorage.setBoolean('has_requested_permissions', requested);
  },

  resetOnboarding: () => {
    set({ hasCompletedIntro: false, hasRequestedPermissions: false });
    safeStorage.setBoolean('has_completed_intro', false);
    safeStorage.setBoolean('has_requested_permissions', false);
  },

  setUserName: (name: string) => {
    const trimmed = name.trim() || 'Cosmic Mango';
    set({ userName: trimmed });
    safeStorage.setString('user_name', trimmed);
  },

  setAvatarSeed: (seed: string) => {
    const trimmed = seed.trim() || 'Cosmic Mango';
    set({ avatarSeed: trimmed });
    safeStorage.setString('avatar_seed', trimmed);
  },

  setAvatarStyle: (style: string) => {
    set({ avatarStyle: style });
    safeStorage.setString('avatar_style', style);
  },

  rerollFruitProfile: () => {
    const newName = getRandomFruitName();
    set({ userName: newName, avatarSeed: newName });
    safeStorage.setString('user_name', newName);
    safeStorage.setString('avatar_seed', newName);
    return { name: newName, style: get().avatarStyle };
  },

  clearCache: () => {
    // Reset cache simulated counter
  },
}));
