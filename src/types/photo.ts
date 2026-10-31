export type SwipeDirection = 'keep' | 'trash';

export type PhotoFilter = 'all' | 'month' | 'screenshots' | 'videos';

export interface Photo {
  id: string;
  uri: string;
  alt: string;
  size: string;
  sizeBytes: number;
  month: string;
  timestamp?: number;
  isDevicePhoto?: boolean;
}

export interface SwipeRecord {
  photo: Photo;
  direction: SwipeDirection;
  timestamp: number;
}
