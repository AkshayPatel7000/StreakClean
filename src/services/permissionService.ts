import { PermissionsAndroid, Platform } from 'react-native';

export interface PermissionStatus {
  photoLibrary: boolean;
  notifications: boolean;
}

export const PermissionService = {
  async checkPhotoPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
      }
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
    }
    // On iOS, CameraRoll manages photos authorization natively
    return true;
  },

  async requestPhotoPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'SwipeClean Photo Access',
              message:
                'SwipeClean needs access to your photos to help you review and declutter your camera roll on-device.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'SwipeClean Storage Access',
              message:
                'SwipeClean needs access to your local storage to find and organize photos.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (error) {
        console.warn('Error requesting photo permission:', error);
        return false;
      }
    }
    return true;
  },

  async checkNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const postNotification =
          (PermissionsAndroid.PERMISSIONS as Record<string, string>)
            .POST_NOTIFICATIONS || 'android.permission.POST_NOTIFICATIONS';
        return await PermissionsAndroid.check(postNotification as any);
      } catch (error) {
        console.warn('Error checking notification permission:', error);
        return false;
      }
    }
    return true;
  },

  async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const postNotification =
          (PermissionsAndroid.PERMISSIONS as Record<string, string>)
            .POST_NOTIFICATIONS || 'android.permission.POST_NOTIFICATIONS';
        const granted = await PermissionsAndroid.request(
          postNotification as any,
          {
            title: 'Streak Reminder Notifications',
            message:
              'Receive a quick reminder before your 24-hour cleaning streak resets.',
            buttonNeutral: 'Later',
            buttonNegative: 'Don’t Allow',
            buttonPositive: 'Allow',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.warn('Error requesting notification permission:', error);
        return false;
      }
    }
    return true;
  },

  async requestAllPermissions(): Promise<PermissionStatus> {
    const photoLibrary = await this.requestPhotoPermission();
    const notifications = await this.requestNotificationPermission();
    return { photoLibrary, notifications };
  },
};
