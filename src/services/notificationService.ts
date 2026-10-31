import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import { HapticService } from './hapticService';

export type NotificationType = 'streak' | 'badge' | 'level' | 'info' | 'success';

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  emoji?: string;
  badgeXp?: number;
  durationMs?: number;
  onPress?: () => void;
}

type NotificationListener = (notification: InAppNotification | null) => void;

class NotificationServiceManager {
  private currentNotification: InAppNotification | null = null;
  private listeners: Set<NotificationListener> = new Set();
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;
  private channelsCreated = false;

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener(this.currentNotification);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(this.currentNotification);
    });
  }

  public async ensureChannelsCreated(): Promise<void> {
    if (this.channelsCreated) return;
    try {
      await notifee.createChannel({
        id: 'streak_reminders',
        name: 'Streak Reminders',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });

      await notifee.createChannel({
        id: 'badge_alerts',
        name: 'Milestone & Badge Alerts',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });

      this.channelsCreated = true;
    } catch (err) {
      console.warn('[NotificationService] Channel setup failed:', err);
    }
  }

  public async requestSystemPermission(): Promise<boolean> {
    try {
      const settings = await notifee.requestPermission();
      // AuthorizationStatus: -1 (NOT_DETERMINED), 0 (DENIED), 1 (AUTHORIZED), 2 (PROVISIONAL)
      return settings.authorizationStatus >= 1;
    } catch (error) {
      console.warn('[NotificationService] Request permission error:', error);
      return false;
    }
  }

  public showNotification(
    options: Omit<InAppNotification, 'id'>
  ): string {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const notification: InAppNotification = {
      ...options,
      id,
      durationMs: options.durationMs ?? 4200,
    };

    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }

    this.currentNotification = notification;
    this.notifyListeners();

    // Trigger distinctive haptic feedback according to notification type
    if (notification.type === 'streak' || notification.type === 'level') {
      HapticService.notificationWarning();
    } else if (notification.type === 'badge' || notification.type === 'success') {
      HapticService.notificationSuccess();
    } else {
      HapticService.selection();
    }

    this.dismissTimer = setTimeout(() => {
      this.dismiss();
    }, notification.durationMs);

    return id;
  }

  public dismiss(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
    this.currentNotification = null;
    this.notifyListeners();
  }

  private parseTimeToNextDate(timeStr: string): Date {
    const parts = timeStr.trim().split(' ');
    const timePart = parts[0] || '8:00';
    const modifier = parts[1] || 'PM';

    const [hoursStr, minutesStr] = timePart.split(':');
    let hours = parseInt(hoursStr, 10) || 8;
    const minutes = parseInt(minutesStr, 10) || 0;

    if (modifier.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // If target time has already passed today, schedule starting tomorrow
    if (date.getTime() <= Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    return date;
  }

  public async scheduleDailyReminder(
    time: string,
    userName: string,
    streak: number
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestSystemPermission();
      if (!hasPermission) {
        return false;
      }

      await this.ensureChannelsCreated();

      // Cancel previous scheduled notification if any
      await notifee.cancelNotification('daily_streak_reminder');

      const targetDate = this.parseTimeToNextDate(time);

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: targetDate.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
      };

      const streakText = streak > 0 ? `${streak}-day streak` : 'streak';

      await notifee.createTriggerNotification(
        {
          id: 'daily_streak_reminder',
          title: '🔥 Streak Clean Daily Reminder',
          body: `Hey ${userName || 'Cleaner'}, keep your ${streakText} burning! Review a quick 5-photo deck today.`,
          android: {
            channelId: 'streak_reminders',
            pressAction: { id: 'default' },
          },
          ios: {
            sound: 'default',
          },
        },
        trigger
      );

      console.log(
        `[NotificationService] Daily reminder set for ${time} (${targetDate.toLocaleString()})`
      );
      return true;
    } catch (err) {
      console.warn('[NotificationService] scheduleDailyReminder error:', err);
      return false;
    }
  }

  public async cancelDailyReminder(): Promise<void> {
    try {
      await notifee.cancelNotification('daily_streak_reminder');
      console.log('[NotificationService] Daily reminder cancelled');
    } catch (err) {
      console.warn('[NotificationService] cancelDailyReminder error:', err);
    }
  }

  public async triggerTestStreakReminder(
    userName: string,
    streak: number
  ): Promise<string> {
    // 1. Post native system notification via Notifee
    try {
      await this.ensureChannelsCreated();
      await notifee.displayNotification({
        id: `streak_test_${Date.now()}`,
        title: `🔥 Day ${streak} Streak at Risk!`,
        body: `Hey ${userName || 'there'}, sort 5 photos before midnight to preserve your streak fire!`,
        android: {
          channelId: 'streak_reminders',
          pressAction: { id: 'default' },
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (err) {
      console.warn('[NotificationService] System test streak notification error:', err);
    }

    // 2. Also trigger in-app banner for instant visual interaction
    return this.showNotification({
      type: 'streak',
      title: `🔥 Day ${streak} Streak at Risk!`,
      message: `Hey ${userName || 'there'}, sort 5 photos before midnight to preserve your streak fire!`,
      emoji: '🔥',
      durationMs: 4500,
    });
  }

  public async triggerTestBadgeUnlock(
    badgeName: string,
    xp: number
  ): Promise<string> {
    // 1. Post native system notification via Notifee
    try {
      await this.ensureChannelsCreated();
      await notifee.displayNotification({
        id: `badge_test_${Date.now()}`,
        title: '🏆 Milestone Unlocked!',
        body: `You earned the "${badgeName}" badge and +${xp} XP bonus!`,
        android: {
          channelId: 'badge_alerts',
          pressAction: { id: 'default' },
        },
        ios: {
          sound: 'default',
        },
      });
    } catch (err) {
      console.warn('[NotificationService] System test badge notification error:', err);
    }

    // 2. Also trigger in-app banner
    return this.showNotification({
      type: 'badge',
      title: '🏆 Milestone Unlocked!',
      message: `You earned the "${badgeName}" badge and +${xp} XP bonus!`,
      emoji: '🎉',
      badgeXp: xp,
      durationMs: 4500,
    });
  }
}

export const NotificationService = new NotificationServiceManager();
