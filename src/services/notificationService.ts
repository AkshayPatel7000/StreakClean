import { HapticService } from './hapticService';
import { PermissionService } from './permissionService';

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

  public async scheduleDailyReminder(
    time: string,
    userName: string,
    streak: number
  ): Promise<boolean> {
    const hasPermission = await PermissionService.requestNotificationPermission();
    if (!hasPermission) {
      return false;
    }
    // Simulated scheduling log for local notifications
    console.log(`[NotificationService] Daily streak reminder set for ${time} (${userName}, streak: ${streak})`);
    return true;
  }

  public triggerTestStreakReminder(userName: string, streak: number): string {
    return this.showNotification({
      type: 'streak',
      title: `🔥 Day ${streak} Streak at Risk!`,
      message: `Hey ${userName}, sort 5 photos before midnight to preserve your streak fire!`,
      emoji: '🔥',
      durationMs: 4500,
    });
  }

  public triggerTestBadgeUnlock(badgeName: string, xp: number): string {
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
