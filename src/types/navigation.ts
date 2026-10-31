import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Photo } from './photo';

export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  Permissions: undefined;
  Swipe: undefined;
  BatchReview: {
    stagedPhotos: Photo[];
  };
  Celebration: {
    xpGained: number;
    bytesFreed: number;
    deletedCount: number;
  };
  Profile: undefined;
  PrivacyPolicy: undefined;
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
