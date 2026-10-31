import {
  Award,
  Crown,
  Flame,
  HardDrive,
  Layers,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react-native';

export interface LevelInfo {
  level: number;
  title: string;
  currentLevelBaseXp: number;
  nextLevelTargetXp: number;
  xpInCurrentLevel: number;
  xpNeededForNext: number;
  progressRatio: number;
  xpRemaining: number;
}

export const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Apprentice Sweeper', minXp: 0 },
  { level: 2, title: 'Byte Scout', minXp: 250 },
  { level: 3, title: 'Cache Cleaner', minXp: 600 },
  { level: 4, title: 'Deck Crusher', minXp: 1100 },
  { level: 5, title: 'Storage Guardian', minXp: 1700 },
  { level: 6, title: 'Minimalist Master', minXp: 2500 },
  { level: 7, title: 'Gigabyte Slayer', minXp: 3500 },
  { level: 8, title: 'Zen Purifier', minXp: 4800 },
  { level: 9, title: 'Apex Archon', minXp: 6400 },
  { level: 10, title: 'Cosmic Cleanse Sovereign', minXp: 8500 },
];

export function getLevelInfo(score: number): LevelInfo {
  const safeScore = Math.max(0, score);
  let currentLevelIdx = 0;

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (safeScore >= LEVEL_THRESHOLDS[i].minXp) {
      currentLevelIdx = i;
      break;
    }
  }

  const currentLevel = LEVEL_THRESHOLDS[currentLevelIdx];
  const nextLevel = LEVEL_THRESHOLDS[currentLevelIdx + 1] ?? {
    level: currentLevel.level + 1,
    title: currentLevel.title,
    minXp: currentLevel.minXp + 2500,
  };

  const currentLevelBaseXp = currentLevel.minXp;
  const nextLevelTargetXp = nextLevel.minXp;
  const xpNeededForNext = Math.max(1, nextLevelTargetXp - currentLevelBaseXp);
  const xpInCurrentLevel = Math.max(0, safeScore - currentLevelBaseXp);
  const progressRatio = Math.min(1, Math.max(0, xpInCurrentLevel / xpNeededForNext));
  const xpRemaining = Math.max(0, nextLevelTargetXp - safeScore);

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentLevelBaseXp,
    nextLevelTargetXp,
    xpInCurrentLevel,
    xpNeededForNext,
    progressRatio,
    xpRemaining,
  };
}

export interface BadgeStats {
  photosCleanedCount: number;
  totalBytesCleaned: number;
  streakCount: number;
  decksCompletedCount: number;
  score: number;
  level: number;
}

export interface EvaluatedBadge {
  id: string;
  name: string;
  detail: string;
  lore: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  rewardXp: number;
  icon: any;
  accentColor: string;
  isUnlocked: boolean;
  currentValue: number;
  targetValue: number;
  progressRatio: number;
  progressText: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  detail: string;
  lore: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  rewardXp: number;
  icon: any;
  accentColor: string;
  evaluator: (stats: BadgeStats) => {
    isUnlocked: boolean;
    currentValue: number;
    targetValue: number;
    progressRatio: number;
    progressText: string;
  };
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'byte_sweeper',
    name: 'Byte Sweeper',
    detail: 'Clean 100 photos',
    lore: 'Took the first decisive leap into freeing up digital clutter.',
    tier: 'Bronze',
    rewardXp: 100,
    icon: Sparkles,
    accentColor: '#B298E7',
    evaluator: (stats) => {
      const target = 100;
      const current = stats.photosCleanedCount;
      const isUnlocked = current >= target;
      return {
        isUnlocked,
        currentValue: current,
        targetValue: target,
        progressRatio: Math.min(1, current / target),
        progressText: isUnlocked ? 'Unlocked' : `${current} / ${target} photos`,
      };
    },
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    detail: '7-day cleaning streak',
    lore: 'Maintained a persistent streak of 7 consecutive cleaning days.',
    tier: 'Silver',
    rewardXp: 250,
    icon: Flame,
    accentColor: '#F59E0B',
    evaluator: (stats) => {
      const target = 7;
      const current = stats.streakCount;
      const isUnlocked = current >= target;
      return {
        isUnlocked,
        currentValue: current,
        targetValue: target,
        progressRatio: Math.min(1, current / target),
        progressText: isUnlocked ? 'Unlocked' : `${current} / ${target} days`,
      };
    },
  },
  {
    id: 'gigabyte_slayer',
    name: 'Gigabyte Slayer',
    detail: 'Free 1 GB of storage',
    lore: 'Reclaimed one whole gigabyte of precious device space.',
    tier: 'Gold',
    rewardXp: 500,
    icon: Zap,
    accentColor: '#EAB308',
    evaluator: (stats) => {
      const target = 1024 * 1024 * 1024;
      const current = stats.totalBytesCleaned;
      const isUnlocked = current >= target;
      const currentGb = (current / (1024 * 1024 * 1024)).toFixed(1);
      return {
        isUnlocked,
        currentValue: current,
        targetValue: target,
        progressRatio: Math.min(1, current / target),
        progressText: isUnlocked ? 'Unlocked' : `${currentGb} / 1.0 GB`,
      };
    },
  },
  {
    id: 'deck_dynamo',
    name: 'Deck Dynamo',
    detail: 'Crush 10 photo decks',
    lore: 'Power-swiped through 10 full decks without breaking a sweat.',
    tier: 'Silver',
    rewardXp: 200,
    icon: Layers,
    accentColor: '#38BDF8',
    evaluator: (stats) => {
      const target = 10;
      const current = stats.decksCompletedCount;
      const isUnlocked = current >= target;
      return {
        isUnlocked,
        currentValue: current,
        targetValue: target,
        progressRatio: Math.min(1, current / target),
        progressText: isUnlocked ? 'Unlocked' : `${current} / ${target} decks`,
      };
    },
  },
  {
    id: 'clean_machine',
    name: 'Clean Machine',
    detail: 'Clean 500 photos',
    lore: 'A master of rapid decision-making with 500 photos swept.',
    tier: 'Gold',
    rewardXp: 600,
    icon: Trophy,
    accentColor: '#10B981',
    evaluator: (stats) => {
      const target = 500;
      const current = stats.photosCleanedCount;
      const isUnlocked = current >= target;
      return {
        isUnlocked,
        currentValue: current,
        targetValue: target,
        progressRatio: Math.min(1, current / target),
        progressText: isUnlocked ? 'Unlocked' : `${current} / ${target} photos`,
      };
    },
  },
  {
    id: 'storage_titan',
    name: 'Storage Titan',
    detail: 'Free 5 GB of storage',
    lore: 'Massive hoard of clutter vanquished from device storage.',
    tier: 'Diamond',
    rewardXp: 1000,
    icon: HardDrive,
    accentColor: '#A855F7',
    evaluator: (stats) => {
      const target = 5 * 1024 * 1024 * 1024;
      const current = stats.totalBytesCleaned;
      const isUnlocked = current >= target;
      const currentGb = (current / (1024 * 1024 * 1024)).toFixed(1);
      return {
        isUnlocked,
        currentValue: current,
        targetValue: target,
        progressRatio: Math.min(1, current / target),
        progressText: isUnlocked ? 'Unlocked' : `${currentGb} / 5.0 GB`,
      };
    },
  },
  {
    id: 'streak_legend',
    name: 'Streak Legend',
    detail: '30-day streak',
    lore: 'A true habit champion. Consistent daily sorting for a full month.',
    tier: 'Diamond',
    rewardXp: 1200,
    icon: Crown,
    accentColor: '#F43F5E',
    evaluator: (stats) => {
      const target = 30;
      const current = stats.streakCount;
      const isUnlocked = current >= target;
      return {
        isUnlocked,
        currentValue: current,
        targetValue: target,
        progressRatio: Math.min(1, current / target),
        progressText: isUnlocked ? 'Unlocked' : `${current} / ${target} days`,
      };
    },
  },
  {
    id: 'digital_minimalist',
    name: 'Digital Minimalist',
    detail: 'Reach Level 6 Master',
    lore: 'Ascended to Minimalist Master status with supreme photo zen.',
    tier: 'Gold',
    rewardXp: 750,
    icon: Award,
    accentColor: '#F59E0B',
    evaluator: (stats) => {
      const target = 6;
      const current = stats.level;
      const isUnlocked = current >= target;
      return {
        isUnlocked,
        currentValue: current,
        targetValue: target,
        progressRatio: Math.min(1, current / target),
        progressText: isUnlocked ? 'Unlocked' : `Level ${current} / ${target}`,
      };
    },
  },
];

export function evaluateAllBadges(stats: BadgeStats): EvaluatedBadge[] {
  return BADGE_DEFINITIONS.map((badge) => {
    const evalResult = badge.evaluator(stats);
    return {
      id: badge.id,
      name: badge.name,
      detail: badge.detail,
      lore: badge.lore,
      tier: badge.tier,
      rewardXp: badge.rewardXp,
      icon: badge.icon,
      accentColor: badge.accentColor,
      isUnlocked: evalResult.isUnlocked,
      currentValue: evalResult.currentValue,
      targetValue: evalResult.targetValue,
      progressRatio: evalResult.progressRatio,
      progressText: evalResult.progressText,
    };
  });
}
