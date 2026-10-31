export interface FruitItem {
  name: string;
  emoji: string;
  accentColor: string;
}

export const FRUIT_ADJECTIVES = [
  'Cosmic',
  'Velvet',
  'Electric',
  'Golden',
  'Ruby',
  'Sunny',
  'Wild',
  'Midnight',
  'Frosty',
  'Crisp',
  'Sweet',
  'Tangy',
  'Mystic',
  'Jolly',
  'Zesty',
  'Astral',
  'Turbo',
  'Chill',
  'Radiant',
  'Stellar',
  'Magic',
  'Dapper',
  'Neon',
  'Peachy',
  'Sparkling',
  'Zen',
  'Solar',
  'Lunar',
  'Hyper',
] as const;

export const FRUITS: FruitItem[] = [
  { name: 'Mango', emoji: '🥭', accentColor: '#F59E0B' },
  { name: 'Papaya', emoji: '🍈', accentColor: '#FB923C' },
  { name: 'Kiwi', emoji: '🥝', accentColor: '#84CC16' },
  { name: 'Peach', emoji: '🍑', accentColor: '#FB7185' },
  { name: 'Dragonfruit', emoji: '🐲', accentColor: '#EC4899' },
  { name: 'Pineapple', emoji: '🍍', accentColor: '#EAB308' },
  { name: 'Blueberry', emoji: '🫐', accentColor: '#6366F1' },
  { name: 'Tangerine', emoji: '🍊', accentColor: '#F97316' },
  { name: 'Lime', emoji: '🍋', accentColor: '#A3E635' },
  { name: 'Cherry', emoji: '🍒', accentColor: '#EF4444' },
  { name: 'Coconut', emoji: '🥥', accentColor: '#E2E8F0' },
  { name: 'Guava', emoji: '🍈', accentColor: '#F472B6' },
  { name: 'Watermelon', emoji: '🍉', accentColor: '#10B981' },
  { name: 'Apricot', emoji: '🍑', accentColor: '#FDBA74' },
  { name: 'Starfruit', emoji: '⭐', accentColor: '#FACC15' },
  { name: 'Passionfruit', emoji: '🫐', accentColor: '#A855F7' },
  { name: 'Lychee', emoji: '🍒', accentColor: '#F43F5E' },
  { name: 'Raspberry', emoji: '🫐', accentColor: '#E11D48' },
  { name: 'Strawberry', emoji: '🍓', accentColor: '#F43F5E' },
  { name: 'Plum', emoji: '🫐', accentColor: '#9333EA' },
  { name: 'Yuzu', emoji: '🍋', accentColor: '#FDE047' },
];

export interface DiceBearStyleOption {
  id: string;
  name: string;
  description: string;
}

export const DICEBEAR_STYLES: DiceBearStyleOption[] = [
  { id: 'fun-emoji', name: 'Emoji', description: 'Playful expressions' },
  { id: 'bottts', name: 'Bottts', description: 'Friendly robot avatars' },
  { id: 'adventurer', name: 'Adventurer', description: 'Hand-drawn adventurers' },
  { id: 'lorelei', name: 'Lorelei', description: 'Modern illustrated portraits' },
  { id: 'thumbs', name: 'Thumbs', description: 'Cheerful thumbs-up' },
];

/**
 * Generate a random fruit identity
 * e.g., "Cosmic Mango"
 */
export function getRandomFruitIdentity(): {
  fullName: string;
  adjective: string;
  fruit: FruitItem;
} {
  const adj = FRUIT_ADJECTIVES[Math.floor(Math.random() * FRUIT_ADJECTIVES.length)];
  const fruit = FRUITS[Math.floor(Math.random() * FRUITS.length)];
  return {
    fullName: `${adj} ${fruit.name}`,
    adjective: adj,
    fruit,
  };
}

export function getRandomFruitName(): string {
  return getRandomFruitIdentity().fullName;
}

export function getFruitItemByName(name: string): FruitItem | undefined {
  const parts = name.trim().split(' ');
  const fruitName = parts[parts.length - 1];
  return FRUITS.find(
    (f) => f.name.toLowerCase() === fruitName.toLowerCase()
  );
}

/**
 * Build DiceBear Avatar HTTP API URL
 * Following official React Native guide:
 * https://www.dicebear.com/guides/use-the-library-with-react-native/
 */
export function getDiceBearAvatarUrl(
  seed: string,
  style: string = 'fun-emoji',
  size: number = 256
): string {
  const safeSeed = encodeURIComponent(seed.trim() || 'CosmicMango');
  const safeStyle = encodeURIComponent(style.trim() || 'fun-emoji');
  return `https://api.dicebear.com/9.x/${safeStyle}/png?seed=${safeSeed}&size=${size}&radius=50`;
}
