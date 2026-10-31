import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Palette } from '../../theme/colors';
import { getDiceBearAvatarUrl, getFruitItemByName } from '../../utils/fruitIdentity';

interface DiceBearAvatarProps {
  seed: string;
  styleName?: string;
  size?: number;
  showBorder?: boolean;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
  fallbackEmoji?: string;
}

export const DiceBearAvatar: React.FC<DiceBearAvatarProps> = ({
  seed,
  styleName = 'fun-emoji',
  size = 76,
  showBorder = true,
  borderColor = Palette.primary,
  style,
  fallbackEmoji,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const avatarUrl = useMemo(() => {
    setHasError(false);
    setIsLoading(true);
    return getDiceBearAvatarUrl(seed, styleName, Math.max(128, size * 2));
  }, [seed, styleName, size]);

  const fruit = useMemo(() => getFruitItemByName(seed), [seed]);
  const displayEmoji = fallbackEmoji || fruit?.emoji || '🥭';

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    showBorder && {
      borderWidth: size > 40 ? 2.5 : 1.5,
      borderColor: borderColor,
    },
    style,
  ];

  return (
    <View style={containerStyle}>
      {hasError ? (
        <View style={styles.fallbackContainer}>
          <Text style={[styles.fallbackEmoji, { fontSize: size * 0.45 }]}>
            {displayEmoji}
          </Text>
        </View>
      ) : (
        <>
          <Image
            source={{ uri: avatarUrl }}
            style={{
              width: size - (showBorder ? 4 : 0),
              height: size - (showBorder ? 4 : 0),
              borderRadius: (size - (showBorder ? 4 : 0)) / 2,
            }}
            resizeMode="cover"
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
          {isLoading && (
            <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
              <ActivityIndicator size="small" color={Palette.primary} />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(31, 28, 48, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackEmoji: {
    textAlign: 'center',
  },
  loadingOverlay: {
    backgroundColor: 'rgba(18, 16, 26, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
