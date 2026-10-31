import React from 'react';
import { Image, ImageStyle, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Photo } from '../../types/photo';
import { Palette } from '../../theme/colors';
import { Layout } from '../../theme/layout';

interface PhotoCardProps {
  photo: Photo;
  isTopCard?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  return (
    <View style={styles.cardInner}>
      <Image
        key={photo.uri}
        source={{ uri: photo.uri }}
        style={styles.image as ImageStyle}
        resizeMode="cover"
        fadeDuration={0}
      />

      {/* Bottom gradient overlay for readability */}
      <View style={styles.gradientContainer} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#05060A" stopOpacity={0} />
              <Stop offset="45%" stopColor="#05060A" stopOpacity={0.3} />
              <Stop offset="100%" stopColor="#05060A" stopOpacity={0.92} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#cardGrad)" />
        </Svg>
      </View>

      {/* Info bar at the bottom */}
      <View style={styles.infoBar} pointerEvents="none">
        <View style={styles.sizePill}>
          <Text style={styles.sizeText}>{photo.size}</Text>
        </View>
        <Text style={styles.monthText}>{photo.month}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardInner: {
    flex: 1,
    borderRadius: Layout.radius.card,
    overflow: 'hidden',
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  infoBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sizePill: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: Layout.radius.pill,
    backgroundColor: 'rgba(15, 16, 21, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  sizeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  monthText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
});
