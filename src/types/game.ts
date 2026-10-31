export interface BadgeItem {
  id: string;
  name: string;
  detail: string;
  iconType: 'check' | 'flame' | 'zap' | 'lock' | 'sparkles';
  unlocked: boolean;
  progressPercent?: number;
}

export interface UserProfileData {
  level: number;
  levelTitle: string;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number;
  reclaimedSpaceGb: number;
  photosCleanedCount: number;
}
